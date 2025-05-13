package org.example.backend.repository;

import org.example.backend.model.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, Integer> {
    Currency findByName(String name);
    Optional<Currency> findByShortName(String shortName);
}
