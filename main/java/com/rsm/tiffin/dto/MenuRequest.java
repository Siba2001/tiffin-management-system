package com.rsm.tiffin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuRequest {

    @NotNull(message = "Menu date is required")
    private LocalDate menuDate;

    private String breakfast;
    private String lunch;
    private String dinner;
}
