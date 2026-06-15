package com.rsm.tiffin.service;

import com.rsm.tiffin.dto.*;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {
    AuthResponse register(UserRequest request);
    AuthResponse login(LoginRequest request);
}
