import api from './api';
import { formatEnumLabel } from '../utils/formatters';

function normalizeProjectId(idProjeto) {
  const normalizedId = Number(idProjeto);

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new Error('Projeto invalido para inscricao.');
  }

  return normalizedId;
}

function adaptInscricao(apiInscricao) {
  return {
    id: apiInscricao.idInscricao,
    subscribedAt: apiInscricao.dataInscricao,
    status: apiInscricao.status,
    statusLabel: formatEnumLabel(apiInscricao.status),
    projectId: apiInscricao.idProjeto,
    projectTitle: apiInscricao.tituloProjeto,
    projectStatus: apiInscricao.statusProjeto,
    projectStatusLabel: formatEnumLabel(apiInscricao.statusProjeto),
    volunteerId: apiInscricao.idVoluntario,
    volunteerName: apiInscricao.nomeVoluntario,
  };
}

export async function inscreverEmProjeto(idProjeto) {
  const response = await api.post('/inscricoes', {
    idProjeto: normalizeProjectId(idProjeto),
  });

  return adaptInscricao(response.data);
}
