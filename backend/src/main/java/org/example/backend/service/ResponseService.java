package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.events.OrderEvent;
import org.example.backend.events.OrderResponseStatusEvent;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.example.backend.repository.OrderResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.statemachine.support.DefaultStateMachineContext;
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
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final StateMachineFactory<OrderStatus, OrderEvent> stateMachineFactory;

    private StateMachine<OrderStatus, OrderEvent> getStateMachineForOrder(OrderResponse response) {
        StateMachine<OrderStatus, OrderEvent> stateMachine = stateMachineFactory.getStateMachine();
        stateMachine.startReactively().subscribe();

        stateMachine.getExtendedState().getVariables().put("response", response);

        stateMachine.getStateMachineAccessor().doWithAllRegions(accessor -> {
            accessor.resetStateMachineReactively(new DefaultStateMachineContext<>(response.getStatus(), null, null, null)).subscribe();
        });
        return stateMachine;
    }


    private boolean hasPermission(OrderResponse response, User user, OrderEvent event) {
        if (isAdmin(user)) {
            return true;
        }
        switch (event) {
            case CONFIRM -> {
                return isBuyer(response, user);
            }
            case COMPLETE -> {
                return isSeller(response, user);
            }
            case CANCEL, DISPUTE -> {
                return isBuyer(response, user) || isSeller(response, user);
            }
            default -> {
                return false;
            }
        }
    }

    private boolean isAdmin(User user) {
        return Objects.equals(user.getRole().getName(), "ROLE_ADMIN");
    }

    public OrderResponse processEvent(Long responseId, OrderEvent event, User user) throws AccessDeniedException {
        OrderResponse response = orderResponseRepository.findById(responseId).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );

        if (!hasPermission(response, user, event)) {
            throw new AccessDeniedException("У вас недостаточно прав");
        }

        response.setStatusChangingTime(LocalDateTime.now());
        StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachineForOrder(response);

        if (!stateMachine.sendEvent(event)) {
            throw new IllegalStateException(
                    "Cannot process event " + event +
                            " for order " + responseId +
                            ". Current state: " + stateMachine.getState().getId()
            );
        }

        response.setStatus(stateMachine.getState().getId());
        OrderResponse saved = orderResponseRepository.save(response);

        if (stateMachine.getState().getId() == OrderStatus.CONFIRMATION) {
            scheduleOrderHandling(saved.getId(), OrderStatus.CONFIRMATION, OrderStatus.DISPUTED);
        }

        return response;
    }

    public static boolean isSeller(OrderResponse response, User user) {
        if (response.getOrder().getType() == OrderType.BUY) {
            return Objects.equals(response.getTaker().getId(), user.getId());
        }
        else {
            return Objects.equals(response.getOrder().getMaker().getId(), user.getId());
        }
    }

    public static  boolean isBuyer(OrderResponse response, User user) {
        if (response.getOrder().getType() == OrderType.BUY) {
            return Objects.equals(response.getOrder().getMaker().getId(), user.getId());
        }
        else {
            return Objects.equals(response.getTaker().getId(), user.getId());
        }
    }

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
            StateMachine<OrderStatus, OrderEvent> stateMachine = getStateMachineForOrder(response);
            if (!stateMachine.sendEvent(OrderEvent.TIMEOUT)) {
                System.out.println("ERROR via sending event");
            } else {
                response.setStatus(stateMachine.getState().getId());
                response.setStatusChangingTime(LocalDateTime.now());
                orderResponseRepository.save(response);
            }

        }
    }

    public OrderResponse createResponse(Order order, User user) {
        OrderResponse response = new OrderResponse();

        response.setOrder(order);
        response.setTaker(user);

        OrderResponse saved = changeResponseStatus(response, OrderStatus.ACTIVE);

//        sm.getExtendedState().getTimerManager().startTimer("timeout", 15, TimeUnit.MINUTES);

        scheduleOrderHandling(saved.getId(), OrderStatus.ACTIVE, OrderStatus.CANCELLED);
        return saved;
    }



    public OrderResponse read(User user, long id) {
        OrderResponse orderResponse = orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!"));
        if (!isBuyer(orderResponse, user) && !isSeller(orderResponse, user)) {
            throw new AccessDeniedException("У вас недостаточно прав");
        }

        return orderResponse;

    }

    public OrderResponse cancelResponse(Long id, User user) throws AccessDeniedException {
        return processEvent(id, OrderEvent.CANCEL, user);
    }

    public OrderResponse changeStatusByAdmin(OrderResponse response, OrderEvent event, User user) {

        return processEvent(response.getId(), event, user);
    }
    public OrderResponse completeResponse(Long id, User user) throws AccessDeniedException {
        return processEvent(id, OrderEvent.COMPLETE, user);
    }



    public OrderResponse confirmResponse(Long id, User user) throws AccessDeniedException {
        return processEvent(id, OrderEvent.CONFIRM, user);
    }

    public OrderResponse createDispute(Long id, User user) throws AccessDeniedException {
        return processEvent(id, OrderEvent.DISPUTE, user);
    }

    public OrderResponse changeResponseStatus(OrderResponse response, OrderStatus status) {
        response.setStatus(status);
        response.setStatusChangingTime(LocalDateTime.now());
        orderResponseRepository.save(response);

        eventPublisher.publishEvent(new OrderResponseStatusEvent(this, response, status));
        return response;
    }
}
