package com.volunhub.backend.controller;

import com.volunhub.backend.dto.categoria.CategoriaResponseDto;
import com.volunhub.backend.service.CategoriaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<CategoriaResponseDto> listarCategorias() {
        return categoriaService.listarCategorias();
    }

    @GetMapping("/{id}")
    public CategoriaResponseDto buscarPorId(@PathVariable("id") Long idCategoria) {
        return categoriaService.buscarPorId(idCategoria);
    }
}
