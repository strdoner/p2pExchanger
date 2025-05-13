package org.example.backend.converter;

import org.springframework.core.convert.converter.Converter;
import org.example.backend.model.Currency;
import org.example.backend.repository.CurrencyRepository;
import org.springframework.stereotype.Component;

@Component
public class StringToCurrencyConverter implements Converter<String, Currency> {

    private final CurrencyRepository currencyRepository;

    public StringToCurrencyConverter(CurrencyRepository currencyRepository) {
        this.currencyRepository = currencyRepository;
    }

    @Override
    public Currency convert(String source) {
        return currencyRepository.findByShortName(source)
                .orElseThrow(() -> new IllegalArgumentException("Invalid currency short name: " + source));
    }
}
