package com.volunhub.backend.dto.categoria;

public record CategoriaResponseDto(
    Long idCategoria,
    String nome,
    String descricao
) {
}
