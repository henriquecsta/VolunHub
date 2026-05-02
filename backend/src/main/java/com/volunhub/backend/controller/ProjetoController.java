package com.volunhub.backend.controller;

import com.volunhub.backend.dto.projeto.ProjetoCreateRequestDto;
import com.volunhub.backend.dto.projeto.ProjetoFiltroDto;
import com.volunhub.backend.dto.projeto.ProjetoResponseDto;
import com.volunhub.backend.dto.projeto.ProjetoUpdateRequestDto;
import com.volunhub.backend.service.ProjetoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/projetos")
public class ProjetoController {

    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    @GetMapping
    public Page<ProjetoResponseDto> listarProjetos(@ModelAttribute ProjetoFiltroDto filtros) {
        return projetoService.listarProjetos(filtros);
    }

    @GetMapping("/{id}")
    public ProjetoResponseDto buscarPorId(@PathVariable("id") Long idProjeto) {
        return projetoService.buscarPorId(idProjeto);
    }

    @PostMapping
    public ResponseEntity<ProjetoResponseDto> criarProjeto(
        @Valid @RequestBody ProjetoCreateRequestDto request,
        Authentication authentication
    ) {
        ProjetoResponseDto response = projetoService.criarProjeto(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ProjetoResponseDto atualizarProjeto(
        @PathVariable("id") Long idProjeto,
        @Valid @RequestBody ProjetoUpdateRequestDto request,
        Authentication authentication
    ) {
        return projetoService.atualizarProjeto(idProjeto, request, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirProjeto(@PathVariable("id") Long idProjeto, Authentication authentication) {
        projetoService.excluirProjeto(idProjeto, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
