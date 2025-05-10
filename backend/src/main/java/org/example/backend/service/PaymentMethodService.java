package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.EncryptedPaymentMethodDTO;
import org.example.backend.DTO.PaymentMethodDTO;
import org.example.backend.DTO.PaymentMethodRequestDTO;
import org.example.backend.model.user.Bank;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.example.backend.repository.BankRepository;
import org.example.backend.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;
    private final BankRepository bankRepository;

    public EncryptedPaymentMethodDTO create(PaymentMethodRequestDTO method, User user) throws Exception {
        Bank bank = bankRepository.findBankByName(method.getBankName());
        String cardHolderName = String.format("%s %s %s.", method.getFirstName(), method.getFatherName(), method.getSecondName().charAt(0));


        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setUser(user);
        paymentMethod.setBank(bank);
        paymentMethod.setLastFour(method.getCardNumber().substring(12));
        paymentMethod.setEncryptedDetails(method.getCardNumber());
        paymentMethod.setCardHolderName(cardHolderName);
        paymentMethod = paymentMethodRepository.save(paymentMethod);

        return new EncryptedPaymentMethodDTO(paymentMethod);
    }

    public List<EncryptedPaymentMethodDTO> getEncryptedPaymentMethods(User user) {
        List<PaymentMethod> methods = paymentMethodRepository.findAllByUser(user);
        List<EncryptedPaymentMethodDTO> methodsDTO = new ArrayList<>();
        for (PaymentMethod paymentMethod : methods) {
            methodsDTO.add(new EncryptedPaymentMethodDTO(paymentMethod));
        }

        return methodsDTO;
    }



}
