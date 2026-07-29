# API de Alunos com Administrador, PostgreSQL e JWT

Este projeto é uma API didática construída com Node.js e Express. Ela possui dois módulos:

- **administrador:** realiza o cadastro inicial, faz login e recebe um token JWT;
- **aluno:** oferece um CRUD completo protegido pelo token do administrador.

O objetivo é ensinar, de maneira prática, como uma API recebe requisições, acessa um banco PostgreSQL, protege senhas com bcrypt e controla o acesso às rotas usando JSON Web Token (JWT).

## O que a API faz

O administrador pode:

- realizar o primeiro cadastro;
- entrar com e-mail e senha;
- receber um token JWT;
- consultar o próprio perfil;
- cadastrar alunos;
- listar alunos;
- buscar um aluno pela matrícula;
- editar alunos;
- excluir um aluno;
- excluir todos os alunos.

O aluno não realiza login. Ele é um registro administrado pelo usuário autenticado.

## Tecnologias utilizadas

| Tecnologia | Responsabilidade |
| --- | --- |
| Node.js | Executa o JavaScript no servidor |
| Express | Cria o servidor, middlewares e rotas HTTP |
| PostgreSQL | Armazena administradores e alunos |
| `pg` | Faz a comunicação entre Node.js e PostgreSQL |
| `dotenv` | Carrega as variáveis do arquivo `.env` |
| `bcryptjs` | Cria e compara hashes de senha |
| `jsonwebtoken` | Gera e valida tokens JWT |

## Conceitos usados no projeto

### API

Uma API permite que aplicações conversem por meio de requisições e respostas.

Exemplo:

```text
Cliente
   |
   | GET /aluno/listar
   | Authorization: Bearer TOKEN
   v
API
   |
   | consulta o PostgreSQL
   v
Resposta JSON
```

### CRUD

CRUD representa as quatro operações básicas feitas com dados:

| Letra | Operação | Método HTTP usado |
| --- | --- | --- |
| C | Create, criar | `POST` |
| R | Read, consultar | `GET` |
| U | Update, atualizar | `PUT` ou `PATCH` |
| D | Delete, excluir | `DELETE` |

### Autenticação

Autenticar significa confirmar quem está tentando acessar o sistema.

Neste projeto, o administrador informa e-mail e senha. Se os dados estiverem corretos, a API gera um JWT. Nas próximas requisições, o cliente apresenta esse token para provar que já realizou login.

### Autorização

Autorização é a decisão de permitir ou negar o acesso a uma rota.

O middleware é responsável por essa decisão. Sem um token válido, o CRUD de alunos não é executado.

## Estrutura do projeto

```text
aluno/
├── docs/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── autenticacao.middleware.js
│   ├── modules/
│   │   ├── administrador/
│   │   │   ├── controllers/
│   │   │   │   └── administrador.controller.js
│   │   │   ├── models/
│   │   │   │   └── administrador.model.js
│   │   │   └── routes/
│   │   │       └── administrador.route.js
│   │   └── aluno/
│   │       ├── controllers/
│   │       │   └── aluno.controller.js
│   │       ├── models/
│   │       │   └── aluno.model.js
│   │       └── routes/
│   │           └── aluno.route.js
│   ├── utils/
│   │   └── utils.js
│   └── index.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## Separação em camadas

### Routes

As rotas definem:

- o método HTTP;
- o endereço;
- os middlewares executados;
- o controller chamado.

Exemplo:

```js
router.get(
    "/perfil",
    AutenticacaoMiddleware.autenticar,
    AdministradorController.perfil
);
```

A execução acontece da esquerda para a direita:

```text
GET /admin/perfil
        |
        v
AutenticacaoMiddleware.autenticar
        |
        | token válido: chama proximo()
        v
AdministradorController.perfil
```

Se o middleware responder com erro, o controller não será executado.

### Controllers

Os controllers trabalham com a requisição e a resposta HTTP. Eles:

- recebem dados do cliente;
- validam campos;
- chamam os models;
- escolhem o status HTTP;
- enviam a resposta em JSON.

### Models

Os models executam comandos SQL. Eles não precisam conhecer detalhes de HTTP, como status `200`, `400` ou `500`.

### Middleware

O middleware é uma etapa intermediária. Neste projeto, ele verifica se o token JWT existe e é válido antes de liberar uma rota privada.

## Instalação

É necessário ter:

- Node.js instalado;
- PostgreSQL instalado e em execução;
- um banco de dados criado.

Abra o terminal na pasta do projeto:

```powershell
cd C:\Users\i3831\Desktop\aluno
```

Instale as dependências:

```powershell
npm install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz usando `.env.example` como referência:

