package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.DTO.ResponseWebSocketDTO;
import org.example.backend.model.NotificationType;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.example.backend.repository.OrderRepository;
import org.example.backend.repository.OrderResponseRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResponseService {

    private final OrderResponseRepository orderResponseRepository;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public void notifyAboutStatusChanging(OrderResponse response, User user) {
        NotificationCreationDTO notification = new NotificationCreationDTO();
        switch (response.getStatus()) {
            case CANCELLED -> notification.setMessage("Объявление № " + response.getId() + " было отменено");
            case COMPLETED -> notification.setMessage("Объявление № " + response.getId() + " было успешно завершено");
            case CONFIRMATION -> notification.setMessage("Объявление № " + response.getId() + " ожидает вашего подтверждения");
            case DISPUTED -> notification.setMessage("Объявление № " + response.getId() + " было отправлено на разбирательство");
        }
        notification.setType(NotificationType.ORDER_STATUS_CHANGE);
        notification.setTitle("Изменение статуса объявления");
        notification.setResponseId(response.getId());
        notification.setUser(
                Objects.equals(response.getOrder().getMaker().getId(), user.getId())
                        ? response.getTaker()
                        : response.getOrder().getMaker()
        );
        notificationService.createAndSendNotification(notification);

        ResponseWebSocketDTO responseWebSocketDTO = new ResponseWebSocketDTO();
        responseWebSocketDTO.setId(response.getId());
        responseWebSocketDTO.setStatus(response.getStatus().toString());

        messagingTemplate.convertAndSendToUser(
                response.getOrder().getMaker().getId().toString(),
                "/queue/responses",
                responseWebSocketDTO
        );
        messagingTemplate.convertAndSendToUser(
                response.getTaker().getId().toString(),
                "/queue/responses",
                responseWebSocketDTO
        );

    }

    public OrderResponse read(long id) {
        return orderResponseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Запись не найдена!")
        );

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
            orderResponseRepository.save(response);
            notifyAboutStatusChanging(response, user);

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
            orderResponseRepository.save(response);

            notifyAboutStatusChanging(response, user);

            return response;
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
                ((response.getOrder().getType() == OrderType.BUY) && Objects.equals(response.getOrder().getMaker().getId(), user.getId())) ||
                ((response.getOrder().getType() == OrderType.SELL) && Objects.equals(response.getTaker().getId(), user.getId()))
        ) {
            response.setStatus(OrderStatus.CONFIRMATION);
            orderResponseRepository.save(response);

            notifyAboutStatusChanging(response, user);
            return response;
        }
        else {
            return null;
        }
    }
}
