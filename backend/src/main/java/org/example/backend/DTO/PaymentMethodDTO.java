package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.user.Bank;
import org.example.backend.model.user.PaymentMethod;

@Data
public class PaymentMethodDTO {
    private Bank bank;
    private String details;

    public PaymentMethodDTO(PaymentMethod pm) {
        this.setBank(pm.getBank());
        this.setDetails(pm.getEncryptedDetails());
    }

}
