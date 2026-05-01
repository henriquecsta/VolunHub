# Planejamento de Filtros de Busca do VolunHub

## 6.1 Filtros obrigatórios
- Localização:
  - Cidade
  - Estado
- Categoria do projeto
- Status do projeto (ATIVO, ENCERRADO)
- Disponibilidade de vagas

## 6.2 Filtros recomendados
- Data de início
- Data de término
- Projetos com inscrições abertas
- Tipo de participação (presencial ou remoto, se aplicável)

## 6.3 Filtros avançados
- Busca por palavra-chave (título e descrição)
- Organização responsável
- Ordenação por:
  - Mais recentes
  - Mais antigos

## 6.4 Comportamento dos filtros
- Permitir múltiplos filtros simultâneos.
- Permitir limpar filtros facilmente.
- Atualizar resultados dinamicamente.
- Funcionar para usuários logados e não logados.

## 6.5 Impacto técnico
- Implementar filtros usando query parameters na API REST.
- Aplicar filtros no banco com `WHERE`, `LIKE`, `BETWEEN` e conditions adicionais.
- Usar índices nas colunas de busca mais comuns para melhorar performance.
- Evitar consultas complexas e priorizar clareza do código.

## 6.6 Padrão de endpoint
- `GET /projetos?cidade=&estado=&categoria=&status=&dataInicio=&dataFim=&palavraChave=&ordenacao=`

## 6.7 Regras de negócio
- Apenas projetos ATIVOS devem aparecer por padrão.
- Projetos sem vagas podem ser exibidos com indicação de vagas esgotadas.
- Não permitir duplicidade nos resultados.
- Filtros opcionais não devem quebrar a busca; devem ser ignorados se não fornecidos.

## 6.8 Diretriz técnica
- Manter implementação simples com Spring Boot e JPA.
- Evitar geolocalização avançada nesta fase.
- Priorizar clareza, consistência e usabilidade.
