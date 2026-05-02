package com.volunhub.backend.dto.historico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record HistoricoCreateRequestDto(
    @NotNull(message = "Voluntario e obrigatorio")
    Long idVoluntario,

    @NotNull(message = "Projeto e obrigatorio")
    Long idProjeto,

    @NotBlank(message = "Situacao e obrigatoria")
    @Size(max = 100, message = "Situacao deve ter no maximo 100 caracteres")
    String situacao,

    @Size(max = 1000, message = "Observacao deve ter no maximo 1000 caracteres")
    String observacao
) {
}
