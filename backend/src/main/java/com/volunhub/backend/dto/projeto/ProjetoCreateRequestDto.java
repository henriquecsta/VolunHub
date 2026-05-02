package com.volunhub.backend.dto.projeto;

import com.volunhub.backend.entity.enums.StatusProjeto;
import com.volunhub.backend.entity.enums.TipoParticipacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ProjetoCreateRequestDto(
    @NotBlank(message = "Titulo e obrigatorio")
    @Size(max = 150, message = "Titulo deve ter no maximo 150 caracteres")
    String titulo,

    @NotBlank(message = "Descricao e obrigatoria")
    String descricao,

    @NotBlank(message = "Cidade e obrigatoria")
    @Size(max = 100, message = "Cidade deve ter no maximo 100 caracteres")
    String cidade,

    @NotBlank(message = "Estado e obrigatorio")
    @Size(min = 2, max = 2, message = "Estado deve ter 2 caracteres")
    String estado,

    @NotBlank(message = "Local e obrigatorio")
    @Size(max = 255, message = "Local deve ter no maximo 255 caracteres")
    String local,

    @NotNull(message = "Tipo de participacao e obrigatorio")
    TipoParticipacao tipoParticipacao,

    @NotNull(message = "Data de inicio e obrigatoria")
    LocalDate dataInicio,

    @NotNull(message = "Data de fim e obrigatoria")
    LocalDate dataFim,

    @NotNull(message = "Vagas e obrigatorio")
    @Positive(message = "Vagas deve ser maior que zero")
    Integer vagas,

    @NotNull(message = "Status e obrigatorio")
    StatusProjeto status,

    @NotNull(message = "Categoria e obrigatoria")
    Long idCategoria
) {
}
