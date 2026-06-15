package com.rsm.tiffin.controller;

import com.rsm.tiffin.dto.*;
import com.rsm.tiffin.security.CustomUserDetails;
import com.rsm.tiffin.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllStudents(page, size, search, sortBy, sortDir)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('STUDENT') and #id == authentication.principal.id)")
    public ResponseEntity<ApiResponse<UserResponse>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getStudentById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createStudent(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Student created", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('STUDENT') and #id == authentication.principal.id)")
    public ResponseEntity<ApiResponse<UserResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Student updated", userService.updateStudent(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        userService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted", null));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> activateStudent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Student activated", userService.activateStudent(id)));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> deactivateStudent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Student deactivated", userService.deactivateStudent(id)));
    }

    @PostMapping(value = "/{id}/aadhaar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or (hasRole('STUDENT') and #id == authentication.principal.id)")
    public ResponseEntity<ApiResponse<UserResponse>> uploadAadhaar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Aadhaar uploaded", userService.uploadAadhaar(id, file)));
    }

    @GetMapping("/profile/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(user.getId())));
    }

    @PutMapping("/profile/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(user.getId(), request)));
    }
}
