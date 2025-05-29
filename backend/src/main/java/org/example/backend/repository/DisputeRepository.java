package org.example.backend.repository;

import org.example.backend.model.order.Dispute;
import org.example.backend.model.order.DisputeStatus;
import org.example.backend.model.order.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    Page<Dispute> findAllByDisputeStatus(DisputeStatus disputeStatus, Pageable pageable);

    Dispute findByOrderResponse(OrderResponse response);


}
