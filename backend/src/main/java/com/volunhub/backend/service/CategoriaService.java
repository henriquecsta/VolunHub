package com.volunhub.backend.service;

import com.volunhub.backend.dto.categoria.CategoriaResponseDto;
import com.volunhub.backend.entity.Categoria;
import com.volunhub.backend.repository.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDto> listarCategorias() {
        return categoriaRepository.findAllByOrderByNomeAsc()
            .stream()
            .map(this::toResponseDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDto buscarPorId(Long idCategoria) {
        Categoria categoria = categoriaRepository.findById(idCategoria)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria nao encontrada."));

        return toResponseDto(categoria);
    }

    private CategoriaResponseDto toResponseDto(Categoria categoria) {
        return new CategoriaResponseDto(
            categoria.getIdCategoria(),
            categoria.getNome(),
            categoria.getDescricao()
        );
    }
}
