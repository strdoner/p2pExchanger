package org.example.backend.service;

import jakarta.persistence.EntityNotFoundException;
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

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

    public List<EncryptedPaymentMethodDTO> getEncryptedPaymentMethods(User user, Long bankId) {
        List<PaymentMethod> methods;
        if (bankId == null) {
            methods = paymentMethodRepository.findAllByUserAndIsDisabledIsFalse(user);
        }
        else {
            methods = paymentMethodRepository.findAllByUserAndBank_IdAndIsDisabledIsFalse(user, bankId);
        }
        List<EncryptedPaymentMethodDTO> methodsDTO = new ArrayList<>();
        for (PaymentMethod paymentMethod : methods) {
            methodsDTO.add(new EncryptedPaymentMethodDTO(paymentMethod));
        }

        return methodsDTO;
    }


    public void remove(Long methodId, User user) throws AccessDeniedException {

        PaymentMethod method = paymentMethodRepository.findById(methodId).orElseThrow(
                () -> new EntityNotFoundException("Платежный метод не найден!")
        );
        if (!Objects.equals(method.getUser().getId(), user.getId())) {
            throw new AccessDeniedException("Запрещено");
        }
        method.setDisabled(true);
        paymentMethodRepository.save(method);
    }
}
