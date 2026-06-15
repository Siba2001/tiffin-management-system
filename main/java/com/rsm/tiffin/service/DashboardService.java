package com.rsm.tiffin.service;

import com.rsm.tiffin.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getAdminDashboard();
    DashboardResponse getStudentDashboard(Long studentId);
}
