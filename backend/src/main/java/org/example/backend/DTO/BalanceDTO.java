package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.user.Balance;

import java.math.BigDecimal;

@Data
public class BalanceDTO {
    private Long id;
    private String currencyName;
    private String currency;
    private BigDecimal available;
    private BigDecimal locked;

    public BalanceDTO(Balance balance) {
        this.setId(balance.getId());
        this.setCurrencyName(balance.getCurrency().getName());
        this.setCurrency(balance.getCurrency().getShortName());
        this.setAvailable(balance.getAvailable());
        this.setLocked(balance.getLocked());
    }
}
