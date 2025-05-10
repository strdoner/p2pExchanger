package org.example.backend.model.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.utils.AESUtils;

@Entity
@Data
@Table(name = "payment_method")
@NoArgsConstructor
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;
    private String cardHolderName;

    @ManyToOne
    private Bank bank;

    private String LastFour;

    private String encryptedDetails;

    public void setEncryptedDetails(String encryptedDetails) throws Exception {
        this.encryptedDetails = AESUtils.encrypt(encryptedDetails);
    }
}
