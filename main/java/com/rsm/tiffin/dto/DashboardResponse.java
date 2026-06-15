package com.rsm.tiffin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalStudents;
    private long activeStudents;
    private long totalOrders;
    private long activeOrders;
    private long todayAttendance;
    private long attendanceCount;
    private MenuResponse todayMenu;
}
