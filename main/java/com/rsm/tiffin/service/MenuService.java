package com.rsm.tiffin.service;

import com.rsm.tiffin.dto.MenuRequest;
import com.rsm.tiffin.dto.MenuResponse;

import java.time.LocalDate;
import java.util.List;

public interface MenuService {
    List<MenuResponse> getAllMenus();
    MenuResponse getMenuById(Long id);
    MenuResponse getMenuByDate(LocalDate date);
    List<MenuResponse> getWeeklyMenu(LocalDate startDate);
    MenuResponse createMenu(MenuRequest request);
    MenuResponse updateMenu(Long id, MenuRequest request);
    void deleteMenu(Long id);
}
