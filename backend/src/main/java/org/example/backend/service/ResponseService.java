package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.NotificationCreationDTO;
import org.example.backend.model.NotificationType;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.example.backend.repository.OrderRepository;
import org.example.backend.repository.OrderResponseRepository;
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

            NotificationCreationDTO notification = new NotificationCreationDTO();
            notification.setMessage("Объявление № " + id + " было отменено");
            notification.setType(NotificationType.ORDER_STATUS_CHANGE);
            notification.setTitle("Изменение статуса объявления");
            notification.setResponseId(id);
            notification.setUser(
                    Objects.equals(response.getOrder().getMaker().getId(), user.getId())
                            ? response.getTaker()
                            : response.getOrder().getMaker()
            );
            notificationService.createAndSendNotification(notification);
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

            NotificationCreationDTO notification = new NotificationCreationDTO();
            notification.setMessage("Объявление № " + id + " было успешно завершено");
            notification.setType(NotificationType.ORDER_STATUS_CHANGE);
            notification.setTitle("Изменение статуса объявления");
            notification.setResponseId(id);
            notification.setUser(
                    Objects.equals(response.getOrder().getMaker().getId(), user.getId())
                            ? response.getTaker()
                            : response.getOrder().getMaker()
                    );
            notificationService.createAndSendNotification(notification);

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

            NotificationCreationDTO notification = new NotificationCreationDTO();
            notification.setMessage("Объявление № " + id + " ожидает вашего подтверждения");
            notification.setType(NotificationType.ORDER_STATUS_CHANGE);
            notification.setTitle("Изменение статуса объявления");
            notification.setResponseId(id);
            notification.setUser(
                    Objects.equals(response.getOrder().getMaker().getId(), user.getId())
                            ? response.getTaker()
                            : response.getOrder().getMaker()
            );
            notificationService.createAndSendNotification(notification);
            return response;
        }
        else {
            return null;
        }
    }
}
