package com.volunhub.backend.service;

import com.volunhub.backend.dto.inscricao.InscricaoCreateRequestDto;
import com.volunhub.backend.dto.inscricao.InscricaoResponseDto;
import com.volunhub.backend.dto.inscricao.InscricaoUpdateStatusRequestDto;
import com.volunhub.backend.entity.Inscricao;
import com.volunhub.backend.entity.Projeto;
import com.volunhub.backend.entity.Usuario;
import com.volunhub.backend.entity.enums.PerfilUsuario;
import com.volunhub.backend.entity.enums.StatusInscricao;
import com.volunhub.backend.entity.enums.StatusProjeto;
import com.volunhub.backend.repository.InscricaoRepository;
import com.volunhub.backend.repository.ProjetoRepository;
import com.volunhub.backend.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class InscricaoService {

    private static final Sort DEFAULT_SORT = Sort.by(
        Sort.Order.desc("dataInscricao"),
        Sort.Order.desc("idInscricao")
    );
    private static final Set<StatusInscricao> STATUS_OCUPAM_VAGA =
        EnumSet.of(StatusInscricao.PENDENTE, StatusInscricao.APROVADA);
    private static final String DUPLICATE_CONSTRAINT_NAME = "uk_inscricao_voluntario_projeto";

    private final InscricaoRepository inscricaoRepository;
    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    public InscricaoService(
        InscricaoRepository inscricaoRepository,
        ProjetoRepository projetoRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.inscricaoRepository = inscricaoRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public InscricaoResponseDto criarInscricao(InscricaoCreateRequestDto request, String emailUsuarioAutenticado) {
        Usuario voluntario = buscarVoluntarioAutenticado(emailUsuarioAutenticado);
        Projeto projeto = buscarProjetoExistenteParaInscricao(request.idProjeto());

        validarProjetoDisponivelParaInscricao(projeto);

        if (inscricaoRepository.existsByVoluntarioIdUsuarioAndProjetoIdProjeto(
            voluntario.getIdUsuario(),
            projeto.getIdProjeto()
        )) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voce ja esta inscrito neste projeto.");
        }

        validarVagasDisponiveis(projeto);

        Inscricao inscricao = new Inscricao();
        inscricao.setVoluntario(voluntario);
        inscricao.setProjeto(projeto);
        inscricao.setStatus(StatusInscricao.PENDENTE);

        try {
            Inscricao saved = inscricaoRepository.saveAndFlush(inscricao);
            return toResponseDto(saved);
        }
        catch (DataIntegrityViolationException ex) {
            if (isDuplicateInscricaoConstraintViolation(ex)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voce ja esta inscrito neste projeto.");
            }

            throw ex;
        }
    }

    @Transactional(readOnly = true)
    public List<InscricaoResponseDto> listarMinhasInscricoes(String emailUsuarioAutenticado) {
        Usuario voluntario = buscarVoluntarioAutenticado(emailUsuarioAutenticado);

        return inscricaoRepository.findAllByVoluntarioIdUsuario(voluntario.getIdUsuario(), DEFAULT_SORT)
            .stream()
            .map(this::toResponseDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<InscricaoResponseDto> listarInscricoesDoProjeto(Long idProjeto, String emailUsuarioAutenticado) {
        Projeto projeto = buscarProjetoDaOrganizacao(idProjeto, emailUsuarioAutenticado);

        return inscricaoRepository.findAllByProjetoIdProjeto(projeto.getIdProjeto(), DEFAULT_SORT)
            .stream()
            .map(this::toResponseDto)
            .toList();
    }

    @Transactional
    public InscricaoResponseDto atualizarStatus(
        Long idInscricao,
        InscricaoUpdateStatusRequestDto request,
        String emailUsuarioAutenticado
    ) {
        Inscricao inscricao = buscarInscricaoDaOrganizacao(idInscricao, emailUsuarioAutenticado);
        validarTransicaoStatus(inscricao.getStatus(), request.status());

        inscricao.setStatus(request.status());

        Inscricao saved = inscricaoRepository.save(inscricao);
        return toResponseDto(saved);
    }

    private void validarProjetoDisponivelParaInscricao(Projeto projeto) {
        if (projeto.getStatus() != StatusProjeto.ATIVO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Apenas projetos com status ATIVO aceitam inscricoes.");
        }
    }

    private void validarVagasDisponiveis(Projeto projeto) {
        long inscricoesAtivas = contarVagasOcupadas(projeto.getIdProjeto());

        if (inscricoesAtivas >= projeto.getVagas()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Projeto sem vagas disponiveis.");
        }
    }

    private long contarVagasOcupadas(Long idProjeto) {
        return inscricaoRepository.countByProjetoIdProjetoAndStatusIn(idProjeto, STATUS_OCUPAM_VAGA);
    }

    private void validarTransicaoStatus(StatusInscricao statusAtual, StatusInscricao novoStatus) {
        if (statusAtual == StatusInscricao.PENDENTE
            && (novoStatus == StatusInscricao.APROVADA || novoStatus == StatusInscricao.RECUSADA)) {
            return;
        }

        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Transicao de status invalida. Apenas PENDENTE para APROVADA ou RECUSADA e permitido."
        );
    }

    private Usuario buscarVoluntarioAutenticado(String emailUsuarioAutenticado) {
        Usuario usuario = buscarUsuarioAutenticado(emailUsuarioAutenticado);

        if (usuario.getPerfil() != PerfilUsuario.VOLUNTARIO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas voluntarios podem se inscrever em projetos.");
        }

        return usuario;
    }

    private Usuario buscarOrganizacaoAutenticada(String emailUsuarioAutenticado) {
        Usuario usuario = buscarUsuarioAutenticado(emailUsuarioAutenticado);

        if (usuario.getPerfil() != PerfilUsuario.ORGANIZACAO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas organizacoes podem gerenciar inscricoes.");
        }

        return usuario;
    }

    private Usuario buscarUsuarioAutenticado(String emailUsuarioAutenticado) {
        return usuarioRepository.findByEmailIgnoreCase(emailUsuarioAutenticado)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario autenticado nao encontrado."));
    }

    private Projeto buscarProjetoDaOrganizacao(Long idProjeto, String emailUsuarioAutenticado) {
        Usuario organizacao = buscarOrganizacaoAutenticada(emailUsuarioAutenticado);
        Projeto projeto = buscarProjetoExistente(idProjeto);

        if (!projeto.getOrganizacao().getIdUsuario().equals(organizacao.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Voce so pode visualizar inscricoes dos projetos da sua organizacao.");
        }

        return projeto;
    }

    private Inscricao buscarInscricaoDaOrganizacao(Long idInscricao, String emailUsuarioAutenticado) {
        Usuario organizacao = buscarOrganizacaoAutenticada(emailUsuarioAutenticado);
        Inscricao inscricao = buscarInscricaoExistente(idInscricao);

        if (!inscricao.getProjeto().getOrganizacao().getIdUsuario().equals(organizacao.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Voce so pode alterar inscricoes dos projetos da sua organizacao.");
        }

        return inscricao;
    }

    private Projeto buscarProjetoExistente(Long idProjeto) {
        return projetoRepository.findById(idProjeto)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto nao encontrado."));
    }

    private Projeto buscarProjetoExistenteParaInscricao(Long idProjeto) {
        return projetoRepository.findByIdForUpdate(idProjeto)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto nao encontrado."));
    }

    private Inscricao buscarInscricaoExistente(Long idInscricao) {
        return inscricaoRepository.findById(idInscricao)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscricao nao encontrada."));
    }

    private boolean isDuplicateInscricaoConstraintViolation(Throwable throwable) {
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

    private InscricaoResponseDto toResponseDto(Inscricao inscricao) {
        return new InscricaoResponseDto(
            inscricao.getIdInscricao(),
            inscricao.getDataInscricao(),
            inscricao.getStatus().name(),
            inscricao.getProjeto().getIdProjeto(),
            inscricao.getProjeto().getTitulo(),
            inscricao.getProjeto().getStatus().name(),
            inscricao.getVoluntario().getIdUsuario(),
            inscricao.getVoluntario().getNome()
        );
    }
}
