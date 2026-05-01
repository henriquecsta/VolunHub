# Endpoints REST Planejados para o VolunHub

## Auth
- POST /auth/signup
  - Descrição: cadastrar novo usuário (voluntário ou organização).
  - Autorizado: público.
  - Corpo: `{ "nome", "email", "senha", "perfil", "telefone" }`

- POST /auth/login
  - Descrição: autenticar usuário e retornar JWT.
  - Autorizado: público.
  - Corpo: `{ "email", "senha" }`

## Usuários
- GET /usuarios/me
  - Descrição: obter dados do usuário autenticado.
  - Autorizado: voluntário ou organização.

- PUT /usuarios/me
  - Descrição: atualizar dados do usuário autenticado.
  - Autorizado: voluntário ou organização.
  - Corpo: `{ "nome", "telefone" }`

## Projetos
- GET /projetos
  - Descrição: listar projetos com filtros.
  - Autorizado: público.

- GET /projetos/{id}
  - Descrição: obter detalhes de um projeto.
  - Autorizado: público.

- POST /projetos
  - Descrição: cadastrar projeto.
  - Autorizado: organização.
  - Corpo: `{ "titulo", "descricao", "local", "dataInicio", "dataFim", "vagas", "status", "idCategoria" }`

- PUT /projetos/{id}
  - Descrição: atualizar projeto.
  - Autorizado: organização proprietária.
  - Corpo: campos do projeto.

- DELETE /projetos/{id}
  - Descrição: excluir projeto.
  - Autorizado: organização proprietária.

## Categorias
- GET /categorias
  - Descrição: listar categorias de projetos.
  - Autorizado: público.

- GET /categorias/{id}
  - Descrição: obter detalhes de categoria.
  - Autorizado: público.

- POST /categorias
  - Descrição: criar nova categoria.
  - Autorizado: organização ou administrador futuro.
  - Corpo: `{ "nome", "descricao" }`

- PUT /categorias/{id}
  - Descrição: atualizar categoria.
  - Autorizado: organização ou administrador futuro.

- DELETE /categorias/{id}
  - Descrição: excluir categoria.
  - Autorizado: organização ou administrador futuro.

## Inscrições
- POST /inscricoes
  - Descrição: voluntário se inscrever em projeto.
  - Autorizado: voluntário.
  - Corpo: `{ "idProjeto" }`

- GET /inscricoes/me
  - Descrição: listar inscrições do voluntário autenticado.
  - Autorizado: voluntário.

- GET /inscricoes/projeto/{idProjeto}
  - Descrição: listar inscrições de um projeto.
  - Autorizado: organização proprietária.

- PUT /inscricoes/{id}
  - Descrição: atualizar status da inscrição.
  - Autorizado: organização proprietária.
  - Corpo: `{ "status" }`

## Histórico
- GET /historico/me
  - Descrição: listar histórico de participação do voluntário.
  - Autorizado: voluntário.

- POST /historico
  - Descrição: registrar histórico de participação.
  - Autorizado: organização ou sistema.
  - Corpo: `{ "idVoluntario", "idProjeto", "situacao", "observacao" }`
