package org.example.backend.repository;

import jakarta.persistence.Tuple;
import org.example.backend.model.order.OrderResponse;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderResponseRepository extends JpaRepository<OrderResponse, Long> {
//    Optional<OrderResponse> findByOrder(Order order);

    Long countByTaker(User user);

    Long countByMakerAndStatus(User user, OrderStatus status);
    Long countByMakerAndStatusAndType(User user, OrderStatus status, OrderType type);

    Long countByTakerAndStatus(User taker, OrderStatus status);
    Long countByTakerAndStatusAndType(User user, OrderStatus status, OrderType type);

    Long countByMaker(User maker);

    @Query("""
        SELECT o FROM OrderResponse o 
        WHERE (:method IS NULL OR o.paymentMethod.bank.name = :method)
        AND o.currency.shortName = :coin 
        AND (
            (:type = 'BUY' AND ((o.maker != :user AND o.type = 'SELL') OR (o.taker = :user AND o.type = 'BUY')))
            OR
            (:type = 'SELL' AND ((o.taker != :user AND o.type = 'BUY') OR (o.maker = :user AND o.type = 'SELL')))
        )
        AND o.status = 'PENDING'
            ORDER BY 
                CASE WHEN :type = 'BUY' THEN o.price END ASC,
                CASE WHEN :type = 'SELL' THEN o.price END DESC
        """)
    Page<OrderResponse> findPendingOrders(
            @Param("method") String method,
            @Param("coin") String coin,
            @Param("type") String type,
            @Param("user") User user,
            Pageable paging);

    @Query("""
    SELECT o FROM OrderResponse o 
    WHERE (o.maker.id = :userId OR o.taker.id = :userId)
    AND (:currency IS NULL OR o.currency.shortName = :currency)
    AND (:type IS NULL OR o.type = :type)
    AND (:status IS NULL OR o.status = :status)
    ORDER BY o.createdAt DESC,
    FIELD(o.status, 'CONFIRMATION','ACTIVE','DISPUTED','PENDING','CANCELLED','COMPLETED')
    """)
    Page<OrderResponse> findUserResponses(
        @Param("userId") Long userId,
        @Param("currency") String currency,
        @Param("type") OrderType type,
        @Param("status") OrderStatus status,
        Pageable pageable
    );


}
