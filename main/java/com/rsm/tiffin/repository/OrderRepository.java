package com.rsm.tiffin.repository;

import com.rsm.tiffin.entity.Order;
import com.rsm.tiffin.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStudentIdOrderByOrderDateDesc(Long studentId);

    Page<Order> findByStudentId(Long studentId, Pageable pageable);

    Page<Order> findByOrderStatus(OrderStatus status, Pageable pageable);

    long countByStudentId(Long studentId);

    long countByStudentIdAndOrderStatus(Long studentId, OrderStatus status);

    long countByOrderStatus(OrderStatus status);
}