```env
PORTA=3000
PGUSER=postgres
PGPASSWORD=sua_senha
PGHOST=localhost
PGPORT=5432
PGDATABASE=nome_do_banco
JWT_SECRET=uma_chave_longa_e_dificil_de_descobrir
JWT_TEMPO_EXPIRACAO=1h
```

### Explicação das variáveis

| Variável | Explicação |
| --- | --- |
| `PORTA` | Porta usada pelo servidor Express |
| `PGUSER` | Usuário do PostgreSQL |
| `PGPASSWORD` | Senha do PostgreSQL |
| `PGHOST` | Endereço do banco |
| `PGPORT` | Porta do PostgreSQL |
| `PGDATABASE` | Nome do banco |
| `JWT_SECRET` | Segredo usado para assinar e verificar tokens |
| `JWT_TEMPO_EXPIRACAO` | Tempo de validade do token, como `30m`, `1h` ou `7d` |

O arquivo `.env` contém segredos e não deve ser enviado ao Git. O `.env.example` mostra apenas quais configurações são necessárias.

## Estrutura do banco de dados

As consultas do projeto esperam duas tabelas: `admins` e `aluno`.

```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aluno (
    matricula INTEGER PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);
```

No banco atual, `matricula` é um número inteiro. Portanto, use valores como `2026001`. Para aceitar matrículas com letras, seria necessário alterar a coluna para `VARCHAR`.

## Como iniciar a aplicação

Execute:

```powershell
npm start
```

O script configurado no `package.json` é:

```json
"start": "node --watch src/index.js"
```

O parâmetro `--watch` reinicia o servidor quando um arquivo JavaScript é alterado.

Se tudo estiver correto, o terminal deverá informar que a conexão com o banco foi realizada e que o servidor está em execução.

Teste a rota inicial:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/"
```

## Como o `index.js` organiza a aplicação

O arquivo `src/index.js`:

1. importa o Express e o dotenv;
2. importa as rotas;
3. carrega o `.env`;
4. cria a aplicação;
5. habilita leitura de JSON;
6. adiciona os prefixos `/aluno` e `/admin`;
7. inicia o servidor.

O comando:

```js
app.use(express.json());
```

permite que o Express transforme um corpo JSON em um objeto disponível em:

```js
requisicao.body
```

Os prefixos são registrados assim:

```js
app.use("/aluno", router);
app.use("/admin", routerAdmin);
```

Uma rota `"/login"` dentro do roteador administrativo se torna:

```text
/admin/login
```

## Conexão com PostgreSQL

O arquivo `src/config/database.js` cria uma `Pool`:

```js
const conexao = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGDATABASE
});
```

A pool administra conexões reutilizáveis. Os models executam consultas com:

```js
const resultado = await conexao.query(query, dados);
```

As consultas usam parâmetros:

```sql
WHERE email = $1
```

e os valores são enviados separadamente:

```js
const dados = [email];
```

Isso evita montar SQL concatenando diretamente informações recebidas do cliente e ajuda a prevenir SQL Injection.

## Cadastro do administrador

### Rota

```text
POST /admin/cadastrar
```

### Corpo

```json
{
  "nome": "Administrador",
  "email": "admin@email.com",
  "senha": "Senha@123"
}
```

O `id` não é enviado porque o PostgreSQL o gera automaticamente.

### Etapas do cadastro

```text
Cliente envia nome, e-mail e senha
              |
              v
Controller verifica campos obrigatórios
              |
              v
Model conta quantos administradores existem
              |
              v
Controller valida senha e e-mail
              |
              v
bcrypt gera o hash
              |
              v
Model salva o administrador no PostgreSQL
              |
              v
API responde sem retornar o hash da senha
```

O sistema aceita somente o primeiro administrador:

```js
const totalAdmin = await AdministradorModel.contarAdmins();

