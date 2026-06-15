package com.rsm.tiffin.repository;

import com.rsm.tiffin.entity.Menu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    Optional<Menu> findByMenuDate(LocalDate menuDate);

    List<Menu> findByMenuDateBetweenOrderByMenuDateAsc(LocalDate startDate, LocalDate endDate);

    boolean existsByMenuDate(LocalDate menuDate);

    boolean existsByMenuDateAndIdNot(LocalDate menuDate, Long id);
}
