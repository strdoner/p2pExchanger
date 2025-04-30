package org.example.backend.model.order;

public enum OrderStatus {
    ACTIVE("Активен"),
    COMPLETED("Завершен"),
    CANCELLED("Отменен"),
    IN_PROCESS("В процессе"),
    DISPUTED("На обжаловании"),
    PENDING("Ожидание");
    private String name;

    OrderStatus(String text) {
        this.name = text;
    }

    public String getName() {
        return name;
    }

    public static OrderStatus fromString(String value) {
        if (value == null) return null;
        try {
            return OrderStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
