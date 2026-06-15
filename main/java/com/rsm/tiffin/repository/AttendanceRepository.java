package com.rsm.tiffin.repository;

import com.rsm.tiffin.entity.Attendance;
import com.rsm.tiffin.entity.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    Page<Attendance> findByStudentId(Long studentId, Pageable pageable);

    Page<Attendance> findByAttendanceDate(LocalDate date, Pageable pageable);

    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    long countByAttendanceDateAndStatus(LocalDate date, AttendanceStatus status);

    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate date);

    boolean existsByStudentIdAndAttendanceDate(Long studentId, LocalDate date);
}
