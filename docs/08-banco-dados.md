# Modelo de Banco de Dados do VolunHub

## Tabelas principais

### Usuario
- id_usuario (PK)
- nome
- email
- senha
- perfil (ENUM: voluntario ou organizacao)
- telefone
- data_cadastro

### Categoria
- id_categoria (PK)
- nome
- descricao

### Projeto
- id_projeto (PK)
- titulo
- descricao
- cidade
- estado
- local
- tipo_participacao (ENUM: PRESENCIAL, REMOTO, HIBRIDO)
- data_inicio
- data_fim
- vagas
- status (ENUM: ATIVO, ENCERRADO, CANCELADO)
- id_organizacao (FK -> Usuario.id_usuario)
- id_categoria (FK -> Categoria.id_categoria)

### Inscricao
- id_inscricao (PK)
- data_inscricao
- status (ENUM: PENDENTE, APROVADA, RECUSADA, CANCELADA)
- id_voluntario (FK -> Usuario.id_usuario)
- id_projeto (FK -> Projeto.id_projeto)

### HistoricoParticipacao
- id_historico (PK)
- data_registro
- situacao
- observacao
- id_voluntario (FK -> Usuario.id_usuario)
- id_projeto (FK -> Projeto.id_projeto)

## Relacionamentos textuais
- Usuario (1) -> (N) Projeto
- Usuario (1) -> (N) Inscricao
- Projeto (1) -> (N) Inscricao
- Categoria (1) -> (N) Projeto
- Usuario (1) -> (N) HistoricoParticipacao
- Projeto (1) -> (N) HistoricoParticipacao

## Chaves e relacionamentos
- `Usuario.id_usuario` e PK da tabela `Usuario`.
- `Categoria.id_categoria` e PK da tabela `Categoria`.
- `Projeto.id_projeto` e PK da tabela `Projeto`.
- `Inscricao.id_inscricao` e PK da tabela `Inscricao`.
- `HistoricoParticipacao.id_historico` e PK da tabela `HistoricoParticipacao`.
- `Projeto.id_organizacao` referencia `Usuario.id_usuario` para organizacoes.
- `Projeto.id_categoria` referencia `Categoria.id_categoria`.
- `Inscricao.id_voluntario` referencia `Usuario.id_usuario` para voluntarios.
- `Inscricao.id_projeto` referencia `Projeto.id_projeto`.
- `HistoricoParticipacao.id_voluntario` referencia `Usuario.id_usuario`.
- `HistoricoParticipacao.id_projeto` referencia `Projeto.id_projeto`.

## ENUMs obrigatorios
- `StatusInscricao`: PENDENTE, APROVADA, RECUSADA, CANCELADA.
- `StatusProjeto`: ATIVO, ENCERRADO, CANCELADO.
- `TipoParticipacao`: PRESENCIAL, REMOTO, HIBRIDO.

## Observacoes
- O campo `perfil` em `Usuario` define se o usuario e `voluntario` ou `organizacao`.
- Categorias sao previamente cadastradas no banco e referenciadas pelos projetos.
- Projetos e inscricoes dependem do perfil correto do usuario.
- O historico registra a participacao em projetos e pode ser usado para relatorios e consultas futuras.
