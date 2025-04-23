package org.example.backend.model.user;

public enum Bank {
    SBERBANK("Сбербанк"),
    T_BANK("Т-Банк"),
    VTB("ВТБ"),
    ALFABANK("Альфабанк"),
    YOO_MONEY("ЮMoney"),
    RAIFFEISEN("Райффайзен");

    private final String displayName;

    Bank(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
