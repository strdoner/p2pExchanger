package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.DTO.ResponseWebSocketDTO;
import org.example.backend.model.NotificationType;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.Balance;
import org.example.backend.model.user.User;
import org.example.backend.repository.BalanceRepository;
import org.example.backend.repository.OrderRepository;
import org.example.backend.repository.OrderResponseRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ResponseService {

    private final OrderResponseRepository orderResponseRepository;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    private final BalanceRepository balanceRepository;
    private final SimpMessagingTemplate messagingTemplate;
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
            response.setStatus(to);
            orderResponseRepository.save(response);
            if (to == OrderStatus.CANCELLED) {
                Order order = response.getOrder();
                order.setIsAvailable(true);
                unlockCurrency(response);

                orderRepository.save(order);
            }
            notifyAboutStatusChanging(response, response.getTaker());
            notifyAboutStatusChanging(response, response.getOrder().getMaker());
        }
    }

    public OrderResponse createResponse(Order order, User user) {
        OrderResponse response = new OrderResponse();

        response.setOrder(order);
        response.setTaker(user);
        response.setStatus(OrderStatus.ACTIVE);
        OrderResponse saved = orderResponseRepository.save(response);
        notifyAboutStatusChanging(saved, order.getMaker());
        scheduleOrderHandling(saved.getId(), OrderStatus.ACTIVE, OrderStatus.CANCELLED);
        return saved;
    }

    public void notifyAboutStatusChanging(OrderResponse response, User user) {
        NotificationCreationDTO notification = new NotificationCreationDTO();
        switch (response.getStatus()) {
            case ACTIVE -> notification.setMessage("На ваше объявление № "+ response.getId() +" был получен отклик");
            case CANCELLED -> notification.setMessage("Объявление № " + response.getId() + " было отменено");
            case COMPLETED -> notification.setMessage("Объявление № " + response.getId() + " было успешно завершено");
            case CONFIRMATION -> notification.setMessage("Объявление № " + response.getId() + " ожидает вашего подтверждения");
            case DISPUTED -> notification.setMessage("Объявление № " + response.getId() + " было отправлено на разбирательство");
        }
        notification.setType(NotificationType.ORDER_STATUS_CHANGE);
        notification.setTitle("Изменение статуса объявления");
        notification.setResponseId(response.getId());
        notification.setUser(user);
        notificationService.createAndSendNotification(notification);

        ResponseWebSocketDTO responseWebSocketDTO = new ResponseWebSocketDTO();
        responseWebSocketDTO.setId(response.getId());
        responseWebSocketDTO.setStatus(response.getStatus().toString());
        responseWebSocketDTO.setStatusChangingTime(response.getStatusChangingTime());
        messagingTemplate.convertAndSendToUser(
                notification.getUser().getUsername(),
                "/queue/responses",
                responseWebSocketDTO
        );


    }

    public OrderResponse read(User user, long id) {
        OrderResponse orderResponse = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!"));
        if (!Objects.equals(orderResponse.getOrder().getMaker().getId(), user.getId()) && !Objects.equals(orderResponse.getTaker().getId(), user.getId())) {
            return null;
        }

        return orderResponse;

    }

    public OrderResponse cancelResponse(Long id, User user) {
        OrderResponse response = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );

        if (Objects.equals(response.getTaker().getId(), user.getId()) || Objects.equals(response.getOrder().getMaker().getId(), user.getId())) {
            Order order = response.getOrder();
            order.setIsAvailable(true);

            orderRepository.save(order);
            response.setStatus(OrderStatus.CANCELLED);
            response.setStatusChangingTime(LocalDateTime.now());
            orderResponseRepository.save(response);
            unlockCurrency(response);
            notifyAboutStatusChanging(response, response.getTaker());
            notifyAboutStatusChanging(response, response.getOrder().getMaker());
            return response;
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
                ((response.getOrder().getType() == OrderType.BUY) && Objects.equals(response.getTaker().getId(), user.getId())) ||
                ((response.getOrder().getType() == OrderType.SELL) && Objects.equals(response.getOrder().getMaker().getId(), user.getId()))
        ) {
            response.setStatus(OrderStatus.COMPLETED);
            response.setStatusChangingTime(LocalDateTime.now());
            orderResponseRepository.save(response);
            unlockCurrency(response);
            notifyAboutStatusChanging(response, response.getTaker());
            notifyAboutStatusChanging(response, response.getOrder().getMaker());

            return response;
        }
        else {
            return null;
        }
    }

    public void unlockCurrency(OrderResponse response) {
        User user;
        if (response.getOrder().getType() == OrderType.BUY) {
            user = response.getTaker();
        }
        else {
            user = response.getOrder().getMaker();
        }
        Balance userBalance = balanceRepository.findBalanceByUserAndCurrency(user, response.getOrder().getCurrency());
        userBalance.setLocked(userBalance.getLocked().subtract(response.getOrder().getAmount()));
        if (response.getStatus() == OrderStatus.CANCELLED) {
            userBalance.setAvailable(userBalance.getAvailable().add(response.getOrder().getAmount()));
        }
        balanceRepository.save(userBalance);
    }

    public OrderResponse confirmResponse(Long id, User user) {
        OrderResponse response = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );

        if (
                ((response.getOrder().getType() == OrderType.BUY) && Objects.equals(response.getOrder().getMaker().getId(), user.getId())) ||
                ((response.getOrder().getType() == OrderType.SELL) && Objects.equals(response.getTaker().getId(), user.getId()))
        ) {
            response.setStatus(OrderStatus.CONFIRMATION);
            response.setStatusChangingTime(LocalDateTime.now());
            orderResponseRepository.save(response);

            notifyAboutStatusChanging(response, response.getTaker());
            notifyAboutStatusChanging(response, response.getOrder().getMaker());
            scheduleOrderHandling(response.getId(), OrderStatus.CONFIRMATION, OrderStatus.CANCELLED);

            return response;
        }
        else {
            return null;
        }
    }
}
