package com.rsm.tiffin.service.impl;

import com.rsm.tiffin.dto.DashboardResponse;
import com.rsm.tiffin.dto.MenuResponse;
import com.rsm.tiffin.entity.AttendanceStatus;
import com.rsm.tiffin.entity.OrderStatus;
import com.rsm.tiffin.entity.Role;
import com.rsm.tiffin.entity.UserStatus;
import com.rsm.tiffin.repository.AttendanceRepository;
import com.rsm.tiffin.repository.OrderRepository;
import com.rsm.tiffin.repository.UserRepository;
import com.rsm.tiffin.service.DashboardService;
import com.rsm.tiffin.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final AttendanceRepository attendanceRepository;
    private final MenuService menuService;

    @Override
    public DashboardResponse getAdminDashboard() {
        LocalDate today = LocalDate.now();
        MenuResponse todayMenu = menuService.getMenuByDate(today);

        return DashboardResponse.builder()
                .totalStudents(userRepository.countByRole(Role.STUDENT))
                .activeStudents(userRepository.countByRoleAndStatus(Role.STUDENT, UserStatus.ACTIVE))
                .totalOrders(orderRepository.count())
                .activeOrders(orderRepository.countByOrderStatus(OrderStatus.PLACED))
                .todayAttendance(attendanceRepository.countByAttendanceDateAndStatus(today, AttendanceStatus.PRESENT))
                .todayMenu(todayMenu)
                .build();
    }

    @Override
    public DashboardResponse getStudentDashboard(Long studentId) {
        LocalDate today = LocalDate.now();
        MenuResponse todayMenu = menuService.getMenuByDate(today);

        return DashboardResponse.builder()
                .totalOrders(orderRepository.countByStudentId(studentId))
                .activeOrders(orderRepository.countByStudentIdAndOrderStatus(studentId, OrderStatus.PLACED))
                .attendanceCount(attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT))
                .todayMenu(todayMenu)
                .build();
    }
}
