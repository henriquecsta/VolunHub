package com.volunhub.backend.dto.inscricao;

import jakarta.validation.constraints.NotNull;

public record InscricaoCreateRequestDto(
    @NotNull(message = "Projeto e obrigatorio")
    Long idProjeto
) {
}
