package com.rsm.tiffin.dto;

import com.rsm.tiffin.entity.Role;
import com.rsm.tiffin.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String mobileNumber;
    private String email;
    private String address;
    private String aadhaarNumber;
    private String aadhaarImage;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
