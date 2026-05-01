package com.volunhub.backend.entity;

import com.volunhub.backend.entity.enums.StatusInscricao;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(
    name = "inscricoes",
    uniqueConstraints = @UniqueConstraint(name = "uk_inscricao_voluntario_projeto", columnNames = {"id_voluntario", "id_projeto"})
)
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inscricao")
    private Long idInscricao;

    @Column(name = "data_inscricao", nullable = false, updatable = false)
    private LocalDateTime dataInscricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusInscricao status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_voluntario", nullable = false)
    private Usuario voluntario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_projeto", nullable = false)
    private Projeto projeto;

    public Inscricao() {
    }

    @PrePersist
    public void prePersist() {
        if (dataInscricao == null) {
            dataInscricao = LocalDateTime.now();
        }
    }

    public Long getIdInscricao() {
        return idInscricao;
    }

    public void setIdInscricao(Long idInscricao) {
        this.idInscricao = idInscricao;
    }

    public LocalDateTime getDataInscricao() {
        return dataInscricao;
    }

    public void setDataInscricao(LocalDateTime dataInscricao) {
        this.dataInscricao = dataInscricao;
    }

    public StatusInscricao getStatus() {
        return status;
    }

    public void setStatus(StatusInscricao status) {
        this.status = status;
    }

    public Usuario getVoluntario() {
        return voluntario;
    }

    public void setVoluntario(Usuario voluntario) {
        this.voluntario = voluntario;
    }

    public Projeto getProjeto() {
        return projeto;
    }

    public void setProjeto(Projeto projeto) {
        this.projeto = projeto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Inscricao inscricao)) {
            return false;
        }
        return idInscricao != null && Objects.equals(idInscricao, inscricao.idInscricao);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
