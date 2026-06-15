package com.rsm.tiffin.repository;

import com.rsm.tiffin.entity.Role;
import com.rsm.tiffin.entity.User;
import com.rsm.tiffin.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByMobileNumber(String mobileNumber);

    boolean existsByAadhaarNumber(String aadhaarNumber);

    long countByRole(Role role);

    long countByRoleAndStatus(Role role, UserStatus status);

    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "u.mobileNumber LIKE CONCAT('%', :search, '%'))")
    Page<User> searchStudents(@Param("role") Role role, @Param("search") String search, Pageable pageable);

    Page<User> findByRole(Role role, Pageable pageable);
}
