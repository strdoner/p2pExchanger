package org.example.backend.repository;

import org.example.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Long countByRecipientIdAndIsReadFalse(Long recipientId);

    List<Message> findAllByResponseId(Long responseId);
}
