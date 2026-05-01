# Planejamento de Desenvolvimento do VolunHub

## Fase 1 - Configuração inicial
- Inicializar repositório Git.
- Criar `.gitignore`.
- Criar estrutura de pastas: `/backend/src`, `/frontend/src`, `/docs`, `/scripts`.
- Configurar repositório remoto no GitHub.

## Fase 2 - Banco de dados e entidades
- Definir modelo de dados com tabelas e relacionamentos.
- Criar scripts SQL iniciais no `scripts/`.
- Definir entidades JPA para Spring Boot.

## Fase 3 - Autenticação
- Implementar cadastro e login.
- Configurar JWT para backend.
- Proteger rotas privadas.

## Fase 4 - CRUD de categorias
- Criar endpoints para listar, criar, editar e excluir categorias.
- Implementar persistência e validação.

## Fase 5 - CRUD de projetos
- Criar endpoints para cadastro, edição, exclusão e consulta de projetos.
- Implementar filtros e busca básica.

## Fase 6 - Inscrições
- Implementar inscrição de voluntários em projetos.
- Criar gestão de status de inscrições para organizações.
- Listar inscrições por voluntário e projeto.

## Fase 7 - Histórico
- Registrar histórico de participação dos voluntários.
- Exibir histórico no perfil do voluntário.

## Fase 8 - Frontend React
- Criar telas de login, cadastro, listagem de projetos e perfil.
- Implementar formulários de projeto e inscrição.
- Consumir API REST do backend.

## Fase 9 - Integração frontend/backend
- Garantir comunicação entre frontend e backend.
- Testar autenticação e rotas protegidas.
- Validar filtros de busca e inscrições.

## Fase 10 - Testes com Postman
- Criar coleção de testes para endpoints principais.
- Validar cenários de cadastro, login, cadastro de projetos e inscrições.

## Fase 11 - Ajustes finais
- Revisar documentação.
- Ajustar comportamentos de UI e API.
- Corrigir bugs e finalizar entregáveis.
