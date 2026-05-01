# Fluxo de Autenticacao JWT do VolunHub

## Cadastro
1. Usuario envia dados de cadastro para `POST /auth/register`.
2. Backend valida os dados e cria registro de usuario.
3. Senha e armazenada com hashing seguro.
4. O usuario recebe confirmacao de cadastro.

## Login
1. Usuario envia email e senha para `POST /auth/login`.
2. Backend valida credenciais.
3. Se validas, o backend gera um JWT com informacoes minimas.
4. O token e retornado ao cliente.

## Geracao do token
- O JWT deve conter pelo menos `idUsuario`, `email` e `perfil`.
- O token deve ter prazo de validade definido.
- O token deve ser assinado com chave segura configurada no backend.

## Envio do token nas requisicoes
- O frontend deve enviar o token no cabecalho `Authorization: Bearer <token>`.
- Todas as rotas protegidas devem verificar esse cabecalho.

## Protecao das rotas
- Rotas publicas nao exigem token.
- Rotas privadas exigem token valido.
- O backend deve rejeitar requisicoes sem token ou com token invalido.

## Permissoes por perfil
- Voluntario:
  - Acessa `GET /inscricoes/me`, `POST /inscricoes`, `GET /historico/me`.
  - Acessa dados de perfil e proprias inscricoes.
- Organizacao:
  - Acessa endpoints de projetos, inscricoes do projeto e historico do projeto.
  - Pode criar, editar e excluir projetos.
- O perfil definido no JWT deve ser usado para autorizar cada acao.
