package com.volunhub.backend.service;

import com.volunhub.backend.entity.Usuario;
import com.volunhub.backend.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado."));

        return new User(
            usuario.getEmail(),
            usuario.getSenha(),
            List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name()))
        );
    }
}
