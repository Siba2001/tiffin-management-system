package com.rsm.tiffin.controller;

import com.rsm.tiffin.dto.AttendanceResponse;
import com.rsm.tiffin.dto.UserResponse;
import com.rsm.tiffin.service.AttendanceService;
import com.rsm.tiffin.service.UserService;
import com.rsm.tiffin.util.PdfReportUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final UserService userService;
    private final AttendanceService attendanceService;
    private final PdfReportUtil pdfReportUtil;

    @GetMapping("/students/pdf")
    public ResponseEntity<byte[]> exportStudentsPdf() throws Exception {
        List<UserResponse> students = userService.getAllStudents(0, 1000, null, "fullName", "asc").getContent();
        byte[] pdf = pdfReportUtil.generateStudentsReport(students);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=students-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/attendance/pdf")
    public ResponseEntity<byte[]> exportAttendancePdf() throws Exception {
        List<AttendanceResponse> attendance = attendanceService.getAllAttendance(0, 1000, null, null).getContent();
        byte[] pdf = pdfReportUtil.generateAttendanceReport(attendance);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendance-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
