package org.example.backend.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BalanceRequestDTO {
    private String currency;
    private BigDecimal amount;
}
