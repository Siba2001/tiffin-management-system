package com.rsm.tiffin.dto;

import com.rsm.tiffin.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long menuId;
    private LocalDate menuDate;
    private LocalDateTime orderDate;
    private Integer quantity;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
}
