package com.volunhub.backend.dto.projeto;

import java.time.LocalDate;

public record ProjetoResponseDto(
    Long idProjeto,
    String titulo,
    String descricao,
    String cidade,
    String estado,
    String local,
    String tipoParticipacao,
    LocalDate dataInicio,
    LocalDate dataFim,
    Integer vagas,
    String status,
    Long idCategoria,
    String nomeCategoria,
    Long idOrganizacao,
    String nomeOrganizacao
) {
}
