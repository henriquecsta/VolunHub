# Fluxo de Autenticação JWT do VolunHub

## Cadastro
1. Usuário envia dados de cadastro para `POST /auth/signup`.
2. Backend valida os dados e cria registro de usuário.
3. Senha é armazenada com hashing seguro.
4. O usuário recebe confirmação de cadastro.

## Login
1. Usuário envia email e senha para `POST /auth/login`.
2. Backend valida credenciais.
3. Se válidas, o backend gera um JWT com informações mínimas.
4. O token é retornado ao cliente.

## Geração do token
- O JWT deve conter pelo menos `idUsuario`, `email` e `perfil`.
- O token deve ter prazo de validade definido.
- O token deve ser assinado com chave segura configurada no backend.

## Envio do token nas requisições
- O frontend deve enviar o token no cabeçalho `Authorization: Bearer <token>`.
- Todas as rotas protegidas devem verificar esse cabeçalho.

## Proteção das rotas
- Rotas públicas não exigem token.
- Rotas privadas exigem token válido.
- O backend deve rejeitar requisições sem token ou com token inválido.

## Permissões por perfil
- Voluntário:
  - Acessa `GET /inscricoes/me`, `POST /inscricoes`, `GET /historico/me`.
  - Acessa dados de perfil e próprias inscrições.
- Organização:
  - Acessa endpoints de projetos, inscrições do projeto e gestão de projetos.
  - Pode criar, editar e excluir projetos.
- O perfil definido no JWT deve ser usado para autorizar cada ação.
