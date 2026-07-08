# API de Alunos com Node.js, Express e Arquitetura em Camadas

Este projeto e uma API didatica para ensinar os primeiros passos de backend com **Node.js** e **Express**.

A API permite:

- cadastrar alunos;
- listar todos os alunos;
- buscar um aluno pela matricula;
- editar os dados de um aluno;
- excluir um aluno;
- excluir todos os alunos.

O objetivo principal deste projeto nao e usar banco de dados ainda. O objetivo e entender como uma API funciona, como as rotas sao organizadas e como separar responsabilidades usando **rotas**, **controllers** e **models**.

## O Que E Uma API?

API significa **Application Programming Interface**.

De forma simples, uma API e uma forma de um sistema conversar com outro sistema.

Neste projeto, a API recebe requisicoes HTTP e devolve respostas em JSON.

Exemplo:

```text
Cliente faz uma requisicao:
GET http://localhost:3000/listar

Servidor responde:
[
  {
    "matricula": "a92222",
    "nome": "Maria Silva",
    "email": "maria@email.com"
  }
]
```

## Tecnologias Usadas

### Node.js

O Node.js permite executar JavaScript fora do navegador.

Neste projeto, ele e usado para criar um servidor backend.

### Express

O Express e uma biblioteca do Node.js que facilita a criacao de APIs.

Com ele, conseguimos criar rotas como:

```js
router.get("/listar", AlunoController.listarTodos);
router.post("/cadastrar", AlunoController.cadastrar);
router.delete("/excluir/:matricula", AlunoController.excluirPorMatricula);
```

### dotenv

O dotenv permite carregar variaveis de ambiente a partir do arquivo `.env`.

Neste projeto, usamos o `.env` para definir a porta do servidor:

```env
PORTA=3000
```

## Como Os Dados Sao Salvos

Este projeto usa um array para simular um banco de dados.

O arquivo responsavel por isso e:

```text
src/config/database.js
```

Dentro dele existe:

```js
const alunos = [];
```

Isso significa que os alunos ficam salvos apenas na memoria do servidor.

Importante:

- se o servidor estiver rodando, os dados continuam no array;
- se o servidor for reiniciado, os dados somem;
- isso e esperado neste projeto, porque ele ainda nao usa banco de dados real.

## Estrutura Do Projeto

```text
aluno/
├── docs/
├── node_modules/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── modules/
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
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Responsabilidade De Cada Arquivo

### `src/index.js`

E o arquivo principal da aplicacao.

Ele faz quatro coisas importantes:

1. importa as bibliotecas;
2. configura o Express;
3. registra as rotas;
4. inicia o servidor.

### `src/config/database.js`

Simula o banco de dados da aplicacao.

Neste projeto, o "banco" e apenas um array:

```js
const alunos = [];
```

### `src/modules/aluno/routes/aluno.route.js`

Define as rotas relacionadas aos alunos.

Exemplo:

```js
router.get("/listar", AlunoController.listarTodos);
```

Essa linha significa:

- quando alguem acessar `GET /listar`;
- o Express deve chamar `AlunoController.listarTodos`.

### `src/modules/aluno/controllers/aluno.controller.js`

Contem a logica das respostas HTTP.

O controller:

- recebe a requisicao;
- valida os dados;
- chama o model;
- devolve uma resposta para o cliente.

### `src/modules/aluno/models/aluno.model.js`

Manipula os dados.

O model:

- cadastra aluno no array;
- procura aluno;
- edita aluno;
- remove aluno.

## Fluxo Da Aplicacao

Quando o usuario cadastra um aluno, o fluxo e este:

```text
Cliente
  |
  | POST /cadastrar
  v
Rota
  |
  | chama o controller
  v
Controller
  |
  | valida os dados e chama o model
  v
Model
  |
  | salva no array
  v
database.js
```

Esse tipo de separacao ajuda a deixar o codigo mais organizado.

## Instalacao

Abra o terminal na pasta do projeto:

```powershell
cd C:\Users\i3831\Desktop\aluno
```

Instale as dependencias:

```bash
npm install
```

## Configuracao

Crie ou confira o arquivo `.env` na raiz do projeto.

Ele deve ter:

```env
PORTA=3000
```

O arquivo `.env.example` serve como modelo para mostrar quais variaveis precisam existir.

## Como Rodar

Execute:

```bash
npm start
```

O projeto usa este script no `package.json`:

```json
"start": "node --watch src/index.js"
```

O `--watch` faz o Node reiniciar automaticamente quando algum arquivo e alterado.

Se tudo estiver correto, o terminal mostrara:

```text
O servidor esta em execucao na porta 3000!
```

A API ficara disponivel em:

```text
http://localhost:3000
```

## Rotas Da API

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/` | Verifica se a API esta funcionando |
| `GET` | `/listar` | Lista todos os alunos |
| `GET` | `/listar/:matricula` | Busca um aluno pela matricula |
| `POST` | `/cadastrar` | Cadastra um aluno |
| `PUT` | `/editar/total/:matricula` | Edita nome e email de um aluno |
| `PATCH` | `/editar/parcial/:matricula` | Edita nome ou email de um aluno |
| `DELETE` | `/excluir/todos` | Exclui todos os alunos |
| `DELETE` | `/excluir/:matricula` | Exclui um aluno pela matricula |

