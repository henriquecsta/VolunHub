# Estrutura Sugerida de Pastas do VolunHub

## Estrutura geral
```text
VolunHub/
|-- .gitignore
|-- backend/
|   `-- src/
|-- frontend/
|   `-- src/
|-- docs/
|   |-- 01-visao-geral.md
|   |-- 02-escopo-funcional.md
|   |-- 03-requisitos-funcionais.md
|   |-- 04-requisitos-nao-funcionais.md
|   |-- 05-regras-negocio.md
|   |-- 06-arquitetura.md
|   |-- 07-estrutura-pastas.md
|   |-- 08-banco-dados.md
|   |-- 09-endpoints-rest.md
|   |-- 10-fluxo-jwt.md
|   |-- 11-fases-desenvolvimento.md
|   |-- 12-criterios-aceite.md
|   |-- 13-glossario.md
|   |-- 14-filtros-busca.md
|   `-- README.md
|-- scripts/
`-- README.md
```

## Backend
- `backend/src/` - codigo-fonte do Spring Boot.
- Sugestao de subpastas posteriores:
  - `backend/src/main/java/...` (aplicacao em camadas)
  - `backend/src/main/resources/` (configuracoes, application.properties)

## Frontend
- `frontend/src/` - codigo-fonte React.
- Sugestao de subpastas posteriores:
  - `frontend/src/components/`
  - `frontend/src/pages/`
  - `frontend/src/services/`
  - `frontend/src/styles/`

## Documentacao
- `docs/` - arquivos de documentacao tecnica.
- `docs/README.md` - indice central dos documentos.

## Scripts SQL
- `scripts/` - scripts SQL de criacao de banco e dados iniciais.
