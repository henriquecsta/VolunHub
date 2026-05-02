package com.volunhub.backend.dto.inscricao;

import com.volunhub.backend.entity.enums.StatusInscricao;
import jakarta.validation.constraints.NotNull;

public record InscricaoUpdateStatusRequestDto(
    @NotNull(message = "Status e obrigatorio")
    StatusInscricao status
) {
}
