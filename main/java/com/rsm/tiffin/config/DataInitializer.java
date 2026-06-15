package com.rsm.tiffin.config;

import com.rsm.tiffin.entity.Role;
import com.rsm.tiffin.entity.User;
import com.rsm.tiffin.entity.UserStatus;
import com.rsm.tiffin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@tiffin.com")) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .mobileNumber("9999999999")
                    .email("admin@tiffin.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .address("Admin Office")
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
        }
    }
}
