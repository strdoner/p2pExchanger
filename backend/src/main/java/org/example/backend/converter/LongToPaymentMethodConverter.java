package org.example.backend.converter;

import org.example.backend.model.user.PaymentMethod;
import org.example.backend.repository.CurrencyRepository;
import org.example.backend.repository.PaymentMethodRepository;
import org.example.backend.service.PaymentMethodService;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LongToPaymentMethodConverter implements Converter <Long, PaymentMethod> {
    private final PaymentMethodService paymentMethodService;

    public LongToPaymentMethodConverter(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @Override
    public PaymentMethod convert(Long source) {
        return paymentMethodService.findById(source);
    }
}
