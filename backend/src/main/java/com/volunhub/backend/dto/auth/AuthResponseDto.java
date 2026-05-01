package com.volunhub.backend.dto.auth;

public record AuthResponseDto(
    String token,
    String tipo,
    long expiresIn,
    String email,
    String perfil
) {
}
