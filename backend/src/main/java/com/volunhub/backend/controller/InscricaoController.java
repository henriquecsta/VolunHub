package com.volunhub.backend.controller;

import com.volunhub.backend.dto.inscricao.InscricaoCreateRequestDto;
import com.volunhub.backend.dto.inscricao.InscricaoResponseDto;
import com.volunhub.backend.dto.inscricao.InscricaoUpdateStatusRequestDto;
import com.volunhub.backend.service.InscricaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/inscricoes")
public class InscricaoController {

    private final InscricaoService inscricaoService;

    public InscricaoController(InscricaoService inscricaoService) {
        this.inscricaoService = inscricaoService;
    }

    @PostMapping
    public ResponseEntity<InscricaoResponseDto> criarInscricao(
        @Valid @RequestBody InscricaoCreateRequestDto request,
        Authentication authentication
    ) {
        InscricaoResponseDto response = inscricaoService.criarInscricao(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public List<InscricaoResponseDto> listarMinhasInscricoes(Authentication authentication) {
        return inscricaoService.listarMinhasInscricoes(authentication.getName());
    }

    @GetMapping("/projeto/{idProjeto}")
    public List<InscricaoResponseDto> listarInscricoesDoProjeto(
        @PathVariable Long idProjeto,
        Authentication authentication
    ) {
        return inscricaoService.listarInscricoesDoProjeto(idProjeto, authentication.getName());
    }

    @PutMapping("/{id}")
    public InscricaoResponseDto atualizarStatus(
        @PathVariable("id") Long idInscricao,
        @Valid @RequestBody InscricaoUpdateStatusRequestDto request,
        Authentication authentication
    ) {
        return inscricaoService.atualizarStatus(idInscricao, request, authentication.getName());
    }
}
