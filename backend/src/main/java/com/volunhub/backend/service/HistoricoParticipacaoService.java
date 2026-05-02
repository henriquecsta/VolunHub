package com.volunhub.backend.service;

import com.volunhub.backend.dto.historico.HistoricoCreateRequestDto;
import com.volunhub.backend.dto.historico.HistoricoResponseDto;
import com.volunhub.backend.entity.HistoricoParticipacao;
import com.volunhub.backend.entity.Projeto;
import com.volunhub.backend.entity.Usuario;
import com.volunhub.backend.entity.enums.PerfilUsuario;
import com.volunhub.backend.repository.HistoricoParticipacaoRepository;
import com.volunhub.backend.repository.ProjetoRepository;
import com.volunhub.backend.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class HistoricoParticipacaoService {

    private static final Sort DEFAULT_SORT = Sort.by(
        Sort.Order.desc("dataRegistro"),
        Sort.Order.desc("idHistorico")
    );
    private static final String DUPLICATE_CONSTRAINT_NAME = "uk_historico_voluntario_projeto";

    private final HistoricoParticipacaoRepository historicoParticipacaoRepository;
    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    public HistoricoParticipacaoService(
        HistoricoParticipacaoRepository historicoParticipacaoRepository,
        ProjetoRepository projetoRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.historicoParticipacaoRepository = historicoParticipacaoRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public HistoricoResponseDto criarHistorico(HistoricoCreateRequestDto request, String emailUsuarioAutenticado) {
        Projeto projeto = buscarProjetoDaOrganizacao(request.idProjeto(), emailUsuarioAutenticado);
        Usuario voluntario = buscarVoluntarioExistente(request.idVoluntario());

        if (historicoParticipacaoRepository.existsByVoluntarioIdUsuarioAndProjetoIdProjeto(
            voluntario.getIdUsuario(),
            projeto.getIdProjeto()
        )) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Ja existe historico registrado para este voluntario neste projeto."
            );
        }

        HistoricoParticipacao historicoParticipacao = new HistoricoParticipacao();
        historicoParticipacao.setProjeto(projeto);
        historicoParticipacao.setVoluntario(voluntario);
        historicoParticipacao.setSituacao(request.situacao().trim());
        historicoParticipacao.setObservacao(normalizeOptionalValue(request.observacao()));

        try {
            HistoricoParticipacao saved = historicoParticipacaoRepository.saveAndFlush(historicoParticipacao);
            return toResponseDto(saved);
        }
        catch (DataIntegrityViolationException ex) {
            if (isDuplicateHistoricoConstraintViolation(ex)) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ja existe historico registrado para este voluntario neste projeto."
                );
            }

            throw ex;
        }
    }

    @Transactional(readOnly = true)
    public List<HistoricoResponseDto> listarMeuHistorico(String emailUsuarioAutenticado) {
        Usuario voluntario = buscarVoluntarioAutenticado(emailUsuarioAutenticado);

        return historicoParticipacaoRepository.findAllByVoluntarioIdUsuario(voluntario.getIdUsuario(), DEFAULT_SORT)
            .stream()
            .map(this::toResponseDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<HistoricoResponseDto> listarHistoricoDoProjeto(Long idProjeto, String emailUsuarioAutenticado) {
        Projeto projeto = buscarProjetoDaOrganizacao(idProjeto, emailUsuarioAutenticado);

        return historicoParticipacaoRepository.findAllByProjetoIdProjeto(projeto.getIdProjeto(), DEFAULT_SORT)
            .stream()
            .map(this::toResponseDto)
            .toList();
    }

    private Usuario buscarVoluntarioAutenticado(String emailUsuarioAutenticado) {
        Usuario usuario = buscarUsuarioAutenticado(emailUsuarioAutenticado);

        if (usuario.getPerfil() != PerfilUsuario.VOLUNTARIO) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Apenas voluntarios podem visualizar o proprio historico."
            );
        }

        return usuario;
    }

    private Usuario buscarOrganizacaoAutenticada(String emailUsuarioAutenticado) {
        Usuario usuario = buscarUsuarioAutenticado(emailUsuarioAutenticado);

        if (usuario.getPerfil() != PerfilUsuario.ORGANIZACAO) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Apenas organizacoes podem gerenciar historicos de participacao."
            );
        }

        return usuario;
    }

    private Usuario buscarUsuarioAutenticado(String emailUsuarioAutenticado) {
        return usuarioRepository.findByEmailIgnoreCase(emailUsuarioAutenticado)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario autenticado nao encontrado."));
    }

    private Usuario buscarVoluntarioExistente(Long idVoluntario) {
        Usuario usuario = usuarioRepository.findById(idVoluntario)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Voluntario nao encontrado."));

        if (usuario.getPerfil() != PerfilUsuario.VOLUNTARIO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O usuario informado nao possui perfil VOLUNTARIO.");
        }

        return usuario;
    }

    private Projeto buscarProjetoDaOrganizacao(Long idProjeto, String emailUsuarioAutenticado) {
        Usuario organizacao = buscarOrganizacaoAutenticada(emailUsuarioAutenticado);
        Projeto projeto = buscarProjetoExistente(idProjeto);

        if (!projeto.getOrganizacao().getIdUsuario().equals(organizacao.getIdUsuario())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Voce so pode acessar historicos dos projetos da sua organizacao."
            );
        }

        return projeto;
    }

    private Projeto buscarProjetoExistente(Long idProjeto) {
        return projetoRepository.findById(idProjeto)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto nao encontrado."));
    }

    private String normalizeOptionalValue(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }

    private boolean isDuplicateHistoricoConstraintViolation(Throwable throwable) {
        Throwable current = throwable;

        while (current != null) {
            String message = current.getMessage();

            if (message != null) {
                String normalizedMessage = message.toLowerCase(Locale.ROOT);

                if (normalizedMessage.contains(DUPLICATE_CONSTRAINT_NAME) || normalizedMessage.contains("duplicate entry")) {
                    return true;
                }
            }

            current = current.getCause();
        }

        return false;
    }

    private HistoricoResponseDto toResponseDto(HistoricoParticipacao historicoParticipacao) {
        return new HistoricoResponseDto(
            historicoParticipacao.getIdHistorico(),
            historicoParticipacao.getDataRegistro(),
            historicoParticipacao.getSituacao(),
            historicoParticipacao.getObservacao(),
            historicoParticipacao.getProjeto().getIdProjeto(),
            historicoParticipacao.getProjeto().getTitulo(),
            historicoParticipacao.getVoluntario().getIdUsuario(),
            historicoParticipacao.getVoluntario().getNome()
        );
    }
}
