package com.volunhub.backend.repository;

import com.volunhub.backend.dto.projeto.ProjetoFiltroDto;
import com.volunhub.backend.entity.Categoria;
import com.volunhub.backend.entity.Projeto;
import com.volunhub.backend.entity.enums.StatusProjeto;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Locale;

public final class ProjetoSpecifications {

    private ProjetoSpecifications() {
    }

    public static Specification<Projeto> comFiltros(ProjetoFiltroDto filtros) {
        StatusProjeto status = filtros.getStatus() != null ? filtros.getStatus() : StatusProjeto.ATIVO;

        return Specification.allOf(
            cidadeContem(filtros.getCidade()),
            estadoIgual(filtros.getEstado()),
            tipoParticipacaoIgual(filtros.getTipoParticipacao()),
            categoriaIgual(filtros.getIdCategoria()),
            statusIgual(status),
            dataInicioMaiorOuIgual(filtros.getDataInicio()),
            dataFimMenorOuIgual(filtros.getDataFim()),
            palavraChaveContem(filtros.getPalavraChave())
        );
    }

    private static Specification<Projeto> cidadeContem(String cidade) {
        if (cidade == null || cidade.isBlank()) {
            return null;
        }

        String filtro = "%" + cidade.trim().toLowerCase(Locale.ROOT) + "%";
        return (root, query, builder) -> builder.like(builder.lower(root.get("cidade")), filtro);
    }

    private static Specification<Projeto> estadoIgual(String estado) {
        if (estado == null || estado.isBlank()) {
            return null;
        }

        return (root, query, builder) ->
            builder.equal(builder.lower(root.get("estado")), estado.trim().toLowerCase(Locale.ROOT));
    }

    private static Specification<Projeto> tipoParticipacaoIgual(Enum<?> tipoParticipacao) {
        if (tipoParticipacao == null) {
            return null;
        }

        return (root, query, builder) -> builder.equal(root.get("tipoParticipacao"), tipoParticipacao);
    }

    private static Specification<Projeto> categoriaIgual(Long idCategoria) {
        if (idCategoria == null) {
            return null;
        }

        return (root, query, builder) -> {
            Join<Projeto, Categoria> categoria = root.join("categoria");
            return builder.equal(categoria.get("idCategoria"), idCategoria);
        };
    }

    private static Specification<Projeto> statusIgual(StatusProjeto statusProjeto) {
        if (statusProjeto == null) {
            return null;
        }

        return (root, query, builder) -> builder.equal(root.get("status"), statusProjeto);
    }

    private static Specification<Projeto> dataInicioMaiorOuIgual(LocalDate dataInicio) {
        if (dataInicio == null) {
            return null;
        }

        return (root, query, builder) -> builder.greaterThanOrEqualTo(root.get("dataInicio"), dataInicio);
    }

    private static Specification<Projeto> dataFimMenorOuIgual(LocalDate dataFim) {
        if (dataFim == null) {
            return null;
        }

        return (root, query, builder) -> builder.lessThanOrEqualTo(root.get("dataFim"), dataFim);
    }

    private static Specification<Projeto> palavraChaveContem(String palavraChave) {
        if (palavraChave == null || palavraChave.isBlank()) {
            return null;
        }

        String filtro = "%" + palavraChave.trim().toLowerCase(Locale.ROOT) + "%";
        return (root, query, builder) -> builder.or(
            builder.like(builder.lower(root.get("titulo")), filtro),
            builder.like(builder.lower(root.get("descricao")), filtro)
        );
    }
}