## Explicando Os Metodos HTTP

### GET

Usado para buscar informacoes.

Exemplos:

```text
GET /listar
GET /listar/a92222
```

### POST

Usado para criar um novo recurso.

Exemplo:

```text
POST /cadastrar
```

### PUT

Usado para atualizar um recurso de forma completa.

Neste projeto, o PUT exige `nome` e `email`.

Exemplo:

```text
PUT /editar/total/a92222
```

### PATCH

Usado para atualizar parte de um recurso.

Neste projeto, o PATCH permite enviar apenas `nome`, apenas `email` ou os dois.

Exemplo:

```text
PATCH /editar/parcial/a92222
```

### DELETE

Usado para excluir um recurso.

Exemplos:

```text
DELETE /excluir/a92222
DELETE /excluir/todos
```

## Modelo De Aluno

Um aluno possui:

```json
{
  "matricula": "a92222",
  "nome": "Maria Silva",
  "email": "maria@email.com"
}
```

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
| --- | --- | --- | --- |
| `matricula` | string | Sim | Identificador unico do aluno |
| `nome` | string | Sim | Nome do aluno |
| `email` | string | Sim | Email do aluno |

## Exemplos De Uso

Os exemplos abaixo usam PowerShell.

### Verificar Se A API Esta Funcionando

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/"
```

Resposta esperada:

```json
{
  "mensagem": "API funcionando com sucesso!",
  "status": "ok",
  "date": "08/07/2026, 10:00:00"
}
```

### Cadastrar Um Aluno

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/cadastrar" `
  -ContentType "application/json" `
  -Body '{"matricula":"a92222","nome":"Maria Silva","email":"maria@email.com"}'
```

Resposta esperada:

```json
{
  "mensagem": "Cadastro realizado com sucesso!",
  "aluno": {
    "matricula": "a92222",
    "nome": "Maria Silva",
    "email": "maria@email.com"
  }
}
```

### Listar Todos Os Alunos

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/listar"
```

Resposta esperada:

```json
[
  {
    "matricula": "a92222",
    "nome": "Maria Silva",
    "email": "maria@email.com"
  }
]
```

Se nao houver alunos cadastrados:

```json
{
  "mensagem": "Nenhum aluno cadastrado!"
}
```

### Buscar Aluno Pela Matricula

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/listar/a92222"
```

Resposta esperada:

```json
{
  "matricula": "a92222",
  "nome": "Maria Silva",
  "email": "maria@email.com"
}
```

Se a matricula nao existir:

```json
{
  "mensagem": "Aluno nao encontrado!"
}
```

### Editar Aluno Com PUT

Use PUT quando quiser enviar todos os campos editaveis.

```powershell
Invoke-RestMethod -Method Put `
  -Uri "http://localhost:3000/editar/total/a92222" `
  -ContentType "application/json" `
  -Body '{"nome":"Maria Souza","email":"maria.souza@email.com"}'
```

Resposta esperada:

```json
{
  "mensagem": "Aluno atualizado com sucesso!",
  "aluno": {
    "matricula": "a92222",
    "nome": "Maria Souza",
    "email": "maria.souza@email.com"
  }
}
```

### Editar Aluno Com PATCH

Use PATCH quando quiser enviar apenas alguns campos.

Exemplo alterando apenas o nome:

```powershell
Invoke-RestMethod -Method Patch `
  -Uri "http://localhost:3000/editar/parcial/a92222" `
  -ContentType "application/json" `
  -Body '{"nome":"Maria Oliveira"}'
```

Exemplo alterando apenas o email:

```powershell
Invoke-RestMethod -Method Patch `
  -Uri "http://localhost:3000/editar/parcial/a92222" `
  -ContentType "application/json" `
  -Body '{"email":"maria.oliveira@email.com"}'
```

### Excluir Um Aluno

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/excluir/a92222"
```

Resposta esperada:

```json
{
  "mensagem": "Aluno excluido com sucesso!",
  "aluno": {
    "matricula": "a92222",
    "nome": "Maria Oliveira",
    "email": "maria.oliveira@email.com"
  }
}
```

### Excluir Todos Os Alunos

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/excluir/todos"
```

Resposta esperada:

```json
{
  "mensagem": "Todos os alunos foram excluidos!"
}
```

## Como Testar No Postman, Insomnia Ou Thunder Client

### Cadastro

Configuracao:

- metodo: `POST`;
- URL: `http://localhost:3000/cadastrar`;
- Body: `raw`;
- formato: `JSON`.

Corpo:

```json
{
  "matricula": "a92222",
  "nome": "Maria Silva",
  "email": "maria@email.com"
}
```

