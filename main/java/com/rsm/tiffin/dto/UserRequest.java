package com.rsm.tiffin.dto;

import com.rsm.tiffin.entity.Role;
import com.rsm.tiffin.entity.UserStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

  @NotBlank(message = "Full name is required")
  @Size(max = 100, message = "Full name must not exceed 100 characters")
  private String fullName;

  @NotBlank(message = "Mobile number is required")
  @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid mobile number")
  private String mobileNumber;

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters")
  @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
      message = "Password must contain uppercase, lowercase, digit and special character")
  private String password;

  private String address;

  @Pattern(regexp = "^\\d{12}$", message = "Aadhaar number must be 12 digits")
  private String aadhaarNumber;

  private Role role;
  private UserStatus status;
}
