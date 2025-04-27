package org.example.backend.model.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.model.Currency;

import java.math.BigDecimal;

@Entity
@Table(name = "balances")
@Getter
@Setter
@NoArgsConstructor
public class Balance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "currency_id", nullable = false)
    private Currency currency; // "BTC", "USDT"

    @Column(precision = 19, scale = 8)
    private BigDecimal available = BigDecimal.ZERO;

    @Column(precision = 19, scale = 8)
    private BigDecimal locked = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
