package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.user.User;

import java.util.List;

@Data
public class FullUserInfoDTO {
    private String username;
    private Long ordersCount;
    private Long successBuysCount;
    private Long successSellsCount;
    private Long successPercent;
    private List<EncryptedPaymentMethodDTO> paymentMethods;

    public FullUserInfoDTO(User user, Long ordersCount, Long successBuysCount, Long successSellsCount, Long successPercent, List<EncryptedPaymentMethodDTO> paymentMethods) {
        this.setUsername(user.getUsername());
        this.setOrdersCount(ordersCount);
        this.setSuccessBuysCount(successBuysCount);
        this.setSuccessSellsCount(successSellsCount);
        this.setSuccessPercent(successPercent);
        this.setPaymentMethods(paymentMethods);
    }

}
