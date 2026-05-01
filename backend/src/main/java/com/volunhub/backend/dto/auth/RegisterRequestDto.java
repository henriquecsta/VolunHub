package com.volunhub.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
    @NotBlank(message = "Nome e obrigatorio")
    @Size(max = 150, message = "Nome deve ter no maximo 150 caracteres")
    String nome,

    @NotBlank(message = "Email e obrigatorio")
    @Email(message = "Email invalido")
    @Size(max = 150, message = "Email deve ter no maximo 150 caracteres")
    String email,

    @NotBlank(message = "Senha e obrigatoria")
    @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
    String senha,

    @NotBlank(message = "Perfil e obrigatorio")
    String perfil,

    @Size(max = 20, message = "Telefone deve ter no maximo 20 caracteres")
    String telefone
) {
}
