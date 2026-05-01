# Requisitos Não Funcionais do VolunHub

## Segurança
- Senhas devem ser armazenadas de forma criptografada usando hashing seguro.
- A autenticação deve usar JWT para proteger rotas e verificar permissões.
- Apenas usuários autenticados podem acessar rotas privadas.
- Dados sensíveis não devem ser expostos em respostas de API.

## Usabilidade
- A interface deve ser clara e intuitiva para voluntários e organizações.
- O sistema deve permitir buscar projetos sem exigir login.
- Filtros devem ser fáceis de usar e permitir limpeza rápida.

## Desempenho
- A API deve responder em tempo aceitável para consultas de projetos e filtros.
- Consultas de busca devem usar parâmetros de query e filtros no banco de dados.
- O sistema deve evitar retornos duplicados e aplicar paginação futura, se necessário.

## Organização de código
- Backend deve ser estruturado em camadas: controllers, services, repositories, entities e dtos.
- Frontend deve conter código organizado em `/frontend/src` com componentes reutilizáveis.
- O projeto deve ser documentado para facilitar evolução posterior.

## Persistência de dados
- O banco de dados deve ser MySQL.
- O esquema deve usar tabelas normalizadas e relacionamentos adequados.
- Categorias, projetos, usuários, inscrições e histórico devem ser armazenados com chaves estrangeiras.
