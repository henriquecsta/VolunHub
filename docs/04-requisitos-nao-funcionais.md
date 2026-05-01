# Requisitos Nao Funcionais do VolunHub

## Seguranca
- Senhas devem ser armazenadas de forma criptografada usando hashing seguro.
- A autenticacao deve usar JWT para proteger rotas e verificar permissoes.
- Apenas usuarios autenticados podem acessar rotas privadas.
- Dados sensiveis nao devem ser expostos em respostas de API.

## Usabilidade
- A interface deve ser clara e intuitiva para voluntarios e organizacoes.
- O sistema deve permitir buscar projetos sem exigir login.
- Filtros devem ser faceis de usar e permitir limpeza rapida.

## Desempenho
- A API deve responder em tempo aceitavel para consultas de projetos e filtros.
- Consultas de busca devem usar parametros de query e filtros no banco de dados.
- A listagem de projetos deve suportar paginacao.
- O sistema deve limitar a quantidade de registros retornados por requisicao.
- A paginacao deve ser aplicada antes de enviar os dados ao frontend.
- O sistema deve evitar retornos duplicados.

## Organizacao de codigo
- Backend deve ser estruturado em camadas: controllers, services, repositories, entities e dtos.
- Frontend deve conter codigo organizado em `/frontend/src` com componentes reutilizaveis.
- O projeto deve ser documentado para facilitar evolucao posterior.

## Persistencia de dados
- O banco de dados deve ser MySQL.
- O esquema deve usar tabelas normalizadas e relacionamentos adequados.
- Categorias, projetos, usuarios, inscricoes e historico devem ser armazenados com chaves estrangeiras.
