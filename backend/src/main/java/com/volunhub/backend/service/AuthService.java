package com.volunhub.backend.service;

import com.volunhub.backend.dto.auth.AuthResponseDto;
import com.volunhub.backend.dto.auth.LoginRequestDto;
import com.volunhub.backend.dto.auth.RegisterRequestDto;
import com.volunhub.backend.dto.auth.RegisterResponseDto;
import com.volunhub.backend.entity.Usuario;
import com.volunhub.backend.entity.enums.PerfilUsuario;
import com.volunhub.backend.repository.UsuarioRepository;
import com.volunhub.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
        UsuarioRepository usuarioRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public RegisterResponseDto register(RegisterRequestDto request) {
        String email = normalizeEmail(request.email());

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email ja cadastrado.");
        }

        PerfilUsuario perfil = parsePerfil(request.perfil());

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome().trim());
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(request.senha()));
        usuario.setPerfil(perfil);
        usuario.setTelefone(normalizeOptionalValue(request.telefone()));

        Usuario saved = usuarioRepository.save(usuario);

        return new RegisterResponseDto(
            saved.getIdUsuario(),
            saved.getNome(),
            saved.getEmail(),
            saved.getPerfil().name(),
            saved.getTelefone()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponseDto login(LoginRequestDto request) {
        String email = normalizeEmail(request.email());

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.senha())
            );
        }
        catch (BadCredentialsException | AuthenticationServiceException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha invalidos.");
        }

        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha invalidos."));

        String token = jwtService.generateToken(usuario);

        return new AuthResponseDto(
            token,
            "Bearer",
            jwtService.getJwtExpirationMs(),
            usuario.getEmail(),
            usuario.getPerfil().name()
        );
    }

    private PerfilUsuario parsePerfil(String perfil) {
        try {
            return PerfilUsuario.valueOf(perfil.trim().toUpperCase(Locale.ROOT));
        }
        catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Perfil invalido. Use VOLUNTARIO ou ORGANIZACAO."
            );
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeOptionalValue(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }
}
