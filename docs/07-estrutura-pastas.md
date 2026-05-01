# Estrutura Sugerida de Pastas do VolunHub

## Estrutura geral
```
Codex/
├── .gitignore
├── backend/
│   └── src/
├── frontend/
│   └── src/
├── docs/
│   ├── 01-visao-geral.md
│   ├── 02-escopo-funcional.md
│   ├── 03-requisitos-funcionais.md
│   ├── 04-requisitos-nao-funcionais.md
│   ├── 05-regras-negocio.md
│   ├── 06-arquitetura.md
│   ├── 07-estrutura-pastas.md
│   ├── 08-banco-dados.md
│   ├── 09-endpoints-rest.md
│   ├── 10-fluxo-jwt.md
│   ├── 11-fases-desenvolvimento.md
│   ├── 12-criterios-aceite.md
│   ├── 13-glossario.md
│   ├── 14-filtros-busca.md
│   └── README.md
├── scripts/
└── README.md
```

## Backend
- `backend/src/` - código-fonte do Spring Boot.
- Sugestão de subpastas posteriores:
  - `backend/src/main/java/...` (aplicação em camadas)
  - `backend/src/main/resources/` (configurações, application.properties)

## Frontend
- `frontend/src/` - código-fonte React.
- Sugestão de subpastas posteriores:
  - `frontend/src/components/`
  - `frontend/src/pages/`
  - `frontend/src/services/`
  - `frontend/src/styles/`

## Documentação
- `docs/` - arquivos de documentação técnica.
- `docs/README.md` - índice central dos documentos.

## Scripts SQL
- `scripts/` - scripts SQL de criação de banco e dados iniciais.
