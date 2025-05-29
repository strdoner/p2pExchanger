package org.example.backend.repository;

import org.example.backend.model.user.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank, Long> {
    Bank findBankByName(String name);
}
