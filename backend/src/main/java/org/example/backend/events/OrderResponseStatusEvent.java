package org.example.backend.events;

import lombok.Getter;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.springframework.context.ApplicationEvent;

@Getter
public class OrderResponseStatusEvent extends ApplicationEvent {
    private final OrderResponse response;
    private final OrderStatus status;

    public OrderResponseStatusEvent(Object source, OrderResponse response, OrderStatus status) {
        super(source);
        this.response = response;
        this.status = status;
    }
}
