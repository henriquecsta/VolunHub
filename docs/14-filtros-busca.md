# Planejamento de Filtros de Busca do VolunHub

## 6.1 Filtros obrigatorios
- Localizacao:
  - Cidade
  - Estado
- Tipo de participacao (PRESENCIAL, REMOTO, HIBRIDO)
- Categoria do projeto
- Status do projeto (ATIVO, ENCERRADO)
- Disponibilidade de vagas

## 6.2 Filtros recomendados
- Data de inicio
- Data de termino
- Projetos com inscricoes abertas
- Palavra-chave

## 6.3 Parametros de paginacao
- `page`
- `size`

## 6.4 Filtros avancados
- Busca por palavra-chave (titulo e descricao)
- Organizacao responsavel
- Ordenacao por:
  - Mais recentes
  - Mais antigos

## 6.5 Comportamento dos filtros
- Permitir multiplos filtros simultaneos.
- Permitir limpar filtros facilmente.
- Atualizar resultados dinamicamente.
- Funcionar para usuarios logados e nao logados.
- Aplicar paginacao na listagem de projetos.
- Limitar a quantidade de registros retornados por requisicao.
- Aplicar a paginacao antes de enviar os dados ao frontend.

## 6.6 Impacto tecnico
- Implementar filtros usando query parameters na API REST.
- Aplicar filtros no banco com `WHERE`, `LIKE`, `BETWEEN` e conditions adicionais.
- Usar indices nas colunas de busca mais comuns para melhorar performance.
- Evitar consultas complexas e priorizar clareza do codigo.

## 6.7 Padrao de endpoint
- `GET /projetos?page=&size=&cidade=&estado=&tipoParticipacao=&categoria=&status=&dataInicio=&dataFim=&palavraChave=&ordenacao=`

## 6.8 Regras de negocio
- Apenas projetos ATIVOS devem aparecer por padrao.
- Projetos sem vagas podem ser exibidos com indicacao de vagas esgotadas.
- Nao permitir duplicidade nos resultados.
- Filtros opcionais nao devem quebrar a busca; devem ser ignorados se nao fornecidos.

## 6.9 Diretriz tecnica
- Manter implementacao simples com Spring Boot e JPA.
- Evitar geolocalizacao avancada nesta fase.
- Priorizar clareza, consistencia e usabilidade.
