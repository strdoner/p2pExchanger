package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.BalanceDTO;
import org.example.backend.DTO.BalanceRequestDTO;
import org.example.backend.model.Currency;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
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

    public boolean checkUserBalance(User user, Currency currency, BigDecimal amount) {
        Balance balance = balanceRepository.findBalanceByUserAndCurrency(user, currency);
        return balance.getAvailable().compareTo(amount) >= 0;
    }

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
        Currency currency = currencyRepository.findByShortName(dto.getCurrency()).orElseThrow(
                () -> new EntityNotFoundException("Cryptocurrency not found!")
        );
        if (currency == null) {
            throw new EntityNotFoundException("Currency not found");
        }
        Balance balance = balanceRepository.findBalanceByUserAndCurrency(user, currency);

        balance.setAvailable(balance.getAvailable().add(dto.getAmount()));
        balanceRepository.save(balance);

    }

    public void lockCurrency(OrderResponse response) {
        User userToSubtract = response.getMaker(); // на продажу мейкер, на покупку тейкер

        Balance userBalanceToSubtract = balanceRepository.findBalanceByUserAndCurrency(userToSubtract, response.getCurrency());
        userBalanceToSubtract.setAvailable(userBalanceToSubtract.getAvailable().subtract(response.getAmount()));
        userBalanceToSubtract.setLocked(userBalanceToSubtract.getLocked().add(response.getAmount()));

        balanceRepository.save(userBalanceToSubtract);
    }

    public void unlockCurrency(OrderResponse response) {
        User userToSubtract = response.getMaker();
        User userToAdd = response.getTaker();

        Balance userBalanceToSubtract = balanceRepository.findBalanceByUserAndCurrency(userToSubtract, response.getCurrency());
        userBalanceToSubtract.setLocked(userBalanceToSubtract.getLocked().subtract(response.getAmount()));
        if (response.getStatus() == OrderStatus.CANCELLED) {
            userBalanceToSubtract.setAvailable(userBalanceToSubtract.getAvailable().add(response.getAmount()));
        }
        balanceRepository.save(userBalanceToSubtract);

        if (response.getStatus() != OrderStatus.CANCELLED) {
            Balance userBalanceToAdd = balanceRepository.findBalanceByUserAndCurrency(userToAdd, response.getCurrency());
            userBalanceToAdd.setAvailable(userBalanceToAdd.getAvailable().add(response.getAmount()));
            balanceRepository.save(userBalanceToAdd);
        }

    }

}
