package org.example.backend.model.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity

@Table(name = "payment_method")
@NoArgsConstructor
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Bank bank;

    @Column(nullable = true)
    private String customBankName;

    private String encryptedDetails;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bank getBank() {
        return bank;
    }

    public void setBank(Bank bank) {
        this.bank = bank;
    }

    public String getCustomBankName() {
        return customBankName;
    }

    public void setCustomBankName(String customBankName) {
        this.customBankName = customBankName;
    }

    public String getEncryptedDetails() {
        return encryptedDetails;
    }

    public void setEncryptedDetails(String encryptedDetails) {
        this.encryptedDetails = encryptedDetails;
    }
}
