import api from './api';

function adaptCategoria(apiCategoria) {
  return {
    id: apiCategoria.idCategoria,
    name: apiCategoria.nome,
    description: apiCategoria.descricao,
  };
}

export async function listarCategorias() {
  const response = await api.get('/categorias');
  const categorias = Array.isArray(response.data) ? response.data : [];

  return categorias.map(adaptCategoria);
}
