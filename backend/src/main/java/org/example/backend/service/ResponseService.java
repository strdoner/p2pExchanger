package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.OrderDetailsDTO;
import org.example.backend.DTO.OrderRequestDTO;
import org.example.backend.DTO.OrderResponseDTO;
import org.example.backend.DTO.OrderWithStatusDTO;
import org.example.backend.events.OrderResponseStatusEvent;
import org.example.backend.model.Currency;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.example.backend.repository.CurrencyRepository;
import org.example.backend.repository.OrderResponseRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ResponseService {

    private final ApplicationEventPublisher eventPublisher;
    private final OrderResponseRepository orderResponseRepository;
    private final CurrencyRepository currencyRepository;
    private final PaymentMethodService paymentMethodService;
    private final BalanceService balanceService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    private void scheduleOrderHandling(Long responseId, OrderStatus from, OrderStatus to) {
        scheduler.schedule(() -> {
            try {
                toIfStillFrom(responseId, from, to);
            } catch (Exception e) {
                System.out.println("Error during scheduled order cancellation");
            }
        }, 15, TimeUnit.MINUTES);
    }


    public void toIfStillFrom(Long responseId, OrderStatus from, OrderStatus to) {
        OrderResponse response = orderResponseRepository.findById(responseId)
                .orElseThrow(() -> new EntityNotFoundException("Order response not found"));

        if (response.getStatus() == from) {
            changeResponseStatus(response, to);
            response.setStatus(to);
            orderResponseRepository.save(response);

        }
    }

    public OrderDetailsDTO makeActiveResponse(Long id, User user) throws Exception {
        OrderResponse response = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );
        if (response.getType() == OrderType.BUY) {
            response.setMaker(user);
        }
        else {
            response.setTaker(user);
        }

        OrderResponse saved = changeResponseStatus(response, OrderStatus.ACTIVE);

        scheduleOrderHandling(saved.getId(), OrderStatus.ACTIVE, OrderStatus.CANCELLED);
        return new OrderDetailsDTO(saved);
    }



    public OrderResponse read(User user, long id) {
        OrderResponse orderResponse = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!"));
        if (!Objects.equals(orderResponse.getMaker().getId(), user.getId()) && !Objects.equals(orderResponse.getTaker().getId(), user.getId())) {
            return null;
        }

        return orderResponse;

    }

    public OrderResponse createResponse(OrderRequestDTO responseDTO, User user) {
        Currency currency = currencyRepository.findByShortName(responseDTO.getCurrency()).orElseThrow(
                () -> new EntityNotFoundException("Криптовалюта не найдена!")
        );

        OrderResponse response = new OrderResponse();
        if (responseDTO.getType() == OrderType.BUY) {
            response.setTaker(user);
        }
        else {
            if (!balanceService.checkUserBalance(user, currency, responseDTO.getAmount())) {
                throw new IllegalArgumentException("Недостаточно средств на балансе!"); // TODO custom exception
            }
            response.setMaker(user);
        }
        PaymentMethod pm = paymentMethodService.findById(responseDTO.getPaymentMethodId());
        response.setCurrency(currency);
        response.setPaymentMethod(pm);
        response.copyFrom(responseDTO);
        return changeResponseStatus(response, OrderStatus.PENDING);
    }

    public OrderResponse cancelResponse(Long id, User user) {
        OrderResponse response = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );

        if (Objects.equals(response.getTaker().getId(), user.getId()) || Objects.equals(response.getMaker().getId(), user.getId())) {
            return changeResponseStatus(response, OrderStatus.CANCELLED);
        }
        else {
            return null;
        }
    }

    public OrderResponse completeResponse(Long id, User user) {
        OrderResponse response = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );
        if (
                ((response.getType() == OrderType.BUY) && Objects.equals(response.getTaker().getId(), user.getId())) ||
                ((response.getType() == OrderType.SELL) && Objects.equals(response.getMaker().getId(), user.getId()))
        ) {
            return changeResponseStatus(response, OrderStatus.COMPLETED);
        }
        else {
            return null;
        }
    }



    public OrderResponse confirmResponse(Long id, User user) {
        OrderResponse response = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );

        if (
                ((response.getType() == OrderType.BUY) && Objects.equals(response.getMaker().getId(), user.getId())) ||
                ((response.getType() == OrderType.SELL) && Objects.equals(response.getTaker().getId(), user.getId()))
        ) {
            response = changeResponseStatus(response, OrderStatus.CONFIRMATION);

            scheduleOrderHandling(response.getId(), OrderStatus.CONFIRMATION, OrderStatus.CANCELLED);
            return response;
        }
        else {
            return null;
        }
    }

    public OrderResponse changeResponseStatus(OrderResponse response, OrderStatus status) {
        response.setStatus(status);
        response.setStatusChangingTime(LocalDateTime.now());
        orderResponseRepository.save(response);

        eventPublisher.publishEvent(new OrderResponseStatusEvent(this, response, status));
        return response;
    }

    public Page<OrderResponseDTO> getPendingResponses(String method, String coin, String type, User user, Pageable paging) {

        Page<OrderResponse> pages = orderResponseRepository.findPendingOrders(
                method,
                coin,
                type,
                user,
                paging
        );

        return pages.map(response -> {
            User maker = response.getMaker();

            long totalMakerOrders = orderResponseRepository.countByTaker(maker) + orderResponseRepository.countByMaker(maker);
            long completedMakerOrders = orderResponseRepository.countByTakerAndStatus(maker, OrderStatus.COMPLETED) + orderResponseRepository.countByMakerAndStatus(maker, OrderStatus.COMPLETED);
            Long completionPercentage = totalMakerOrders > 0
                    ? (long) (((double) completedMakerOrders / totalMakerOrders) * 100)
                    : 0;

            return new OrderResponseDTO(
                    response,
                    totalMakerOrders,
                    completionPercentage
            );
        });

    }

    public Page<OrderWithStatusDTO> getUserResponses(Long userId, String responseStatus, String currency, OrderType type, Pageable paging) {

        Page<OrderResponse> resultPage = orderResponseRepository.findUserResponses(
                userId,
                currency,
                type,
                OrderStatus.fromString(responseStatus),
                paging
        );

        return resultPage.map(response -> {
            User contragent;
            if (response.getMaker() == null) {
                contragent = response.getTaker();
            }
            else if (response.getTaker() == null) {
                contragent = response.getMaker();
            }
            else {
                contragent = Objects.equals(response.getMaker().getId(), userId) ? response.getTaker() : response.getMaker();
            }

            return new OrderWithStatusDTO(
                    response,
                    contragent
            );
        });
    }

    public void makePendingResponse(OrderResponse response) {
        response.setStatus(OrderStatus.PENDING);
        if (response.getType() == OrderType.BUY) {
            response.setMaker(null);
        }
        else {
            response.setTaker(null);
        }
        orderResponseRepository.save(response);
    }
}
