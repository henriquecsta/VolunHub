import api from './api';
import { getProjectDetailPath } from '../constants/routes';
import { formatDateTime, formatEnumLabel } from '../utils/formatters';

function adaptHistorico(apiHistory) {
  const projectId = apiHistory.idProjeto;

  return {
    id: apiHistory.idHistorico,
    registeredAt: apiHistory.dataRegistro,
    registeredAtLabel: formatDateTime(apiHistory.dataRegistro),
    status: apiHistory.situacao,
    statusLabel: formatEnumLabel(apiHistory.situacao),
    note: normalizeOptionalText(apiHistory.observacao),
    projectId,
    projectTitle: apiHistory.tituloProjeto ?? 'Projeto não informado',
    projectPath: projectId ? getProjectDetailPath(projectId) : null,
    volunteerId: apiHistory.idVoluntario,
    volunteerName: apiHistory.nomeVoluntario,
  };
}

export async function listarMeuHistorico() {
  const response = await api.get('/historico/me');
  const historyEntries = Array.isArray(response.data) ? response.data : [];

  return historyEntries.map(adaptHistorico);
}

function normalizeOptionalText(value) {
  const normalizedValue = String(value ?? '').trim();
  return normalizedValue || null;
}