if (totalAdmin > 0) {
    return resposta.status(409).json({
        mensagem: "Administrador ja cadastrado!"
    });
}
```

O PostgreSQL devolve `COUNT(*)` como texto. Por isso o model converte especificamente o campo `count`:

```js
return Number(resultado.rows[0].count);
```

### Validação da senha

A senha precisa:

- ter entre 8 e 32 caracteres;
- ter letra maiúscula;
- ter letra minúscula;
- ter número;
- ter caractere especial.

### Hash da senha

A senha não é salva diretamente:

```js
const hashSenha = await bcrypt.hash(senha, 10);
```

O número `10` é o custo utilizado pelo bcrypt. O banco recebe `hashSenha`, e não a senha original:

```js
await AdministradorModel.cadastrar(nome, email, hashSenha);
```

Hash não é criptografia reversível. A aplicação não precisa descobrir a senha original; ela compara a tentativa de login com o hash armazenado.

### Dados retornados

O SQL usa:

```sql
RETURNING id, nome, email, ativo, criado_em
```

O campo `senha` é intencionalmente omitido para não expor o hash na resposta.

## Login do administrador

### Rota

```text
POST /admin/login
```

### Corpo

```json
{
  "email": "admin@email.com",
  "senha": "Senha@123"
}
```

### Etapas do login

```text
Cliente envia e-mail e senha
              |
              v
Controller procura o administrador pelo e-mail
              |
              v
Verifica se o administrador está ativo
              |
              v
bcrypt compara senha enviada e hash armazenado
              |
              v
jsonwebtoken assina um JWT
              |
              v
