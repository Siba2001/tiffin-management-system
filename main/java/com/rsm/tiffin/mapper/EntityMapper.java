package com.rsm.tiffin.mapper;

import com.rsm.tiffin.dto.*;
import com.rsm.tiffin.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .mobileNumber(user.getMobileNumber())
                .email(user.getEmail())
                .address(user.getAddress())
                .aadhaarNumber(user.getAadhaarNumber())
                .aadhaarImage(user.getAadhaarImage())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public User toUserEntity(UserRequest request) {
        return User.builder()
                .fullName(request.getFullName())
                .mobileNumber(request.getMobileNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .aadhaarNumber(request.getAadhaarNumber())
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .status(request.getStatus() != null ? request.getStatus() : UserStatus.ACTIVE)
                .build();
    }

    public void updateUserFromRequest(User user, UserRequest request) {
        user.setFullName(request.getFullName());
        user.setMobileNumber(request.getMobileNumber());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setAadhaarNumber(request.getAadhaarNumber());
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
    }

    public MenuResponse toMenuResponse(Menu menu) {
        if (menu == null) return null;
        return MenuResponse.builder()
                .id(menu.getId())
                .menuDate(menu.getMenuDate())
                .breakfast(menu.getBreakfast())
                .lunch(menu.getLunch())
                .dinner(menu.getDinner())
                .createdAt(menu.getCreatedAt())
                .build();
    }

    public Menu toMenuEntity(MenuRequest request) {
        return Menu.builder()
                .menuDate(request.getMenuDate())
                .breakfast(request.getBreakfast())
                .lunch(request.getLunch())
                .dinner(request.getDinner())
                .build();
    }

    public AttendanceResponse toAttendanceResponse(Attendance attendance) {
        if (attendance == null) return null;
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentName(attendance.getStudent().getFullName())
                .attendanceDate(attendance.getAttendanceDate())
                .status(attendance.getStatus())
                .build();
    }

    public OrderResponse toOrderResponse(Order order) {
        if (order == null) return null;
        return OrderResponse.builder()
                .id(order.getId())
                .studentId(order.getStudent().getId())
                .studentName(order.getStudent().getFullName())
                .menuId(order.getMenu().getId())
                .menuDate(order.getMenu().getMenuDate())
                .orderDate(order.getOrderDate())
                .quantity(order.getQuantity())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .build();
    }
}
