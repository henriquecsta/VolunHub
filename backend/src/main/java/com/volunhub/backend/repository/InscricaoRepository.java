package com.volunhub.backend.repository;

import com.volunhub.backend.entity.Inscricao;
import com.volunhub.backend.entity.enums.StatusInscricao;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface InscricaoRepository extends JpaRepository<Inscricao, Long> {

    boolean existsByVoluntarioIdUsuarioAndProjetoIdProjeto(Long idVoluntario, Long idProjeto);

    long countByProjetoIdProjetoAndStatusIn(Long idProjeto, Collection<StatusInscricao> statuses);

    @Override
    @EntityGraph(attributePaths = {"voluntario", "projeto", "projeto.organizacao"})
    Optional<Inscricao> findById(Long id);

    @EntityGraph(attributePaths = {"voluntario", "projeto"})
    List<Inscricao> findAllByVoluntarioIdUsuario(Long idVoluntario, Sort sort);

    @EntityGraph(attributePaths = {"voluntario", "projeto"})
    List<Inscricao> findAllByProjetoIdProjeto(Long idProjeto, Sort sort);
}
