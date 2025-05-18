package org.example.backend.model.order;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum DisputeStatus {
    OPEN("Открыт", "yellow"),
    RESOLVED("Решен", "green");

    private final String name;
    private final String color;

    public static DisputeStatus fromString(String value) {
        if (value == null) return null;
        try {
            return DisputeStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
