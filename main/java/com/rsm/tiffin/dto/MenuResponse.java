package com.rsm.tiffin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponse {
    private Long id;
    private LocalDate menuDate;
    private String breakfast;
    private String lunch;
    private String dinner;
    private LocalDateTime createdAt;
}
