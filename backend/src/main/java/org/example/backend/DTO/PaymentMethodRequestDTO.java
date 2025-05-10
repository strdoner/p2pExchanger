package org.example.backend.DTO;

import lombok.Data;

@Data
public class PaymentMethodRequestDTO {
    private String bankName;
    private String cardNumber;
    private String firstName;
    private String secondName;
    private String fatherName;
}
