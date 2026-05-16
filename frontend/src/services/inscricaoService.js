import api from './api';
import { buscarProjetoPorId } from './projetoService';
import { formatDateTime, formatEnumLabel } from '../utils/formatters';

function normalizeProjectId(idProjeto) {
  const normalizedId = Number(idProjeto);

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new Error('Projeto invalido para inscricao.');
  }

  return normalizedId;
}

function adaptInscricao(apiInscricao, project = null) {
  return {
    id: apiInscricao.idInscricao,
    subscribedAt: apiInscricao.dataInscricao,
    subscribedAtLabel: formatDateTime(apiInscricao.dataInscricao),
    status: apiInscricao.status,
    statusLabel: formatEnumLabel(apiInscricao.status),
    projectId: apiInscricao.idProjeto,
    projectTitle: apiInscricao.tituloProjeto,
    projectSummary: project?.summary ?? 'Resumo do projeto indisponivel no momento.',
    projectStatus: apiInscricao.statusProjeto,
    projectStatusLabel: formatEnumLabel(apiInscricao.statusProjeto),
    volunteerId: apiInscricao.idVoluntario,
    volunteerName: apiInscricao.nomeVoluntario,
    project,
  };
}

export async function inscreverEmProjeto(idProjeto) {
  const response = await api.post('/inscricoes', {
    idProjeto: normalizeProjectId(idProjeto),
  });

  return adaptInscricao(response.data);
}

export async function listarMinhasInscricoes() {
  const response = await api.get('/inscricoes/me');
  const inscricoes = Array.isArray(response.data) ? response.data : [];

  return inscricoes.map(adaptInscricao);
}

export async function listarInscricoesDoProjeto(idProjeto) {
  const response = await api.get(`/inscricoes/projeto/${normalizeProjectId(idProjeto)}`);
  const inscricoes = Array.isArray(response.data) ? response.data : [];

  return inscricoes.map(adaptInscricao);
}

export async function listarMinhasInscricoesComProjetos() {
  const inscricoes = await listarMinhasInscricoes();

  return Promise.all(
    inscricoes.map(async (inscricao) => {
      try {
        const project = await buscarProjetoPorId(inscricao.projectId);

        return {
          ...inscricao,
          project,
          projectSummary: project.summary,
          projectStatus: project.status,
          projectStatusLabel: project.statusLabel,
        };
      } catch {
        return inscricao;
      }
    }),
  );
}

export async function buscarMinhaInscricaoNoProjeto(idProjeto) {
  const normalizedProjectId = normalizeProjectId(idProjeto);
  const inscricoes = await listarMinhasInscricoes();

  return (
    inscricoes.find((inscricao) => Number(inscricao.projectId) === normalizedProjectId) ?? null
  );
}
