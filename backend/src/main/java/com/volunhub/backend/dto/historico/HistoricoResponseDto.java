package com.volunhub.backend.dto.historico;

import java.time.LocalDateTime;

public record HistoricoResponseDto(
    Long idHistorico,
    LocalDateTime dataRegistro,
    String situacao,
    String observacao,
    Long idProjeto,
    String tituloProjeto,
    Long idVoluntario,
    String nomeVoluntario
) {
}
