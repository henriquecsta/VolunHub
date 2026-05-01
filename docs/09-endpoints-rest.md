# Endpoints REST Planejados para o VolunHub

## Auth
- POST /auth/register
  - Descricao: cadastrar novo usuario (voluntario ou organizacao).
  - Autorizado: publico.
  - Corpo: `{ "nome", "email", "senha", "perfil", "telefone" }`

- POST /auth/login
  - Descricao: autenticar usuario e retornar JWT.
  - Autorizado: publico.
  - Corpo: `{ "email", "senha" }`

## Usuarios
- GET /usuarios/me
  - Descricao: obter dados do usuario autenticado.
  - Autorizado: voluntario ou organizacao.

- PUT /usuarios/me
  - Descricao: atualizar dados do usuario autenticado.
  - Autorizado: voluntario ou organizacao.
  - Corpo: `{ "nome", "telefone" }`

## Projetos
- GET /projetos?page=&size=&cidade=&estado=&tipoParticipacao=&categoria=&status=&dataInicio=&dataFim=&palavraChave=&ordenacao=
  - Descricao: listar projetos com filtros e paginacao.
  - Autorizado: publico.
  - Parametros:
    - `page`: numero da pagina, com inicio em `0`.
    - `size`: quantidade de registros por pagina.
    - `cidade`: filtro por cidade.
    - `estado`: filtro por estado.
    - `tipoParticipacao`: filtro por tipo de participacao.
    - `categoria`: filtro por categoria.
    - `status`: filtro por status do projeto.
    - `dataInicio`: filtro por data inicial.
    - `dataFim`: filtro por data final.
    - `palavraChave`: busca textual em campos do projeto.
    - `ordenacao`: criterio de ordenacao.

- GET /projetos/{id}
  - Descricao: obter detalhes de um projeto.
  - Autorizado: publico.

- POST /projetos
  - Descricao: cadastrar projeto.
  - Autorizado: organizacao.
  - Corpo: `{ "titulo", "descricao", "cidade", "estado", "local", "tipoParticipacao", "dataInicio", "dataFim", "vagas", "status", "idCategoria" }`

- PUT /projetos/{id}
  - Descricao: atualizar projeto.
  - Autorizado: organizacao proprietaria.
  - Corpo: campos do projeto.

- DELETE /projetos/{id}
  - Descricao: excluir projeto.
  - Autorizado: organizacao proprietaria.

## Categorias
- GET /categorias
  - Descricao: listar categorias de projetos.
  - Autorizado: publico.

- GET /categorias/{id}
  - Descricao: obter detalhes de categoria.
  - Autorizado: publico.

- Observacao: categorias sao previamente cadastradas no banco e apenas selecionadas pelas organizacoes ao criar ou editar projetos.

## Inscricoes
- POST /inscricoes
  - Descricao: voluntario se inscrever em projeto.
  - Autorizado: voluntario.
  - Corpo: `{ "idProjeto" }`

- GET /inscricoes/me
  - Descricao: listar inscricoes do voluntario autenticado.
  - Autorizado: voluntario.

- GET /inscricoes/projeto/{idProjeto}
  - Descricao: listar inscricoes de um projeto.
  - Autorizado: organizacao proprietaria.

- PUT /inscricoes/{id}
  - Descricao: atualizar status da inscricao.
  - Autorizado: organizacao proprietaria.
  - Corpo: `{ "status" }`

## Historico
- GET /historico/me
  - Descricao: listar historico de participacao do voluntario.
  - Autorizado: voluntario.

- GET /historico/projeto/{idProjeto}
  - Descricao: listar historico de participacao vinculado a um projeto.
  - Autorizado: organizacao proprietaria.

- POST /historico
  - Descricao: registrar historico de participacao.
  - Autorizado: organizacao ou sistema.
  - Corpo: `{ "idVoluntario", "idProjeto", "situacao", "observacao" }`
