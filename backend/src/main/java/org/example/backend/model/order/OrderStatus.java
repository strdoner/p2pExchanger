package org.example.backend.model.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
@Getter
@AllArgsConstructor
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum OrderStatus {
    ACTIVE("Активен", "yellow"),
    COMPLETED("Завершен", "green"),
    CANCELLED("Отменен", "red"),
    CONFIRMATION("Ожидает подтверждения", "blue"),
    DISPUTED("Открыт диспут", "orange"),
    PENDING("Ожидает отклика", "gray");

    private final String name;
    private final String color;


    public static OrderStatus fromString(String value) {
        if (value == null) return null;
        try {
            return OrderStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
