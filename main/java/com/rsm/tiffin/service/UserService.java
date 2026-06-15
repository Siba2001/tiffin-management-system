package com.rsm.tiffin.service;

import com.rsm.tiffin.dto.PageResponse;
import com.rsm.tiffin.dto.UserRequest;
import com.rsm.tiffin.dto.UserResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    PageResponse<UserResponse> getAllStudents(int page, int size, String search, String sortBy, String sortDir);
    UserResponse getStudentById(Long id);
    UserResponse createStudent(UserRequest request);
    UserResponse updateStudent(Long id, UserRequest request);
    void deleteStudent(Long id);
    UserResponse activateStudent(Long id);
    UserResponse deactivateStudent(Long id);
    UserResponse uploadAadhaar(Long id, MultipartFile file);
    UserResponse getProfile(Long userId);
    UserResponse updateProfile(Long userId, UserRequest request);
}
