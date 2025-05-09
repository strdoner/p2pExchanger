package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.BalanceDTO;
import org.example.backend.DTO.BalanceRequestDTO;
import org.example.backend.model.Currency;
import org.example.backend.model.user.Balance;
import org.example.backend.model.user.User;
import org.example.backend.repository.BalanceRepository;
import org.example.backend.repository.CurrencyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BalanceService {
    private final BalanceRepository balanceRepository;
    private final CurrencyRepository currencyRepository;

    public Balance getUserBalanceByCurrency(User user, Currency currency) {
        return balanceRepository.findBalanceByUserAndCurrency(user, currency);
    }

    public List<BalanceDTO> getUserBalances(User user) {
        List<Balance> balances = balanceRepository.findAllByUser(user);
        List<BalanceDTO> balancesDTO = new ArrayList<>();

        for (Balance balance : balances) {
            balancesDTO.add(new BalanceDTO(balance));
        }
        return balancesDTO;
    }

    public void createUserBalances(User user) {
        List<Currency> currencies = currencyRepository.findAll();
        for (Currency currency : currencies) {
            Balance balance = new Balance();
            balance.setUser(user);
            balance.setCurrency(currency);
            balanceRepository.save(balance);
        }
    }

    public void createDeposit(User user, BalanceRequestDTO dto) {
        Currency currency = currencyRepository.findByShortName(dto.getCurrency());
        if (currency == null) {
            throw new EntityNotFoundException("Currency not found");
        }
        Balance balance = balanceRepository.findBalanceByUserAndCurrency(user, currency);

        balance.setAvailable(balance.getAvailable().add(dto.getAmount()));
        balanceRepository.save(balance);

    }
}
