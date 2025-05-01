package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.user.User;

@Data
public class OrderDetailsUserDTO {
    private long id;
    private String username;

    public OrderDetailsUserDTO(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
    }
}
