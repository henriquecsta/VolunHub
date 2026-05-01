package com.volunhub.backend.dto.auth;

public record RegisterResponseDto(
    Long idUsuario,
    String nome,
    String email,
    String perfil,
    String telefone
) {
}
