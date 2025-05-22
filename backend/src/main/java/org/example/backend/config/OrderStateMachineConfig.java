package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.events.OrderEvent;
import org.example.backend.events.OrderResponseStatusEvent;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.action.Action;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.state.State;


import java.util.EnumSet;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableStateMachineFactory
@RequiredArgsConstructor
public class OrderStateMachineConfig extends EnumStateMachineConfigurerAdapter<OrderStatus, OrderEvent> {
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public void configure(StateMachineStateConfigurer<OrderStatus, OrderEvent> states) throws Exception {
        states
                .withStates()
                .initial(OrderStatus.ACTIVE)
                .states(EnumSet.allOf(OrderStatus.class));
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OrderStatus, OrderEvent> transitions) throws Exception {
        transitions
                .withExternal()
                .source(OrderStatus.ACTIVE)
                .target(OrderStatus.CONFIRMATION)
                .event(OrderEvent.CONFIRM)
                .action(publishStatusChangeEvent(eventPublisher))
                .and()
                .withExternal()
                .source(OrderStatus.CONFIRMATION)
                .target(OrderStatus.COMPLETED)
                .event(OrderEvent.COMPLETE)
                .action(publishStatusChangeEvent(eventPublisher))
                .and()
                .withExternal()
                .source(OrderStatus.ACTIVE)
                .target(OrderStatus.CANCELLED)
                .event(OrderEvent.CANCEL)
                .action(publishStatusChangeEvent(eventPublisher))
                .and()
                .withExternal()
                .source(OrderStatus.CONFIRMATION)
                .target(OrderStatus.DISPUTED)
                .event(OrderEvent.DISPUTE)
                .action(publishStatusChangeEvent(eventPublisher))
                .and()
                .withExternal()
                .source(OrderStatus.ACTIVE)
                .target(OrderStatus.CANCELLED)
                .event(OrderEvent.TIMEOUT)
                .action(publishStatusChangeEvent(eventPublisher))
                .and()
                .withExternal()
                .source(OrderStatus.CONFIRMATION)
                .target(OrderStatus.DISPUTED)
                .event(OrderEvent.TIMEOUT)
                .action(publishStatusChangeEvent(eventPublisher))
                .and()
                .withExternal()
                .source(OrderStatus.DISPUTED)
                .target(OrderStatus.COMPLETED)
                .event(OrderEvent.COMPLETE)
                .action(publishStatusChangeEvent(eventPublisher))
                .and()
                .withExternal()
                .source(OrderStatus.DISPUTED)
                .target(OrderStatus.CANCELLED)
                .event(OrderEvent.CANCEL)
                .action(publishStatusChangeEvent(eventPublisher));



    }



    @Bean
    public Action<OrderStatus, OrderEvent> publishStatusChangeEvent(ApplicationEventPublisher eventPublisher) {
        return context -> {
            OrderResponse response = context.getExtendedState().get("response", OrderResponse.class);
            OrderStatus newStatus = context.getTarget().getId();
            System.out.println("Текущий статус машины - " + context.getTarget().getId().toString());
            eventPublisher.publishEvent(new OrderResponseStatusEvent(this, response, newStatus));
        };
    }

}
