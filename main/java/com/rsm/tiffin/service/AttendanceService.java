package com.rsm.tiffin.service;

import com.rsm.tiffin.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    PageResponse<AttendanceResponse> getAllAttendance(int page, int size, Long studentId, LocalDate date);
    List<AttendanceResponse> getStudentAttendance(Long studentId);
    AttendanceResponse markAttendance(AttendanceRequest request);
    AttendanceResponse updateAttendance(Long id, AttendanceRequest request);
    void deleteAttendance(Long id);
}
