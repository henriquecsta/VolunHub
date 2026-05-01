# Arquitetura Proposta do VolunHub

## Visão geral
O VolunHub será construído com arquitetura em camadas, separando responsabilidades entre frontend, backend e persistência de dados.

## Componentes principais
- Frontend React: interface do usuário em `/frontend/src`.
- Backend Spring Boot: serviço REST em `/backend/src`.
- Banco MySQL: persistência de dados.
- API REST: comunicação entre frontend e backend.
- Autenticação JWT: segurança e autorização de rotas.

## Camadas do backend
- Controllers: recebem requisições HTTP e encaminham para os serviços.
- Services: contêm regras de negócio e orquestram operações.
- Repositories: acessam o banco de dados via JPA.
- Entities/Models: representam as tabelas do banco de dados.
- DTOs: trafegam dados entre cliente e servidor sem expor entidades diretamente.

## Fluxo de requisição
1. Frontend faz requisição à API REST.
2. Controller recebe a requisição e valida parâmetros básicos.
3. Service aplica regras de negócio e invoca Repositories.
4. Repository consulta ou atualiza o banco MySQL.
5. Resultado retorna ao controller.
6. Controller envia resposta JSON ao frontend.

## Autenticação e autorização
- Usuários fazem login e recebem JWT.
- O token acompanha requisições em cabeçalho Authorization.
- Rotas protegidas validam o token e liberam acesso por perfil.

## Tecnologias obrigatórias
- Backend: Java + Spring Boot.
- Banco de dados: MySQL.
- Frontend: React, HTML, CSS e JavaScript.
- API: REST.
- Autenticação: JWT.
- Testes/validação: Postman.
- Versionamento: Git e GitHub.
