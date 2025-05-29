package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.user.Bank;
import org.example.backend.model.user.PaymentMethod;

@Data
public class EncryptedPaymentMethodDTO {
    private Long id;
    private Bank bank;
    private String lastFour;
    private String cardHolderName;

    public EncryptedPaymentMethodDTO(PaymentMethod method) {
        this.setId(method.getId());
        this.setBank(method.getBank());
        this.setLastFour(method.getLastFour());
        this.setCardHolderName(method.getCardHolderName());
    }
}
