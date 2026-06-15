package com.rsm.tiffin.service.impl;

import com.rsm.tiffin.dto.*;
import com.rsm.tiffin.entity.Attendance;
import com.rsm.tiffin.entity.User;
import com.rsm.tiffin.exception.BadRequestException;
import com.rsm.tiffin.exception.ResourceNotFoundException;
import com.rsm.tiffin.mapper.EntityMapper;
import com.rsm.tiffin.repository.AttendanceRepository;
import com.rsm.tiffin.repository.UserRepository;
import com.rsm.tiffin.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public PageResponse<AttendanceResponse> getAllAttendance(int page, int size, Long studentId, LocalDate date) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("attendanceDate").descending());
        Page<Attendance> attendancePage;

        if (studentId != null) {
            attendancePage = attendanceRepository.findByStudentId(studentId, pageable);
        } else if (date != null) {
            attendancePage = attendanceRepository.findByAttendanceDate(date, pageable);
        } else {
            attendancePage = attendanceRepository.findAll(pageable);
        }

        List<AttendanceResponse> content = attendancePage.getContent().stream()
                .map(mapper::toAttendanceResponse)
                .toList();

        return PageResponse.<AttendanceResponse>builder()
                .content(content)
                .page(attendancePage.getNumber())
                .size(attendancePage.getSize())
                .totalElements(attendancePage.getTotalElements())
                .totalPages(attendancePage.getTotalPages())
                .last(attendancePage.isLast())
                .build();
    }

    @Override
    public List<AttendanceResponse> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(mapper::toAttendanceResponse)
                .toList();
    }

    @Override
    @Transactional
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        if (attendanceRepository.existsByStudentIdAndAttendanceDate(request.getStudentId(), request.getAttendanceDate())) {
            throw new BadRequestException("Attendance already marked for this date");
        }

        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Attendance attendance = Attendance.builder()
                .student(student)
                .attendanceDate(request.getAttendanceDate())
                .status(request.getStatus())
                .build();

        return mapper.toAttendanceResponse(attendanceRepository.save(attendance));
    }

    @Override
    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));

        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        attendance.setStudent(student);
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setStatus(request.getStatus());

        return mapper.toAttendanceResponse(attendanceRepository.save(attendance));
    }

    @Override
    @Transactional
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance not found");
        }
        attendanceRepository.deleteById(id);
    }
}
