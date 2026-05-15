package com.volunhub.backend.repository;

import com.volunhub.backend.entity.Projeto;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProjetoRepository extends JpaRepository<Projeto, Long>, JpaSpecificationExecutor<Projeto> {

    @Override
    @EntityGraph(attributePaths = {"categoria", "organizacao"})
    Page<Projeto> findAll(Specification<Projeto> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"categoria", "organizacao"})
    Optional<Projeto> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select p
        from Projeto p
        join fetch p.categoria
        join fetch p.organizacao
        where p.idProjeto = :idProjeto
        """)
    Optional<Projeto> findByIdForUpdate(@Param("idProjeto") Long idProjeto);
}