API devolve o token
```

### Comparação da senha

```js
const senhaCorreta = await bcrypt.compare(
    senha,
    administrador.senha
);
```

O resultado é booleano:

- `true`: a senha corresponde;
- `false`: a senha não corresponde.

### Geração do JWT

```js
const token = jwt.sign(
    {
        id: administrador.id,
        nome: administrador.nome,
        email: administrador.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_TEMPO_EXPIRACAO || "1h"
    }
);
```

Os dados `id`, `nome` e `email` formam o payload.

A senha nunca deve entrar no JWT. Um token é assinado para impedir alterações, mas seu payload pode ser lido pelo cliente.

O `JWT_SECRET` assina o token. Mais tarde, o mesmo segredo é usado para verificar se o token realmente foi gerado pela API.

### Resposta de login

```json
{
  "mensagem": "Usuario autenticado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Entendendo o JWT

Um JWT normalmente possui três partes separadas por ponto:

```text
HEADER.PAYLOAD.SIGNATURE
```

### Header

Informa o tipo do token e o algoritmo usado.

### Payload

Contém os dados adicionados no `jwt.sign`, além de campos como:

- `iat`: instante em que o token foi criado;
- `exp`: instante em que o token expira.

### Signature

Permite verificar se o conteúdo foi alterado e se o token foi assinado com o segredo correto.

JWT não significa que os dados estejam escondidos. Por isso, senha e outros segredos nunca devem ser colocados no payload.

## Middleware de autenticação

O arquivo `src/middleware/autenticacao.middleware.js` protege as rotas privadas.

Sua assinatura é:

```js
static autenticar(requisicao, resposta, proximo)
```

### Parâmetros

| Parâmetro | Função |
| --- | --- |
| `requisicao` | Contém cabeçalhos, body, parâmetros e outros dados recebidos |
| `resposta` | Permite devolver status e JSON |
| `proximo` | Função do Express que libera a próxima etapa |

### Leitura do cabeçalho

O cliente envia:

```http
Authorization: Bearer TOKEN
```

O middleware lê:

```js
const autorizacao = requisicao.headers.authorization;
```

Se o cabeçalho não existir, responde `401`:

```js
if (!autorizacao) {
    return resposta.status(401).json({
        mensagem: "Token de autenticacao nao fornecido!"
    });
}
```

### Extração do token

O cabeçalho é uma string semelhante a:

```text
Bearer eyJhbGciOiJIUzI1Ni...
```

Ao dividir pelo espaço:

```js
const token = autorizacao.split(" ")[1];
```

temos:

```text
posição 0: Bearer
posição 1: eyJhbGciOiJIUzI1Ni...
```

### Verificação com callback

O middleware usa a forma com callback:

```js
jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
        return resposta.status(403).json({
            mensagem: "Acesso nao autorizado!"
        });
    }

    requisicao.usuario = usuario;
    requisicao.administrador = usuario;

    return proximo();
});
```

O callback recebe:

- `erro`: recebe o erro se o token for inválido ou estiver expirado;
- `usuario`: recebe o payload decodificado quando o token é válido.

É importante não confundir `usuario` com `proximo`.

`proximo` pertence ao Express e é recebido aqui:

```js
static autenticar(requisicao, resposta, proximo)
```

Já o segundo parâmetro do callback do `jwt.verify` é o payload:

```js
(erro, usuario)
```

Quando o token é válido, o payload é anexado à requisição:

```js
requisicao.administrador = usuario;
```

Depois:

```js
return proximo();
```

libera o controller.

### Por que isto estaria errado?

```js
const dadosToken = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (erro, proximo)
);
```

Com callback, `jwt.verify` não entrega o payload pela variável `dadosToken`. Além disso, o segundo parâmetro do callback é o payload decodificado, e não a função `proximo` do Express.

## Perfil do administrador

### Rota

```text
GET /admin/perfil
```

Essa rota é privada:

```js
routerAdmin.get(
    "/perfil",
    AutenticacaoMiddleware.autenticar,
    AdministradorController.perfil
);
```

O controller recebe o ID que veio do token validado:

```js
const idDoToken = requisicao.administrador.id;
```

Depois consulta o banco:

```js
const administrador =
    await AdministradorModel.buscarPerfilPorId(idDoToken);
```

O perfil não recebe e-mail ou ID na URL. A identidade é retirada do próprio token.

A consulta também não seleciona a senha:

```sql
SELECT id, nome, email, ativo, criado_em
FROM admins
WHERE id = $1
```

## Rotas disponíveis

### Rotas públicas

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Verifica se a API está funcionando |
| `POST` | `/admin/cadastrar` | Cadastra o primeiro administrador |
| `POST` | `/admin/login` | Autentica e gera o JWT |

### Rotas privadas

Todas exigem:

```http
Authorization: Bearer TOKEN
```

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/admin/perfil` | Retorna o perfil autenticado |
| `GET` | `/aluno/listar` | Lista todos os alunos |
| `GET` | `/aluno/listar/:matricula` | Busca pela matrícula |
| `POST` | `/aluno/cadastrar` | Cadastra um aluno |
| `PUT` | `/aluno/editar/total/:matricula` | Atualiza nome e e-mail |
| `PATCH` | `/aluno/editar/parcial/:matricula` | Atualiza um ou mais campos |
| `DELETE` | `/aluno/excluir/todos` | Exclui todos os alunos |
| `DELETE` | `/aluno/excluir/:matricula` | Exclui um aluno |

## CRUD de alunos

### Cadastrar

```text
POST /aluno/cadastrar
```

```json
{
  "matricula": 2026001,
  "nome": "Maria Silva",
  "email": "maria@email.com"
}
```

Todos os campos são obrigatórios.

### Listar todos

```text
GET /aluno/listar
```

Se existirem registros, a API retorna um array. Se não existirem, retorna a mensagem `"Nenhum aluno cadastrado!"`.

### Buscar pela matrícula

```text
GET /aluno/listar/2026001
```

`2026001` fica disponível em:

```js
requisicao.params.matricula
```

### Edição total com PUT

```text
PUT /aluno/editar/total/2026001
```

```json
{
  "nome": "Maria Souza",
  "email": "maria.souza@email.com"
}
```

PUT exige nome e e-mail.

### Edição parcial com PATCH

```text
PATCH /aluno/editar/parcial/2026001
```

```json
{
  "nome": "Maria Oliveira"
}
```

PATCH permite enviar nome, e-mail ou ambos. É necessário enviar pelo menos um deles.

No SQL, `COALESCE` mantém o valor anterior quando o novo valor é `null`:

```sql
UPDATE aluno
SET nome = COALESCE($2, nome),
    email = COALESCE($3, email)
WHERE matricula = $1
RETURNING *
```

### Excluir um aluno

```text
DELETE /aluno/excluir/2026001
```

### Excluir todos

```text
DELETE /aluno/excluir/todos
```

Essa operação remove todos os registros da tabela `aluno`.

## Teste completo com PowerShell

### 1. Cadastrar o primeiro administrador

```powershell
$admin = @{
    nome = "Administrador"
    email = "admin@email.com"
    senha = "Senha@123"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:3000/admin/cadastrar" `
    -ContentType "application/json" `
    -Body $admin
```

O sistema permite somente um administrador. Se ele já existir, essa etapa retorna `409`.

### 2. Fazer login

```powershell
$login = @{
    email = "admin@email.com"
    senha = "Senha@123"
} | ConvertTo-Json

$respostaLogin = Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:3000/admin/login" `
    -ContentType "application/json" `
    -Body $login
```

### 3. Guardar o token

```powershell
$token = $respostaLogin.token
```

### 4. Montar o cabeçalho

```powershell
$cabecalhos = @{
    Authorization = "Bearer $token"
}
```

### 5. Consultar o perfil

```powershell
Invoke-RestMethod `
    -Method Get `
    -Uri "http://localhost:3000/admin/perfil" `
    -Headers $cabecalhos
```

### 6. Cadastrar um aluno

```powershell
$aluno = @{
    matricula = 2026001
    nome = "Maria Silva"
    email = "maria@email.com"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:3000/aluno/cadastrar" `
    -Headers $cabecalhos `
    -ContentType "application/json" `
    -Body $aluno
```

### 7. Listar alunos

```powershell
Invoke-RestMethod `
    -Method Get `
    -Uri "http://localhost:3000/aluno/listar" `
    -Headers $cabecalhos
```

### 8. Editar parcialmente

```powershell
$alteracao = @{
    nome = "Maria Oliveira"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Patch `
    -Uri "http://localhost:3000/aluno/editar/parcial/2026001" `
    -Headers $cabecalhos `
    -ContentType "application/json" `
    -Body $alteracao
```

### 9. Excluir

```powershell
Invoke-RestMethod `
    -Method Delete `
    -Uri "http://localhost:3000/aluno/excluir/2026001" `
    -Headers $cabecalhos
```

## Teste no Postman, Insomnia ou Thunder Client

### Cadastro e login

1. Escolha o método `POST`.
2. Informe `/admin/cadastrar` ou `/admin/login`.
3. Abra `Body`.
4. Escolha `raw` e `JSON`.
5. Envie os campos necessários.

### Rotas privadas

Depois do login:

1. copie o token da resposta;
2. abra a área `Authorization`;
3. escolha `Bearer Token`;
4. cole somente o token no campo indicado;
5. envie a requisição.

Também é possível criar manualmente o header:

| Chave | Valor |
| --- | --- |
| `Authorization` | `Bearer SEU_TOKEN` |

## Status HTTP usados

| Status | Significado no projeto |
| --- | --- |
| `200 OK` | Consulta, edição, exclusão ou login concluído |
| `201 Created` | Administrador ou aluno criado |
| `400 Bad Request` | Campos obrigatórios ou formato inválido |
| `401 Unauthorized` | Login incorreto ou token não fornecido |
| `403 Forbidden` | Administrador inativo ou token rejeitado |
| `404 Not Found` | Administrador ou aluno não encontrado |
| `409 Conflict` | Já existe um administrador |
| `500 Internal Server Error` | Erro inesperado ou erro de banco |

## Objetos importantes do Express

### `requisicao.body`

Contém o JSON enviado pelo cliente:

```js
const { nome, email, senha } = requisicao.body;
```

### `requisicao.params`

Contém parâmetros da URL:

```text
/aluno/listar/:matricula
```

```js
const { matricula } = requisicao.params;
```

### `requisicao.headers`

Contém os cabeçalhos:

```js
const autorizacao = requisicao.headers.authorization;
```

### `resposta.status().json()`

Define o status e envia JSON:

```js
return resposta.status(404).json({
    mensagem: "Aluno nao encontrado!"
});
```

### `proximo()`

Libera a próxima função registrada na rota. É usado pelo middleware depois da autenticação.

## `async` e `await`

As consultas ao banco e as funções do bcrypt são assíncronas:

```js
const administrador =
    await AdministradorModel.buscarPorEmail(email);
```

`await` espera o resultado antes de continuar. Para utilizá-lo, a função precisa ser declarada com `async`.

## `try/catch`

Os controllers usam:

```js
try {
    // operação principal
} catch (error) {
    return resposta.status(500).json({
        mensagem: "Erro interno!",
        erro: error.message
    });
}
```

Se uma operação com o banco, bcrypt ou JWT falhar, o `catch` evita que a requisição fique sem resposta.

## Por que usar `return` nas respostas?

Exemplo:

```js
if (!email || !senha) {
    return resposta.status(400).json({
        mensagem: "Forneca o e-mail e a senha para login!"
    });
}
```

O `return` envia a resposta e encerra a função. Sem ele, o código poderia continuar e tentar enviar uma segunda resposta.

## Comportamento dos dados recebidos

O projeto utiliza `nome` e `email` exatamente como foram enviados pelo cliente. Não é feita normalização automática com `trim()` ou `toLowerCase()`.

Isso significa que:

```text
admin@email.com
Admin@email.com
```

podem ser tratados como valores diferentes dependendo das regras do PostgreSQL. O cliente deve enviar no login o mesmo e-mail utilizado no cadastro.

## Segurança aplicada

- senha armazenada como hash bcrypt;
- consultas SQL parametrizadas;
- JWT com tempo de expiração;
- CRUD de alunos protegido por middleware;
- perfil identificado pelo token;
- hash da senha removido das respostas de cadastro e perfil;
- mensagem genérica para e-mail ou senha incorretos.

## Limitações atuais

- o sistema permite somente um administrador;
- não existe refresh token;
- não existe logout com lista de tokens revogados;
- não existe recuperação de senha;
- não há testes automatizados;
- não há limitação de tentativas no login;
- erros internos ainda incluem `error.message` na resposta;
- a matrícula atual aceita apenas números;
- o projeto não normaliza nome ou e-mail.

## Erros comuns

### Token não fornecido

Verifique se o header foi enviado:

```http
Authorization: Bearer TOKEN
```

### Token mal formatado

É necessário existir um espaço entre `Bearer` e o token.

### Token inválido ou expirado

Faça login novamente e use o novo token.

### Login sempre falha

Confira:

- se o e-mail é exatamente igual ao cadastrado;
- se a senha está correta;
- se o administrador está ativo;
- se o banco configurado no `.env` é o banco correto.

### Erro de conexão com PostgreSQL

Revise:

- `PGUSER`;
- `PGPASSWORD`;
- `PGHOST`;
- `PGPORT`;
- `PGDATABASE`;
- se o serviço PostgreSQL está executando.

### `JWT_SECRET` ausente

Adicione a variável ao `.env` e reinicie a aplicação:

```env
JWT_SECRET=uma_chave_longa_e_secreta
```

### Porta ocupada

Altere:

```env
PORTA=3333
```

e reinicie o servidor.

## Fluxo completo

```text
1. POST /admin/cadastrar
   -> valida dados
   -> gera hash da senha
   -> salva administrador

2. POST /admin/login
   -> busca administrador
   -> compara a senha
   -> gera JWT

3. Cliente guarda o token

4. Cliente acessa uma rota privada
   -> envia Authorization: Bearer TOKEN

5. Middleware
   -> extrai o token
   -> jwt.verify valida assinatura e expiração
   -> coloca o payload na requisição
   -> chama proximo()

6. Controller
   -> executa a operação solicitada
   -> model consulta ou altera o PostgreSQL
   -> API devolve JSON
```

## Resumo das rotas

```text
GET     /

POST    /admin/cadastrar
POST    /admin/login
GET     /admin/perfil

GET     /aluno/listar
GET     /aluno/listar/:matricula
POST    /aluno/cadastrar
PUT     /aluno/editar/total/:matricula
PATCH   /aluno/editar/parcial/:matricula
DELETE  /aluno/excluir/todos
DELETE  /aluno/excluir/:matricula
```

Com exceção de `/`, `/admin/cadastrar` e `/admin/login`, todas as rotas exigem um JWT válido.
