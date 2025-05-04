package org.example.backend.repository;

import jakarta.persistence.Tuple;
import org.example.backend.DTO.OrderWithStatusDTO;
import org.example.backend.model.Currency;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.PaymentMethod;
import org.example.backend.model.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByMaker(User user);

    Long countByMaker(User maker);

    Long countByMakerAndIsAvailableFalse(User maker);


    //@Query("SELECT o, " +
    //        "CASE WHEN r IS NULL THEN 'PENDING' ELSE r.status END " +
    //        "FROM Order o " +
    //        "LEFT JOIN OrderResponse r ON r.order = o " + //OR r.user.id = :userId
    //        "WHERE o.maker.id = :userId " +
    //        "AND o.isAvailable = true " +
    //        "AND (:currency IS NULL OR o.currency.name = :currency) " +
    //        "AND (:status IS NULL OR " +
    //        "   (r IS NULL AND 'PENDING' = :status) OR " +
    //        "   (r IS NOT NULL AND r.status = :status))")
    @Query("SELECT o, " +
            "COALESCE(r.status, 'PENDING') as status, " +
            "COALESCE(r.taker.id, null) as taker, " +
            "COALESCE(r.id, null) as responseId " +
            "FROM Order o " +
            "LEFT JOIN OrderResponse r ON r.order = o " +  // Просто LEFT JOIN без доп. условий
            "WHERE (o.maker.id = :userId OR r.taker.id = :userId) " +
            "AND (:currency IS NULL OR o.currency.name = :currency) " +
            "AND (:type IS NULL OR o.type = :type) " +
            "AND (:status IS NULL OR " +
            "   (r IS NULL AND :status = 'PENDING') OR " +  // Фильтр по PENDING
            "   (r IS NOT NULL AND r.status = :status)) " +
            "ORDER BY FIELD(status, 'CONFIRMATION','ACTIVE','DISPUTED','PENDING','CANCELLED','COMPLETED')")
    Page<Tuple> findUserOrdersWithStatus(
            @Param("userId") Long userId,
            @Param("currency") String currency,
            @Param("type") OrderType type,
            @Param("status") OrderStatus status,
            Pageable pageable);

    @Query("""
    SELECT o FROM Order o 
    WHERE o.isAvailable = true 
    AND (:method IS NULL OR o.paymentMethod.bank.name = :method)
    AND o.currency.name = :coin 
    AND (
        (:type = 'BUY' AND ((o.maker != :currentUser AND o.type = 'SELL') OR (o.maker = :currentUser AND o.type = 'BUY')))
        OR
        (:type = 'SELL' AND ((o.maker != :currentUser AND o.type = 'BUY') OR (o.maker = :currentUser AND o.type = 'SELL')))
    )
    """)
    Page<Order> findAllByCurrencyAndTypeAndUserFilter(
            @Param("method") String method,
            @Param("coin") String coin,
            @Param("type") String type,
            @Param("currentUser") User currentUser,
            Pageable paging
    );



    Page<Order> findAllByIsAvailableTrueAndCurrency_NameAndType(String coin, OrderType type, Pageable paging);

    Page<Order> findAllByIsAvailableTrueAndPaymentMethod_Bank_NameAndCurrency_NameAndType(String method, String coin, OrderType type, Pageable paging);

    Long countByMakerAndIsAvailableTrue(User maker);
}