### Listagem

Configuracao:

- metodo: `GET`;
- URL: `http://localhost:3000/listar`.

### Busca Por Matricula

Configuracao:

- metodo: `GET`;
- URL: `http://localhost:3000/listar/a92222`.

### Edicao Total

Configuracao:

- metodo: `PUT`;
- URL: `http://localhost:3000/editar/total/a92222`;
- Body: `raw`;
- formato: `JSON`.

Corpo:

```json
{
  "nome": "Maria Souza",
  "email": "maria.souza@email.com"
}
```

### Edicao Parcial

Configuracao:

- metodo: `PATCH`;
- URL: `http://localhost:3000/editar/parcial/a92222`;
- Body: `raw`;
- formato: `JSON`.

Corpo:

```json
{
  "nome": "Maria Oliveira"
}
```

### Exclusao

Configuracao:

- metodo: `DELETE`;
- URL: `http://localhost:3000/excluir/a92222`.

## Status HTTP Usados

| Status | Significado | Onde aparece |
| --- | --- | --- |
| `200` | Requisicao concluida com sucesso | Listar, buscar, editar e excluir |
| `201` | Recurso criado com sucesso | Cadastrar aluno |
| `400` | Erro nos dados enviados pelo cliente | Campos obrigatorios ausentes ou matricula duplicada |
| `404` | Recurso nao encontrado | Aluno nao encontrado |
| `500` | Erro interno do servidor | Blocos `catch` |

## Conceitos Importantes Para Os Alunos

### `requisicao`

Representa tudo o que o cliente enviou para a API.

Exemplos:

```js
requisicao.body
requisicao.params
```

### `resposta`

Representa aquilo que a API vai devolver para o cliente.

Exemplo:

```js
resposta.status(200).json(alunos);
```

### `requisicao.body`

Contem os dados enviados no corpo da requisicao.

Normalmente usado em:

- `POST`;
- `PUT`;
- `PATCH`.

Exemplo:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com"
}
```

### `requisicao.params`

Contem os parametros enviados na URL.

Na rota:

```text
/listar/:matricula
```

Se o usuario acessar:

```text
/listar/a92222
```

Entao:

```js
requisicao.params.matricula
```

tera o valor:

```text
a92222
```

### `return`

O `return` encerra a execucao da funcao.

Em controllers, usamos bastante:

```js
return resposta.status(400).json({ mensagem: "Erro" });
```

Isso evita que o codigo continue rodando depois que a resposta ja foi enviada.

### `try/catch`

O `try/catch` e usado para capturar erros inesperados.

Exemplo:

```js
try {
  // codigo principal
} catch (error) {
  // resposta em caso de erro
}
```

Se algo der errado dentro do `try`, o codigo pula para o `catch`.

## Por Que Separar Em Camadas?

Separar o projeto em camadas deixa o codigo mais organizado.

### Route

A route conhece os caminhos da API.

Exemplo:

```js
router.get("/listar", AlunoController.listarTodos);
```

### Controller

O controller lida com requisicao e resposta.

Ele valida dados, chama o model e devolve status HTTP.

### Model

O model lida com os dados.

Hoje ele mexe em um array, mas futuramente poderia conversar com um banco de dados.

## Erros Comuns

### Esquecer De Instalar As Dependencias

Se aparecer erro dizendo que nao encontrou `express` ou `dotenv`, rode:

```bash
npm install
```

### Esquecer De Configurar O `.env`

Confira se o arquivo `.env` existe e se possui:

```env
PORTA=3000
```

### Esquecer De Usar JSON No Body

Em rotas como `POST`, `PUT` e `PATCH`, envie o corpo como JSON.

No Postman ou Insomnia:

- escolha `Body`;
- escolha `raw`;
- escolha `JSON`.

### Porta Ja Esta Em Uso

Se a porta `3000` ja estiver em uso, altere o `.env`:

```env
PORTA=3333
```

Depois reinicie o servidor.

### Dados Sumiram Depois De Reiniciar

Isso acontece porque este projeto usa um array em memoria.

Quando o servidor reinicia, o array volta a ficar vazio.

## Sugestoes De Evolucao

Este projeto pode ser evoluido com:

- validacao de email;
- validacao de tamanho da matricula;
- banco de dados real;
- camada de services;
- testes automatizados;
- paginacao na listagem;
- filtros por nome ou email;
- documentacao com Swagger;
- deploy em uma plataforma online.

## Resumo Final

Para rodar o projeto:

```bash
npm install
npm start
```

Principais rotas:

```text
GET     /
GET     /listar
GET     /listar/:matricula
POST    /cadastrar
PUT     /editar/total/:matricula
PATCH   /editar/parcial/:matricula
DELETE  /excluir/todos
DELETE  /excluir/:matricula
```

Este projeto e uma base para ensinar como uma API funciona por dentro: ela recebe requisicoes, processa dados, chama camadas internas e devolve respostas em JSON.
