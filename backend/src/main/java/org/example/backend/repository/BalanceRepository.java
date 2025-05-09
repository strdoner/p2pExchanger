package org.example.backend.repository;

import org.example.backend.model.Currency;
import org.example.backend.model.user.Balance;
import org.example.backend.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BalanceRepository extends JpaRepository<Balance, Long> {
    List<Balance> findAllByUser(User user);
    Balance findBalanceByUserAndCurrency(User user, Currency currency);

}
