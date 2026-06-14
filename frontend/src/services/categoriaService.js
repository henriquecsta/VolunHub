import api from './api';
import { formatCategoryName } from '../utils/formatters';

function adaptCategoria(apiCategoria) {
  return {
    id: apiCategoria.idCategoria,
    name: formatCategoryName(apiCategoria.nome),
    description: apiCategoria.descricao,
  };
}

export async function listarCategorias() {
  const response = await api.get('/categorias');
  const categorias = Array.isArray(response.data) ? response.data : [];

  return categorias.map(adaptCategoria);
}
