package com.volunhub.backend.repository;

import com.volunhub.backend.entity.HistoricoParticipacao;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HistoricoParticipacaoRepository extends JpaRepository<HistoricoParticipacao, Long> {

    boolean existsByVoluntarioIdUsuarioAndProjetoIdProjeto(Long idVoluntario, Long idProjeto);

    @Override
    @EntityGraph(attributePaths = {"voluntario", "projeto", "projeto.organizacao"})
    Optional<HistoricoParticipacao> findById(Long id);

    @EntityGraph(attributePaths = {"voluntario", "projeto"})
    List<HistoricoParticipacao> findAllByVoluntarioIdUsuario(Long idVoluntario, Sort sort);

    @EntityGraph(attributePaths = {"voluntario", "projeto"})
    List<HistoricoParticipacao> findAllByProjetoIdProjeto(Long idProjeto, Sort sort);
}
