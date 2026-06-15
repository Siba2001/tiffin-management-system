package com.rsm.tiffin.service.impl;

import com.rsm.tiffin.dto.*;
import com.rsm.tiffin.entity.*;
import com.rsm.tiffin.exception.BadRequestException;
import com.rsm.tiffin.exception.ResourceNotFoundException;
import com.rsm.tiffin.mapper.EntityMapper;
import com.rsm.tiffin.repository.MenuRepository;
import com.rsm.tiffin.repository.OrderRepository;
import com.rsm.tiffin.repository.UserRepository;
import com.rsm.tiffin.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuRepository menuRepository;
    private final EntityMapper mapper;

    @Value("${tiffin.price-per-meal}")
    private BigDecimal pricePerMeal;

    @Override
    public PageResponse<OrderResponse> getAllOrders(int page, int size, Long studentId, OrderStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orderPage;

        if (studentId != null) {
            orderPage = orderRepository.findByStudentId(studentId, pageable);
        } else if (status != null) {
            orderPage = orderRepository.findByOrderStatus(status, pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(mapper::toOrderResponse)
                .toList();

        return PageResponse.<OrderResponse>builder()
                .content(content)
                .page(orderPage.getNumber())
                .size(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        return mapper.toOrderResponse(findOrderById(id));
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderRequest request, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getStatus() == UserStatus.INACTIVE) {
            throw new BadRequestException("Cannot place order. Account is inactive.");
        }

        Menu menu = menuRepository.findById(request.getMenuId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found"));

        BigDecimal totalAmount = pricePerMeal.multiply(BigDecimal.valueOf(request.getQuantity()));

        Order order = Order.builder()
                .student(student)
                .menu(menu)
                .quantity(request.getQuantity())
                .totalAmount(totalAmount)
                .orderStatus(OrderStatus.PLACED)
                .build();

        return mapper.toOrderResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        Order order = findOrderById(id);
        order.setOrderStatus(status);
        return mapper.toOrderResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long id, Long userId, boolean isAdmin) {
        Order order = findOrderById(id);

        if (!isAdmin && !order.getStudent().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own orders");
        }

        if (order.getOrderStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed order");
        }

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        return mapper.toOrderResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found");
        }
        orderRepository.deleteById(id);
    }

    private Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}
