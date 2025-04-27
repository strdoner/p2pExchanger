package org.example.backend.repository;

import org.example.backend.model.Currency;
import org.example.backend.model.order.Order;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByMaker(User user);
    Page<Order> findAllByPaymentMethod_Bank_NameAndCurrency_Name(String paymentMethod_bank_name, String currency_name, Pageable paging);
    Page<Order> findAllByCurrency_Name(String currency_name, Pageable paging);
}
