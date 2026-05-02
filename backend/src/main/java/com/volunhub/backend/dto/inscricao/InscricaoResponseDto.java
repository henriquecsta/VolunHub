package com.volunhub.backend.dto.inscricao;

import java.time.LocalDateTime;

public record InscricaoResponseDto(
    Long idInscricao,
    LocalDateTime dataInscricao,
    String status,
    Long idProjeto,
    String tituloProjeto,
    String statusProjeto,
    Long idVoluntario,
    String nomeVoluntario
) {
}
