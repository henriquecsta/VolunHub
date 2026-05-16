# Resumo da Entrega Final do VolunHub

## Objetivo do sistema
O VolunHub e uma aplicacao web desenvolvida para aproximar voluntarios e organizacoes sociais. O sistema permite a publicacao de projetos, a busca por oportunidades de voluntariado, a inscricao de interessados e o acompanhamento de inscricoes e historico de participacao.

## Problema resolvido
O projeto atua sobre a dificuldade de conectar pessoas interessadas em trabalho voluntario a organizacoes que precisam divulgar oportunidades. Antes de uma plataforma centralizada, esse processo tende a depender de comunicacao dispersa, baixa visibilidade dos projetos e acompanhamento manual das inscricoes. O VolunHub organiza esse fluxo em um ambiente unico, com perfis distintos, regras de acesso e registro das principais etapas.

## Publico-alvo
- Voluntarios que desejam encontrar oportunidades de atuacao social.
- Organizacoes sociais que precisam divulgar projetos e gerenciar inscricoes.
- Coordenadores e gestores que acompanham a participacao de voluntarios em projetos.

## Tecnologias utilizadas
- Backend: Java com Spring Boot.
- Frontend: React, Vite e Tailwind CSS.
- Banco de dados: MySQL/MariaDB.
- Comunicacao: API REST com dados em JSON.
- Autenticacao: JWT com controle de acesso por perfil.
- Persistencia: Spring Data JPA e Hibernate.
- Cliente HTTP: Axios.
- Rotas frontend: React Router.
- Gerenciamento de estado de autenticacao: Context API.
- Versionamento: Git e GitHub.

## Principais funcionalidades
- Cadastro de usuarios com perfil de voluntario ou organizacao.
- Login, logout e protecao de rotas por perfil.
- Listagem publica de projetos, com filtros reais integrados ao backend.
- Detalhamento publico de projetos.
- Inscricao de voluntarios em projetos ativos.
- Dashboard do voluntario com inscricoes e respectivos status.
- Historico de participacao do voluntario.
- Dashboard da organizacao com projetos publicados e inscricoes recebidas.
- Criacao, edicao, exclusao e alteracao de status de projetos.
- Aprovacao e recusa de inscricoes por organizacoes.
- Consulta de categorias previamente cadastradas.

## Fluxos do voluntario
O voluntario pode se cadastrar, autenticar-se, consultar projetos publicos, aplicar filtros por termo, categoria, status e localidade, visualizar detalhes de um projeto e realizar inscricao. Apos autenticado, pode acompanhar suas inscricoes no dashboard e consultar seu historico de participacao.

## Fluxos da organizacao
A organizacao pode se cadastrar, autenticar-se, criar projetos, editar seus proprios projetos, alterar status, excluir registros quando permitido e acompanhar inscricoes recebidas. Tambem pode aprovar ou recusar inscricoes vinculadas aos seus projetos e registrar historico de participacao.

## Autenticacao e seguranca
O backend utiliza JWT para autenticar usuarios e liberar acesso conforme o perfil. Rotas publicas, como listagem e detalhe de projetos, permanecem acessiveis sem login. Rotas de voluntario exigem perfil `VOLUNTARIO`, enquanto rotas de gerenciamento de projetos, inscricoes e historico por projeto exigem perfil `ORGANIZACAO`. O frontend armazena a sessao, envia o token pelo cabecalho `Authorization` e redireciona usuarios sem permissao adequada.

## Integracao frontend/backend
A integracao ocorre por meio de services no frontend, construidos sobre Axios, que consomem endpoints REST do backend. O frontend separa paginas, componentes, services, constantes e utilitarios. O backend organiza controllers, services, repositories, DTOs e entities. Essa divisao reduz acoplamento e facilita a manutencao dos fluxos principais.

Endpoints principais utilizados:
- `POST /auth/register`
- `POST /auth/login`
- `GET /categorias`
- `GET /projetos`
- `GET /projetos/{id}`
- `POST /projetos`
- `PUT /projetos/{id}`
- `DELETE /projetos/{id}`
- `POST /inscricoes`
- `GET /inscricoes/me`
- `GET /inscricoes/projeto/{idProjeto}`
- `PUT /inscricoes/{id}`
- `GET /historico/me`
- `POST /historico`

## Validacao final realizada
A validacao final foi executada com backend real, frontend Vite e banco MariaDB local. Foram testados cadastro de voluntario, cadastro de organizacao, login, logout, listagem publica com filtros, detalhe de projeto, inscricao, dashboards, historico de participacao, criacao e gerenciamento de projetos, aprovacao e recusa de inscricoes, navegacao SPA e CORS entre frontend e backend.

Resultado registrado:
- 16 fluxos executados.
- 16 fluxos aprovados.
- 0 falhas restantes.

Durante a validacao, foram corrigidas inconsistencias de CORS e configuracao de dialect do Hibernate com MariaDB. Tambem foram removidos arquivos antigos sem uso.

## Limitacoes conhecidas
- O logout e realizado no frontend por limpeza local da sessao, sem endpoint especifico de invalidacao de token.
- O sistema nao implementa recuperacao de senha.
- Nao ha upload de imagens ou documentos para projetos.
- O historico de participacao depende de registro pela organizacao.
- A validacao automatizada foi feita por build e chamadas integradas; nao ha uma suite automatizada completa de testes unitarios ou end-to-end.
- A configuracao CORS esta voltada aos ambientes locais de desenvolvimento e preview.

## Possiveis melhorias futuras
- Criar suite automatizada de testes no backend e no frontend.
- Implementar recuperacao de senha.
- Adicionar perfil administrativo.
- Permitir upload de imagens para projetos e organizacoes.
- Criar notificacoes para mudancas de status de inscricao.
- Melhorar a consulta do historico com filtros e exportacao.
- Adicionar pagina de perfil do usuario.
- Parametrizar origens CORS por variavel de ambiente.
- Implementar observabilidade basica, como logs estruturados e metricas.

## Avaliacao de prontidao
O VolunHub apresenta os principais fluxos funcionais previstos para a entrega academica. A aplicacao possui separacao entre frontend, backend e banco de dados, utiliza API REST, autentica usuarios por JWT e aplica regras de acesso por perfil. A validacao final indica que o projeto esta apto para apresentacao, com pendencias concentradas em melhorias evolutivas e nao em bloqueios funcionais.
