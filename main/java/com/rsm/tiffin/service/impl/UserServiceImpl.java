package com.rsm.tiffin.service.impl;

import com.rsm.tiffin.dto.PageResponse;
import com.rsm.tiffin.dto.UserRequest;
import com.rsm.tiffin.dto.UserResponse;
import com.rsm.tiffin.entity.Role;
import com.rsm.tiffin.entity.User;
import com.rsm.tiffin.entity.UserStatus;
import com.rsm.tiffin.exception.BadRequestException;
import com.rsm.tiffin.exception.ResourceNotFoundException;
import com.rsm.tiffin.mapper.EntityMapper;
import com.rsm.tiffin.repository.UserRepository;
import com.rsm.tiffin.service.UserService;
import com.rsm.tiffin.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityMapper mapper;
    private final FileStorageUtil fileStorageUtil;

    @Override
    public PageResponse<UserResponse> getAllStudents(int page, int size, String search, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<User> userPage;
        if (search != null && !search.isBlank()) {
            userPage = userRepository.searchStudents(Role.STUDENT, search.trim(), pageable);
        } else {
            userPage = userRepository.findByRole(Role.STUDENT, pageable);
        }

        List<UserResponse> content = userPage.getContent().stream()
                .map(mapper::toUserResponse)
                .toList();

        return PageResponse.<UserResponse>builder()
                .content(content)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Override
    public UserResponse getStudentById(Long id) {
        return mapper.toUserResponse(findStudentById(id));
    }

    @Override
    @Transactional
    public UserResponse createStudent(UserRequest request) {
        validateUniqueFields(request, null);
        User user = mapper.toUserEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);
        user.setStatus(UserStatus.ACTIVE);
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateStudent(Long id, UserRequest request) {
        User user = findStudentById(id);
        validateUniqueFields(request, id);
        mapper.updateUserFromRequest(user, request);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        User user = findStudentById(id);
        if (user.getAadhaarImage() != null) {
            fileStorageUtil.deleteFile(user.getAadhaarImage());
        }
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserResponse activateStudent(Long id) {
        User user = findStudentById(id);
        user.setStatus(UserStatus.ACTIVE);
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse deactivateStudent(Long id) {
        User user = findStudentById(id);
        user.setStatus(UserStatus.INACTIVE);
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse uploadAadhaar(Long id, MultipartFile file) {
        User user = findStudentById(id);
        if (user.getAadhaarImage() != null) {
            fileStorageUtil.deleteFile(user.getAadhaarImage());
        }
        String fileName = fileStorageUtil.storeFile(file, "aadhaar_" + id);
        user.setAadhaarImage(fileName);
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        validateUniqueFields(request, userId);
        mapper.updateUserFromRequest(user, request);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return mapper.toUserResponse(userRepository.save(user));
    }

    private User findStudentById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        if (user.getRole() != Role.STUDENT) {
            throw new BadRequestException("User is not a student");
        }
        return user;
    }

    private void validateUniqueFields(UserRequest request, Long excludeId) {
        userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new BadRequestException("Email already in use");
            }
        });
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            userRepository.findAll().stream()
                    .filter(u -> u.getMobileNumber().equals(request.getMobileNumber()))
                    .findFirst()
                    .ifPresent(existing -> {
                        if (excludeId == null || !existing.getId().equals(excludeId)) {
                            throw new BadRequestException("Mobile number already in use");
                        }
                    });
        }
        if (request.getAadhaarNumber() != null && userRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
            userRepository.findAll().stream()
                    .filter(u -> request.getAadhaarNumber().equals(u.getAadhaarNumber()))
                    .findFirst()
                    .ifPresent(existing -> {
                        if (excludeId == null || !existing.getId().equals(excludeId)) {
                            throw new BadRequestException("Aadhaar number already in use");
                        }
                    });
        }
    }
}
