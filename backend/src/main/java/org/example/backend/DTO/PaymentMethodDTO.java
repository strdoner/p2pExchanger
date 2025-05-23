package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.user.Bank;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.utils.AESUtils;

@Data
public class PaymentMethodDTO {
    private Bank bank;
    private String cardHolderName;
    private String details;

    public PaymentMethodDTO(PaymentMethod pm) throws Exception {
        this.setBank(pm.getBank());
        this.setCardHolderName(pm.getCardHolderName());
        this.setDetails(AESUtils.decrypt(pm.getEncryptedDetails()));
    }

}
