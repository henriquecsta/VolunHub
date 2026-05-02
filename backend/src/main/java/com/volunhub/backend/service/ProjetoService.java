package com.volunhub.backend.service;

import com.volunhub.backend.dto.projeto.ProjetoCreateRequestDto;
import com.volunhub.backend.dto.projeto.ProjetoFiltroDto;
import com.volunhub.backend.dto.projeto.ProjetoResponseDto;
import com.volunhub.backend.dto.projeto.ProjetoUpdateRequestDto;
import com.volunhub.backend.entity.Categoria;
import com.volunhub.backend.entity.Projeto;
import com.volunhub.backend.entity.Usuario;
import com.volunhub.backend.entity.enums.PerfilUsuario;
import com.volunhub.backend.repository.CategoriaRepository;
import com.volunhub.backend.repository.ProjetoRepository;
import com.volunhub.backend.repository.ProjetoSpecifications;
import com.volunhub.backend.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class ProjetoService {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 100;

    private final ProjetoRepository projetoRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public ProjetoService(
        ProjetoRepository projetoRepository,
        CategoriaRepository categoriaRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.projetoRepository = projetoRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProjetoResponseDto> listarProjetos(ProjetoFiltroDto filtros) {
        Pageable pageable = buildPageable(filtros);

        return projetoRepository.findAll(ProjetoSpecifications.comFiltros(filtros), pageable)
            .map(this::toResponseDto);
    }

    @Transactional(readOnly = true)
    public ProjetoResponseDto buscarPorId(Long idProjeto) {
        Projeto projeto = buscarProjetoExistente(idProjeto);
        return toResponseDto(projeto);
    }

    @Transactional
    public ProjetoResponseDto criarProjeto(ProjetoCreateRequestDto request, String emailUsuarioAutenticado) {
        validarDatas(request.dataInicio(), request.dataFim());

        Usuario organizacao = buscarOrganizacaoAutenticada(emailUsuarioAutenticado);
        Categoria categoria = buscarCategoriaExistente(request.idCategoria());

        Projeto projeto = new Projeto();
        aplicarDados(projeto, request, categoria);
        projeto.setOrganizacao(organizacao);

        Projeto saved = projetoRepository.save(projeto);
        return toResponseDto(saved);
    }

    @Transactional
    public ProjetoResponseDto atualizarProjeto(
        Long idProjeto,
        ProjetoUpdateRequestDto request,
        String emailUsuarioAutenticado
    ) {
        validarDatas(request.dataInicio(), request.dataFim());

        Projeto projeto = buscarProjetoDaOrganizacao(idProjeto, emailUsuarioAutenticado);
        Categoria categoria = buscarCategoriaExistente(request.idCategoria());

        aplicarDados(projeto, request, categoria);

        Projeto saved = projetoRepository.save(projeto);
        return toResponseDto(saved);
    }

    @Transactional
    public void excluirProjeto(Long idProjeto, String emailUsuarioAutenticado) {
        Projeto projeto = buscarProjetoDaOrganizacao(idProjeto, emailUsuarioAutenticado);
        projetoRepository.delete(projeto);
    }

    private void aplicarDados(Projeto projeto, ProjetoCreateRequestDto request, Categoria categoria) {
        projeto.setTitulo(request.titulo().trim());
        projeto.setDescricao(request.descricao().trim());
        projeto.setCidade(request.cidade().trim());
        projeto.setEstado(normalizeEstado(request.estado()));
        projeto.setLocal(request.local().trim());
        projeto.setTipoParticipacao(request.tipoParticipacao());
        projeto.setDataInicio(request.dataInicio());
        projeto.setDataFim(request.dataFim());
        projeto.setVagas(request.vagas());
        projeto.setStatus(request.status());
        projeto.setCategoria(categoria);
    }

    private void aplicarDados(Projeto projeto, ProjetoUpdateRequestDto request, Categoria categoria) {
        projeto.setTitulo(request.titulo().trim());
        projeto.setDescricao(request.descricao().trim());
        projeto.setCidade(request.cidade().trim());
        projeto.setEstado(normalizeEstado(request.estado()));
        projeto.setLocal(request.local().trim());
        projeto.setTipoParticipacao(request.tipoParticipacao());
        projeto.setDataInicio(request.dataInicio());
        projeto.setDataFim(request.dataFim());
        projeto.setVagas(request.vagas());
        projeto.setStatus(request.status());
        projeto.setCategoria(categoria);
    }

    private void validarDatas(java.time.LocalDate dataInicio, java.time.LocalDate dataFim) {
        if (dataFim.isBefore(dataInicio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data fim nao pode ser anterior a data inicio.");
        }
    }

    private Usuario buscarOrganizacaoAutenticada(String emailUsuarioAutenticado) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(emailUsuarioAutenticado)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario autenticado nao encontrado."));

        if (usuario.getPerfil() != PerfilUsuario.ORGANIZACAO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas organizacoes podem gerenciar projetos.");
        }

        return usuario;
    }

    private Projeto buscarProjetoDaOrganizacao(Long idProjeto, String emailUsuarioAutenticado) {
        Usuario organizacao = buscarOrganizacaoAutenticada(emailUsuarioAutenticado);
        Projeto projeto = buscarProjetoExistente(idProjeto);

        if (!projeto.getOrganizacao().getIdUsuario().equals(organizacao.getIdUsuario())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Voce so pode alterar projetos criados pela sua organizacao.");
        }

        return projeto;
    }

    private Projeto buscarProjetoExistente(Long idProjeto) {
        return projetoRepository.findById(idProjeto)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Projeto nao encontrado."));
    }

    private Categoria buscarCategoriaExistente(Long idCategoria) {
        return categoriaRepository.findById(idCategoria)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria nao encontrada."));
    }

    private Pageable buildPageable(ProjetoFiltroDto filtros) {
        int page = filtros.getPage() == null || filtros.getPage() < 0 ? DEFAULT_PAGE : filtros.getPage();
        int size = filtros.getSize() == null || filtros.getSize() <= 0 ? DEFAULT_SIZE : Math.min(filtros.getSize(), MAX_SIZE);

        return PageRequest.of(page, size, buildSort(filtros.getOrdenacao()));
    }

    private Sort buildSort(String ordenacao) {
        if (ordenacao == null || ordenacao.isBlank()) {
            return Sort.by(Sort.Order.desc("dataInicio"), Sort.Order.desc("idProjeto"));
        }

        return switch (ordenacao.trim().toLowerCase(Locale.ROOT)) {
            case "maisantigos" -> Sort.by(Sort.Order.asc("dataInicio"), Sort.Order.asc("idProjeto"));
            case "tituloasc" -> Sort.by(Sort.Order.asc("titulo"), Sort.Order.asc("idProjeto"));
            case "titulodesc" -> Sort.by(Sort.Order.desc("titulo"), Sort.Order.desc("idProjeto"));
            case "maisrecentes" -> Sort.by(Sort.Order.desc("dataInicio"), Sort.Order.desc("idProjeto"));
            default -> Sort.by(Sort.Order.desc("dataInicio"), Sort.Order.desc("idProjeto"));
        };
    }

    private String normalizeEstado(String estado) {
        return estado.trim().toUpperCase(Locale.ROOT);
    }

    private ProjetoResponseDto toResponseDto(Projeto projeto) {
        return new ProjetoResponseDto(
            projeto.getIdProjeto(),
            projeto.getTitulo(),
            projeto.getDescricao(),
            projeto.getCidade(),
            projeto.getEstado(),
            projeto.getLocal(),
            projeto.getTipoParticipacao().name(),
            projeto.getDataInicio(),
            projeto.getDataFim(),
            projeto.getVagas(),
            projeto.getStatus().name(),
            projeto.getCategoria().getIdCategoria(),
            projeto.getCategoria().getNome(),
            projeto.getOrganizacao().getIdUsuario(),
            projeto.getOrganizacao().getNome()
        );
    }
}
