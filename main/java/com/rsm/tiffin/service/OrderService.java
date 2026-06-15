package com.rsm.tiffin.service;

import com.rsm.tiffin.dto.*;
import com.rsm.tiffin.entity.OrderStatus;

public interface OrderService {
    PageResponse<OrderResponse> getAllOrders(int page, int size, Long studentId, OrderStatus status);
    OrderResponse getOrderById(Long id);
    OrderResponse placeOrder(OrderRequest request, Long studentId);
    OrderResponse updateOrderStatus(Long id, OrderStatus status);
    OrderResponse cancelOrder(Long id, Long userId, boolean isAdmin);
    void deleteOrder(Long id);
}
