package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.example.backend.repository.OrderResponseRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResponseService {

    private final OrderResponseRepository orderResponseRepository;

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
            response.setStatus(OrderStatus.CANCELLED);
            orderResponseRepository.save(response);
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
        if (((response.getOrder().getType() == OrderType.SELL) && Objects.equals(response.getTaker().getId(), user.getId())) ||
            ((response.getOrder().getType() == OrderType.BUY) && Objects.equals(response.getOrder().getMaker().getId(), user.getId()))
        ) {
            response.setStatus(OrderStatus.COMPLETED);
            orderResponseRepository.save(response);
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

        if (((response.getOrder().getType() == OrderType.BUY) && Objects.equals(response.getTaker().getId(), user.getId())) ||
                ((response.getOrder().getType() == OrderType.SELL) && Objects.equals(response.getOrder().getMaker().getId(), user.getId()))
        ) {
            response.setStatus(OrderStatus.CONFIRMATION);
            orderResponseRepository.save(response);
            return response;
        }
        else {
            return null;
        }
    }
}
