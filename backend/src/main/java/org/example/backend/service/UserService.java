package org.example.backend.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import org.example.backend.DTO.UserOrderDTO;
import org.example.backend.model.order.OrderStatus;
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

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;


    private final RoleRepository roleRepository;

    private final PasswordEncoder bCryptPasswordEncoder;
    private final OrderRepository orderRepository;
    private final OrderResponseRepository orderResponseRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository, OrderRepository orderRepository, OrderResponseRepository orderResponseRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.orderRepository = orderRepository;
        this.orderResponseRepository = orderResponseRepository;
    }

    public boolean deleteUser(Long userId) {
        if (userRepository.findById(userId).isPresent()) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
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
        userRepository.save(user);
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
        Long count = orderRepository.countByMaker(user) + orderResponseRepository.countByTaker(user);
        Long percent = (orderResponseRepository.countByOrder_MakerAndStatus(user, OrderStatus.COMPLETED) + orderResponseRepository.countByTakerAndStatus(user, OrderStatus.COMPLETED)) / count * 100;
        UserOrderDTO userInfo = new UserOrderDTO(user, count, percent);
        return userInfo;
    }


}
