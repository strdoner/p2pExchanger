package org.example.backend.repository;

import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findAllByUserAndIsDisabledIsFalse(User user);

    List<PaymentMethod> findAllByUserAndBank_IdAndIsDisabledIsFalse(User user, Long bank_id);
}
