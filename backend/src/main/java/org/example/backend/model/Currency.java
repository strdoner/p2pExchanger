package org.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Currency {
    @Id
    private Integer id;
    private String name;
}
