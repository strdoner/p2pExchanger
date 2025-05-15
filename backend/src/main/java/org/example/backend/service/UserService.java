package org.example.backend.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.backend.DTO.EncryptedPaymentMethodDTO;
import org.example.backend.DTO.FullUserInfoDTO;
import org.example.backend.DTO.UserOrderDTO;
import org.example.backend.model.order.Order;
import org.example.backend.model.order.OrderStatus;
import org.example.backend.model.order.OrderType;
import org.example.backend.model.user.Role;
import org.example.backend.model.user.User;
import org.example.backend.repository.OrderRepository;
import org.example.backend.repository.OrderResponseRepository;
import org.example.backend.repository.RoleRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;


    private final RoleRepository roleRepository;
    private final PaymentMethodService paymentMethodService;
    private final PasswordEncoder bCryptPasswordEncoder;
    private final OrderRepository orderRepository;
    private final OrderResponseRepository orderResponseRepository;
    private final BalanceService balanceService;


    public boolean deleteUser(Long userId) {
        if (userRepository.findById(userId).isPresent()) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }

    public void createUserBalances(User user) {
        balanceService.createUserBalances(user);
    }

    public boolean saveUser(User user) {
        Optional<User> userFromDB = userRepository.findByUsername(user.getUsername());


        if (userFromDB.isPresent()) {
            throw new EntityExistsException("Пользователь с выбранным именем уже существует!");
        }

        userFromDB = userRepository.findByEmail(user.getEmail());
        if (userFromDB.isPresent()) {
            throw new EntityExistsException("Пользователь с выбранной почтой уже существует!");
        }
        user.setRole(new Role(1L, "ROLE_USER"));
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        createUserBalances(savedUser);
        return true;
    }

    public User findUserById(Long userId) {
        Optional<User> userFromDb = userRepository.findById(userId);
        return userFromDb.orElse(new User());
    }

    public boolean existsById(Long userId) {
        return userRepository.existsById(userId);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Username not found")
        );

        return user;
    }

    public UserDetails findUserByUsername(String username) {
        Optional<User> userFromDb = userRepository.findByUsername(username);
        return userFromDb.orElse(new User());
    }

    public UserOrderDTO getMinInfo(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                EntityNotFoundException::new
        );
        long totalMakerOrders = orderRepository.countByMakerAndIsAvailableTrue(user) + orderResponseRepository.countByTaker(user) + orderResponseRepository.countByOrder_Maker(user);
        long completedMakerOrders = orderResponseRepository.countByTakerAndStatus(user, OrderStatus.COMPLETED) + orderResponseRepository.countByOrder_MakerAndStatus(user, OrderStatus.COMPLETED);
        Long completionPercentage = totalMakerOrders > 0
                ? (long) (((double) completedMakerOrders / totalMakerOrders) * 100)
                : 0;
        return new UserOrderDTO(user, totalMakerOrders, completionPercentage);
    }


    public FullUserInfoDTO getMaxInfo(User authUser, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                EntityNotFoundException::new
        );

        long totalMakerOrders = orderRepository.countByMakerAndIsAvailableTrue(user) + orderResponseRepository.countByTaker(user) + orderResponseRepository.countByOrder_Maker(user);
        long completedBuyOrders = orderResponseRepository.countByOrder_MakerAndStatusAndOrder_Type(user, OrderStatus.COMPLETED, OrderType.BUY)
                + orderResponseRepository.countByTakerAndStatusAndOrder_Type(user, OrderStatus.COMPLETED, OrderType.BUY);
        long completedSellOrders = orderResponseRepository.countByOrder_MakerAndStatusAndOrder_Type(user, OrderStatus.COMPLETED, OrderType.SELL)
                + orderResponseRepository.countByTakerAndStatusAndOrder_Type(user, OrderStatus.COMPLETED, OrderType.SELL);
        long completedMakerOrders = completedBuyOrders + completedSellOrders;
        Long completionPercentage = totalMakerOrders > 0
                ? (long) (((double) completedMakerOrders / totalMakerOrders) * 100)
                : 0;

        List<EncryptedPaymentMethodDTO> paymentMethods = null;
        if (Objects.equals(authUser.getId(), userId)) {
            paymentMethods = paymentMethodService.getEncryptedPaymentMethods(authUser, null);
        }

        return new FullUserInfoDTO(user, totalMakerOrders, completedBuyOrders, completedSellOrders, completionPercentage, paymentMethods);


    }
}
