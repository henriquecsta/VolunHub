# Validacao Final do Frontend

Data da validacao: 2026-05-16

## Ambiente
- Backend real iniciado em `http://localhost:8080`.
- Frontend Vite iniciado em `http://127.0.0.1:5173`.
- Banco MariaDB local em `localhost:3307`.

## Fluxos validados
- Cadastro de voluntario.
- Cadastro de organizacao.
- Login de voluntario e organizacao.
- Logout no frontend, por limpeza local de sessao.
- Listagem publica de projetos com filtros por termo, categoria, status e cidade.
- Detalhe de projeto.
- Inscricao em projeto.
- Dashboard do voluntario por `GET /inscricoes/me`.
- Historico de participacao por `GET /historico/me`.
- Dashboard da organizacao por `GET /inscricoes/projeto/{id}`.
- Criacao, edicao, exclusao e alteracao de status de projetos.
- Aprovacao e recusa de inscricoes.
- Navegacao SPA nas rotas principais.
- Preflight CORS entre Vite e backend.

## Resultado
- 16 fluxos executados.
- 16 fluxos aprovados.
- 0 falhas restantes.

## Problemas encontrados
- Preflight CORS retornava `403` para origem `http://localhost:5173`.
- Backend local com MariaDB 12 nao conseguia inferir o dialect automaticamente pelo Hibernate.
- Arquivos antigos com dados simulados e dashboards iniciais nao eram mais utilizados.

## Observacoes
- A validacao criou usuarios e projetos de teste com emails no dominio `volunhub.test`.
- O fluxo de logout nao possui endpoint no backend; ele foi validado como comportamento local do frontend.
