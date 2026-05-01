# Planejamento de Desenvolvimento do VolunHub

## Fase 1 - Configuracao inicial
- Inicializar repositorio Git.
- Criar `.gitignore`.
- Criar estrutura de pastas: `/backend/src`, `/frontend/src`, `/docs`, `/scripts`.
- Configurar repositorio remoto no GitHub.

## Fase 2 - Banco de dados e entidades
- Definir modelo de dados com tabelas e relacionamentos.
- Criar scripts SQL iniciais no `scripts/`.
- Definir entidades JPA para Spring Boot.

## Fase 3 - Autenticacao
- Implementar cadastro e login.
- Configurar JWT para backend.
- Proteger rotas privadas.

## Fase 4 - Categorias
- Disponibilizar endpoint para listar categorias previamente cadastradas.
- Implementar carga inicial e validacao de categorias para uso nos projetos.

## Fase 5 - CRUD de projetos
- Criar endpoints para cadastro, edicao, exclusao e consulta de projetos.
- Implementar filtros e busca por cidade, estado e tipo de participacao.

## Fase 6 - Inscricoes
- Implementar inscricao de voluntarios em projetos.
- Criar gestao de status de inscricoes para organizacoes.
- Listar inscricoes por voluntario e projeto.

## Fase 7 - Historico
- Registrar historico de participacao dos voluntarios.
- Exibir historico no perfil do voluntario.
- Permitir consulta de historico por projeto para organizacoes.

## Fase 8 - Frontend React
- Criar telas de login, cadastro, listagem de projetos e perfil.
- Implementar formularios de projeto e inscricao.
- Consumir API REST do backend.

## Fase 9 - Integracao frontend/backend
- Garantir comunicacao entre frontend e backend.
- Testar autenticacao e rotas protegidas.
- Validar filtros de busca e inscricoes.

## Fase 10 - Testes com Postman
- Criar colecao de testes para endpoints principais.
- Validar cenarios de cadastro, login, cadastro de projetos e inscricoes.

## Fase 11 - Ajustes finais
- Revisar documentacao.
- Ajustar comportamentos de UI e API.
- Corrigir bugs e finalizar entregaveis.
