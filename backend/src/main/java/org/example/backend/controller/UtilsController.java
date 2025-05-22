package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Currency;
import org.example.backend.model.user.Bank;
import org.example.backend.repository.BankRepository;
import org.example.backend.repository.CurrencyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/utils")
public class UtilsController {
    private final BankRepository bankRepository;
    private final CurrencyRepository currencyRepository;

    @GetMapping("/banks")
    public ResponseEntity<?> getAllBanks() {
        List<Bank> bankList = bankRepository.findAll();
        return new ResponseEntity<>(bankList, HttpStatus.OK);
    }

    @GetMapping("/currencies")
    public ResponseEntity<?> getAllCurrencies() {
        List<Currency> currencies = currencyRepository.findAll();
        return new ResponseEntity<>(currencies, HttpStatus.OK);
    }

}
