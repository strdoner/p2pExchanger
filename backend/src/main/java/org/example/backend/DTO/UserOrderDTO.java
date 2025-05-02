package org.example.backend.DTO;

import lombok.Data;
import org.example.backend.model.user.User;
import org.example.backend.service.UserService;

@Data
public class UserOrderDTO {
    private String username;
    private Long userId;
    private Long ordersCount;
    private Long percentOrdersCompleted;

    public UserOrderDTO(User user, Long ordersCount, Long percentOrdersCompleted) {
        this.setUsername(user.getUsername());
        this.setOrdersCount(ordersCount);
        this.setPercentOrdersCompleted(percentOrdersCompleted);
        this.setUserId(user.getId());
    }

}
