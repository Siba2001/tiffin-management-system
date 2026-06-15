package com.rsm.tiffin.service.impl;

import com.rsm.tiffin.dto.MenuRequest;
import com.rsm.tiffin.dto.MenuResponse;
import com.rsm.tiffin.entity.Menu;
import com.rsm.tiffin.exception.BadRequestException;
import com.rsm.tiffin.exception.ResourceNotFoundException;
import com.rsm.tiffin.mapper.EntityMapper;
import com.rsm.tiffin.repository.MenuRepository;
import com.rsm.tiffin.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;
    private final EntityMapper mapper;

    @Override
    public List<MenuResponse> getAllMenus() {
        return menuRepository.findAll().stream()
                .map(mapper::toMenuResponse)
                .toList();
    }

    @Override
    public MenuResponse getMenuById(Long id) {
        return mapper.toMenuResponse(findMenuById(id));
    }

    @Override
    public MenuResponse getMenuByDate(LocalDate date) {
        return menuRepository.findByMenuDate(date)
                .map(mapper::toMenuResponse)
                .orElse(null);
    }

    @Override
    public List<MenuResponse> getWeeklyMenu(LocalDate startDate) {
        LocalDate endDate = startDate.plusDays(6);
        return menuRepository.findByMenuDateBetweenOrderByMenuDateAsc(startDate, endDate).stream()
                .map(mapper::toMenuResponse)
                .toList();
    }

    @Override
    @Transactional
    public MenuResponse createMenu(MenuRequest request) {
        if (menuRepository.existsByMenuDate(request.getMenuDate())) {
            throw new BadRequestException("Menu already exists for date: " + request.getMenuDate());
        }
        Menu menu = mapper.toMenuEntity(request);
        return mapper.toMenuResponse(menuRepository.save(menu));
    }

    @Override
    @Transactional
    public MenuResponse updateMenu(Long id, MenuRequest request) {
        Menu menu = findMenuById(id);
        if (menuRepository.existsByMenuDateAndIdNot(request.getMenuDate(), id)) {
            throw new BadRequestException("Menu already exists for date: " + request.getMenuDate());
        }
        menu.setMenuDate(request.getMenuDate());
        menu.setBreakfast(request.getBreakfast());
        menu.setLunch(request.getLunch());
        menu.setDinner(request.getDinner());
        return mapper.toMenuResponse(menuRepository.save(menu));
    }

    @Override
    @Transactional
    public void deleteMenu(Long id) {
        if (!menuRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu not found");
        }
        menuRepository.deleteById(id);
    }

    private Menu findMenuById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
    }
}
