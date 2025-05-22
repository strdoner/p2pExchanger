package org.example.backend.repository;

import jakarta.persistence.Tuple;
import org.example.backend.DTO.OrderWithStatusDTO;
import org.example.backend.model.Currency;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.Bank;
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
            "AND (:currency IS NULL OR o.currency.shortName = :currency) " +
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
    AND o.currency.shortName = :coin
    AND (
        (:type = org.example.backend.model.order.OrderType.BUY AND (
            (o.maker != :currentUser AND o.type = org.example.backend.model.order.OrderType.SELL AND 
                (:bank IS NULL OR o.paymentMethod.bank = :bank))
            OR
            (o.maker = :currentUser AND o.type = org.example.backend.model.order.OrderType.BUY AND (
                (:bank IS NULL OR o.preferredBank = :bank)
            ))
        ))
        OR
        (:type = org.example.backend.model.order.OrderType.SELL AND (
            (o.maker != :currentUser AND o.type = org.example.backend.model.order.OrderType.BUY AND (
                (:bank IS NULL OR o.preferredBank = :bank)
            ))
            OR
            (o.maker = :currentUser AND o.type = org.example.backend.model.order.OrderType.SELL AND (
                (:bank IS NULL OR o.paymentMethod.bank = :bank)
            ))
        ))
        OR (:currentUser IS NULL AND o.type = :type)
    )
    """)
    Page<Order> findAllByCurrencyAndTypeAndUserFilter(
            @Param("bank") Bank bank,
            @Param("coin") String coin,
            @Param("type") OrderType type,
            @Param("currentUser") User currentUser,
            Pageable paging
    );



    Page<Order> findAllByIsAvailableTrueAndCurrency_NameAndType(String coin, OrderType type, Pageable paging);

    Page<Order> findAllByIsAvailableTrueAndPaymentMethod_Bank_NameAndCurrency_NameAndType(String method, String coin, OrderType type, Pageable paging);

    Long countByMakerAndIsAvailableTrue(User maker);
    @Query("""
    SELECT o FROM Order o
    JOIN o.currency c
    LEFT JOIN o.paymentMethod pm
    WHERE o.isAvailable = true
    AND c.shortName = :coin
    AND (
        (o.maker.id = :userId AND o.type = 'BUY' AND (:bankId IS NULL OR o.preferredBank.id = :bankId)) 
        OR 
        ((:userId IS NULL OR o.maker.id != :userId) AND o.type = 'SELL' AND (:bankId IS NULL OR pm.bank.id = :bankId))
    )
""")
    //(:user is NULL AND o.type = 'SELL' AND (:bank IS NULL or o.paymentMethod.bank = :bank))
    Page<Order> findAllByCurrencyAndType_SellAndUserFilter(
            @Param("bankId") Long methodBank,
            @Param("coin") String coin,
            @Param("userId") Long userId,
            Pageable paging);

    @Query("""
    SELECT o FROM Order o
    JOIN o.currency c
    LEFT JOIN o.paymentMethod pm
    WHERE o.isAvailable = true
    AND c.shortName = :coin
    AND (
        (o.maker.id = :userId AND o.type = 'SELL' AND (:bankId IS NULL OR pm.bank.id = :bankId)) 
        OR 
        ((:userId IS NULL OR o.maker.id != :userId) AND o.type = 'BUY' AND (:bankId IS NULL OR o.preferredBank.id = :bankId))
    )
""")
        //(:user is NULL AND o.type = 'SELL' AND (:bank IS NULL or o.paymentMethod.bank = :bank))
    Page<Order> findAllByCurrencyAndType_BuyAndUserFilter(
            @Param("bankId") Long methodBank,
            @Param("coin") String coin,
            @Param("userId") Long userId,
            Pageable paging);
}
