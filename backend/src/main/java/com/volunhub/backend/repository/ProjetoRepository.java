package com.volunhub.backend.repository;

import com.volunhub.backend.entity.Projeto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface ProjetoRepository extends JpaRepository<Projeto, Long>, JpaSpecificationExecutor<Projeto> {

    @Override
    @EntityGraph(attributePaths = {"categoria", "organizacao"})
    Page<Projeto> findAll(Specification<Projeto> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"categoria", "organizacao"})
    Optional<Projeto> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"categoria", "organizacao"})
    Optional<Projeto> findByIdForUpdate(Long id);
}
