# Git Flow e Convenções de Versionamento

Este documento define o fluxo de trabalho com Git adotado no projeto.

O objetivo é manter o histórico organizado, facilitar revisões, reduzir conflitos e garantir previsibilidade nos processos de desenvolvimento, homologação e publicação.

---

## 1. Objetivos

O fluxo definido neste documento deve garantir:

- separação clara entre desenvolvimento e produção;
- rastreabilidade das alterações;
- commits pequenos e objetivos;
- facilidade para revisão de código;
- redução de conflitos entre branches;
- controle de versões;
- possibilidade de correções emergenciais em produção;
- padronização entre todos os integrantes da equipe.

---

## 2. Branches principais

O projeto deve possuir duas branches permanentes.

### `main`

A branch `main` representa o código estável e pronto para produção.

Regras:

- deve conter somente código validado;
- não deve receber commits diretos;
- deve ser atualizada somente por Pull Request;
- cada publicação deve gerar uma tag de versão;
- o pipeline de produção deve ser executado a partir dela;
- deve estar sempre em estado implantável.

Exemplo:

```text
main
```

### `develop`

A branch `develop` representa a versão mais recente em desenvolvimento.

Regras:

- concentra as funcionalidades concluídas;
- deve ser utilizada como base para novas features;
- não deve receber commits diretos;
- deve ser atualizada por Pull Request;
- pode ser utilizada para deploy em ambiente de homologação;
- deve permanecer estável o suficiente para testes integrados.

Exemplo:

```text
develop
```

---

## 3. Tipos de branches

As branches temporárias devem ser criadas a partir da branch adequada e removidas após o merge.

Tipos permitidos:

- `feature`;
- `fix`;
- `hotfix`;
- `release`;
- `chore`;
- `refactor`;
- `docs`;
- `test`.

---

## 4. Convenção de nomes de branches

O nome da branch deve utilizar letras minúsculas e `kebab-case`.

Formato:

```text
tipo/descricao-curta
```

Quando houver uma tarefa, ticket ou issue associada:

```text
tipo/numero-descricao-curta
```

### Exemplos

```text
feature/authentication
feature/123-user-registration
fix/login-validation
hotfix/payment-timeout
release/1.4.0
chore/update-dependencies
refactor/user-service
docs/api-documentation
test/authentication-service
```

### Evitar

```text
novaFuncionalidade
feature_login
Feature/Login
ajustes
correcao-final
teste2
branch-valtemir
```

O nome deve descrever claramente o objetivo da branch.

---

## 5. Fluxo de branches

### 5.1. `feature`

Branches `feature` devem ser utilizadas para novas funcionalidades.

Origem:

```text
develop
```

Destino:

```text
develop
```

Criação:

```bash
git switch develop
git pull origin develop
git switch -c feature/user-registration
```

Publicação:

```bash
git push -u origin feature/user-registration
```

Após a conclusão, deve ser criado um Pull Request para `develop`.

---

### 5.2. `fix`

Branches `fix` devem ser utilizadas para correções não emergenciais encontradas durante o desenvolvimento ou homologação.

Origem:

```text
develop
```

Destino:

```text
develop
```

Criação:

```bash
git switch develop
git pull origin develop
git switch -c fix/login-validation
```

---

### 5.3. `hotfix`

Branches `hotfix` devem ser utilizadas somente para correções urgentes em produção.

Origem:

```text
main
```

Destinos:

```text
main
develop
```

Criação:

```bash
git switch main
git pull origin main
git switch -c hotfix/payment-timeout
```

Após a correção:

1. criar Pull Request para `main`;
2. publicar uma nova versão;
3. criar a tag correspondente;
4. aplicar a mesma correção em `develop`.

Exemplo de sincronização:

```bash
git switch develop
git pull origin develop
git merge main
git push origin develop
```

Quando houver risco de conflitos ou alterações paralelas, a sincronização deve ser feita por Pull Request.

---

### 5.4. `release`

Branches `release` devem ser utilizadas para preparar uma nova versão.

Origem:

```text
develop
```

Destinos:

```text
main
develop
```

Criação:

```bash
git switch develop
git pull origin develop
git switch -c release/1.4.0
```

Durante a release, são permitidas apenas alterações relacionadas a:

- correções finais;
- atualização de versão;
- atualização de changelog;
- documentação;
- ajustes de configuração;
- preparação de deploy.

Não devem ser adicionadas novas funcionalidades.

Após a validação:

1. criar Pull Request para `main`;
2. gerar a tag da versão;
3. atualizar `develop` com as alterações da release;
4. remover a branch `release`.

---

### 5.5. `chore`

Branches `chore` devem ser utilizadas para tarefas de manutenção que não alteram diretamente a regra de negócio.

Exemplos:

```text
chore/update-dependencies
chore/configure-eslint
chore/update-dockerfile
chore/configure-ci
```

Origem e destino:

```text
develop
```

---

### 5.6. `refactor`

Branches `refactor` devem ser utilizadas para mudanças estruturais que não alteram o comportamento funcional esperado.

Exemplos:

```text
refactor/user-service
refactor/authentication-module
refactor/database-access
```

Origem e destino:

```text
develop
```

---

### 5.7. `docs`

Branches `docs` devem ser utilizadas para alterações de documentação.

Exemplos:

```text
docs/api-documentation
docs/update-readme
docs/database-diagram
```

Origem e destino:

```text
develop
```

Documentações urgentes relacionadas à produção podem seguir o fluxo definido pela equipe.

---

### 5.8. `test`

Branches `test` devem ser utilizadas para criação ou melhoria de testes automatizados.

Exemplos:

```text
test/user-service
test/authentication-controller
test/integration-users
```

Origem e destino:

```text
develop
```

---

## 6. Commits

Os commits devem ser pequenos, objetivos e representar uma única alteração lógica.

Cada commit deve:

- possuir uma mensagem clara;
- evitar misturar assuntos diferentes;
- manter o projeto em estado funcional sempre que possível;
- não conter arquivos temporários;
- não conter credenciais;
- não conter arquivos de ambiente;
- não incluir código comentado sem necessidade;
- não incluir logs de depuração esquecidos.

---

## 7. Padrão de mensagens de commit

As mensagens devem seguir o padrão Conventional Commits.

Formato:

```text
tipo(escopo): descrição
```

O escopo é opcional.

### Tipos permitidos

| Tipo | Finalidade |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de defeito |
| `docs` | Alteração de documentação |
| `style` | Formatação sem alteração de comportamento |
| `refactor` | Refatoração sem nova funcionalidade ou correção |
| `test` | Criação ou alteração de testes |
| `chore` | Manutenção, ferramentas ou dependências |
| `perf` | Melhoria de desempenho |
| `build` | Alteração no sistema de build |
| `ci` | Alteração em integração contínua |
| `revert` | Reversão de commit anterior |

### Exemplos

```text
feat(auth): add refresh token rotation
fix(users): validate duplicated email
docs(api): document authentication routes
refactor(database): isolate transaction handling
test(auth): add login integration tests
chore(deps): update development dependencies
perf(reports): reduce database queries
ci(github): add pull request validation workflow
```

### Evitar

```text
ajustes
correções
alterações finais
commit novo
teste
funcionando
update
```

---

## 8. Corpo do commit

Quando necessário, utilize o corpo do commit para explicar a motivação da alteração.

Exemplo:

```text
fix(auth): prevent refresh token reuse

Store the token family identifier and revoke all related tokens
when a previously rotated token is used again.
```

Para breaking changes:

```text
feat(api): change paginated response structure

BREAKING CHANGE: paginated endpoints now return items, page,
pageSize, totalItems and totalPages.
```

---

## 9. Commits relacionados a issues

Quando houver uma issue associada, ela pode ser referenciada no corpo da mensagem.

Exemplo:

```text
feat(users): add user activation flow

Closes #123
```

Referências comuns:

```text
Closes #123
Fixes #123
Refs #123
```

Utilize o padrão suportado pela plataforma de hospedagem do repositório.

---

## 10. Atualização antes do desenvolvimento

Antes de criar uma branch, atualize a branch de origem.

```bash
git switch develop
git pull origin develop
git switch -c feature/user-registration
```

Para hotfix:

```bash
git switch main
git pull origin main
git switch -c hotfix/payment-timeout
```

Não crie uma nova branch a partir de uma branch local desatualizada.

---

## 11. Sincronização da branch de trabalho

Durante o desenvolvimento, mantenha a branch atualizada com a branch de origem.

Exemplo com `rebase`:

```bash
git fetch origin
git rebase origin/develop
```

Exemplo com `merge`:

```bash
git fetch origin
git merge origin/develop
```

A equipe deve escolher uma estratégia predominante.

Recomendação:

- utilizar `rebase` em branches locais ainda não compartilhadas;
- utilizar `merge` ou Pull Request em branches compartilhadas;
- evitar reescrever o histórico de branches utilizadas por outras pessoas.

---

## 12. Uso de `rebase`

O `rebase` pode ser utilizado para manter o histórico linear antes da abertura do Pull Request.

```bash
git fetch origin
git rebase origin/develop
```

Após resolver conflitos:

```bash
git add .
git rebase --continue
```

Para cancelar:

```bash
git rebase --abort
```

Não utilize `rebase` em branches públicas compartilhadas sem alinhamento com a equipe.

---

## 13. Uso de `merge`

O `merge` deve ser utilizado quando for necessário preservar explicitamente o histórico de integração entre branches.

```bash
git switch feature/user-registration
git fetch origin
git merge origin/develop
```

Após resolver conflitos:

```bash
git add .
git commit
```

---

## 14. Pull Requests

Todo código destinado às branches `develop` ou `main` deve ser integrado por Pull Request.

Um Pull Request deve conter:

- título claro;
- descrição objetiva;
- contexto da alteração;
- principais decisões técnicas;
- instruções de teste;
- riscos conhecidos;
- screenshots quando houver alterações visuais;
- referência à issue ou tarefa correspondente.

### Exemplo de título

```text
feat(auth): implement refresh token rotation
```

### Estrutura recomendada

```markdown
## Contexto

Descreva o problema ou necessidade.

## Alterações

- alteração 1;
- alteração 2;
- alteração 3.

## Como testar

1. Execute o projeto.
2. Realize a autenticação.
3. Renove o token.
4. Verifique o comportamento esperado.

## Evidências

Inclua logs, screenshots ou resultados de testes quando necessário.

## Checklist

- [ ] Testes executados;
- [ ] Documentação atualizada;
- [ ] Sem credenciais ou arquivos sensíveis;
- [ ] Sem regressões conhecidas.
```

---

## 15. Revisão de código

Todo Pull Request deve ser revisado antes do merge.

A revisão deve observar:

- aderência aos requisitos;
- clareza do código;
- consistência arquitetural;
- tratamento de erros;
- segurança;
- desempenho;
- testes;
- documentação;
- compatibilidade com o restante do sistema;
- ausência de informações sensíveis.

O autor não deve aprovar o próprio Pull Request como única revisão quando houver outros revisores disponíveis.

---

## 16. Estratégia de merge

A estratégia padrão recomendada é `Squash and merge` para branches de feature, fix, chore, refactor, docs e test.

Vantagens:

- histórico mais limpo;
- um commit por Pull Request;
- facilidade de reversão;
- menor quantidade de commits intermediários.

Para releases ou integrações específicas, a equipe pode utilizar merge commit.

Regras recomendadas:

| Tipo de branch | Estratégia |
|---|---|
| `feature/*` | Squash and merge |
| `fix/*` | Squash and merge |
| `chore/*` | Squash and merge |
| `refactor/*` | Squash and merge |
| `docs/*` | Squash and merge |
| `test/*` | Squash and merge |
| `release/*` | Merge commit ou squash, conforme política |
| `hotfix/*` | Squash and merge ou merge commit |

A estratégia deve ser consistente em todo o projeto.

---

## 17. Exclusão de branches

Branches temporárias devem ser removidas após o merge.

Exclusão local:

```bash
git branch -d feature/user-registration
```

Exclusão forçada local:

```bash
git branch -D feature/user-registration
```

Exclusão remota:

```bash
git push origin --delete feature/user-registration
```

Utilize `-D` somente quando tiver certeza de que a branch não contém alterações necessárias.

---

## 18. Proteção de branches

As branches `main` e `develop` devem possuir proteção no repositório remoto.

Regras recomendadas:

- bloquear push direto;
- exigir Pull Request;
- exigir pelo menos uma aprovação;
- exigir pipeline de CI aprovado;
- exigir branch atualizada antes do merge;
- impedir exclusão;
- impedir force push;
- exigir resolução de comentários pendentes;
- restringir alterações em arquivos críticos quando necessário.

---

## 19. Tags e versionamento

O projeto deve utilizar Versionamento Semântico.

Formato:

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
1.4.2
```

Significado:

- `MAJOR`: alterações incompatíveis;
- `MINOR`: novas funcionalidades compatíveis;
- `PATCH`: correções compatíveis.

### Exemplos

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

---

## 20. Criação de tags

A tag deve ser criada a partir da branch `main` após a aprovação e publicação da versão.

Exemplo:

```bash
git switch main
git pull origin main
git tag -a v1.4.0 -m "Release v1.4.0"
git push origin v1.4.0
```

Para enviar todas as tags:

```bash
git push origin --tags
```

Tags publicadas não devem ser alteradas ou reutilizadas.

---

## 21. Pré-lançamentos

Versões de pré-lançamento podem utilizar identificadores adicionais.

Exemplos:

```text
v1.4.0-alpha.1
v1.4.0-beta.1
v1.4.0-rc.1
```

Significados:

- `alpha`: versão inicial e instável;
- `beta`: versão em validação;
- `rc`: candidata a lançamento.

---

## 22. Changelog

Alterações relevantes devem ser registradas em `CHANGELOG.md`.

Categorias recomendadas:

```markdown
## [1.4.0] - 2026-07-02

### Added

- Added user registration flow.

### Changed

- Updated authentication response structure.

### Fixed

- Fixed refresh token expiration validation.

### Removed

- Removed deprecated login endpoint.
```

Categorias permitidas:

- `Added`;
- `Changed`;
- `Deprecated`;
- `Removed`;
- `Fixed`;
- `Security`.

---

## 23. Resolução de conflitos

Conflitos devem ser resolvidos com atenção e validação posterior.

Passos recomendados:

```bash
git fetch origin
git rebase origin/develop
```

Após identificar os conflitos:

1. revisar os dois lados da alteração;
2. preservar a regra de negócio correta;
3. remover os marcadores de conflito;
4. executar lint;
5. executar testes;
6. validar o comportamento afetado;
7. continuar o rebase ou concluir o merge.

Marcadores de conflito:

```text
<<<<<<< HEAD
código atual
=======
código recebido
>>>>>>> origin/develop
```

Nunca finalize um merge ou rebase sem revisar todos os arquivos afetados.

---

## 24. Arquivos que não devem ser versionados

Os seguintes arquivos não devem ser enviados ao repositório:

```text
.env
.env.local
.env.production
node_modules/
dist/
build/
coverage/
*.log
.DS_Store
Thumbs.db
```

O arquivo `.gitignore` deve ser mantido atualizado.

Um arquivo `.env.example` pode ser versionado sem valores sensíveis.

Exemplo:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
```

---

## 25. Informações sensíveis

Nunca versionar:

- senhas;
- tokens;
- chaves privadas;
- certificados privados;
- credenciais de banco;
- segredos JWT;
- chaves de API;
- arquivos reais de ambiente;
- dados pessoais desnecessários;
- dumps de produção.

Caso uma credencial seja enviada ao repositório:

1. revogue ou rotacione imediatamente;
2. remova a credencial do código;
3. atualize o histórico quando necessário;
4. comunique a equipe;
5. revise logs e acessos relacionados.

A remoção do commit não torna automaticamente a credencial segura.

---

## 26. Stash

O `stash` pode ser utilizado para armazenar alterações temporárias.

Criar stash:

```bash
git stash push -m "work in progress: user registration"
```

Listar:

```bash
git stash list
```

Aplicar sem remover:

```bash
git stash apply
```

Aplicar e remover:

```bash
git stash pop
```

Remover stash específico:

```bash
git stash drop stash@{0}
```

O stash não deve substituir commits regulares.

---

## 27. Reversão de alterações

Para reverter um commit já publicado, utilize preferencialmente `git revert`.

```bash
git revert <commit-hash>
```

Isso cria um novo commit que desfaz a alteração anterior.

Evite utilizar `git reset --hard` em branches compartilhadas.

---

## 28. Cherry-pick

O `cherry-pick` deve ser utilizado apenas quando uma alteração específica precisar ser aplicada em outra branch.

```bash
git cherry-pick <commit-hash>
```

Em caso de conflito:

```bash
git add .
git cherry-pick --continue
```

Para cancelar:

```bash
git cherry-pick --abort
```

O uso frequente de `cherry-pick` pode indicar problemas no fluxo de branches e deve ser avaliado.

---

## 29. Force push

O uso de force push deve ser evitado.

Quando realmente necessário em uma branch pessoal, prefira:

```bash
git push --force-with-lease
```

Evite:

```bash
git push --force
```

Nunca utilize force push em `main` ou `develop`.

---

## 30. Checklist antes do commit

Antes de criar um commit:

- [ ] O código compila;
- [ ] O lint foi executado;
- [ ] Os testes foram executados;
- [ ] Não há logs de depuração desnecessários;
- [ ] Não há código comentado sem justificativa;
- [ ] Não há arquivos sensíveis;
- [ ] A alteração possui uma responsabilidade clara;
- [ ] A mensagem segue o padrão definido.

---

## 31. Checklist antes do Pull Request

Antes de abrir um Pull Request:

- [ ] A branch está atualizada;
- [ ] Os conflitos foram resolvidos;
- [ ] O projeto compila;
- [ ] O lint foi executado;
- [ ] Os testes foram executados;
- [ ] Novos comportamentos possuem testes;
- [ ] A documentação foi atualizada;
- [ ] O Pull Request possui descrição;
- [ ] A issue correspondente foi referenciada;
- [ ] Não há credenciais ou dados sensíveis;
- [ ] Alterações visuais possuem evidências.

---

## 32. Fluxo completo de uma feature

Exemplo:

```bash
git switch develop
git pull origin develop

git switch -c feature/user-registration

git add .
git commit -m "feat(users): add user registration endpoint"

git fetch origin
git rebase origin/develop

git push -u origin feature/user-registration
```

Depois:

1. abrir Pull Request para `develop`;
2. aguardar o pipeline;
3. solicitar revisão;
4. corrigir eventuais apontamentos;
5. realizar o merge;
6. remover a branch.

---

## 33. Fluxo completo de um hotfix

Exemplo:

```bash
git switch main
git pull origin main

git switch -c hotfix/payment-timeout

git add .
git commit -m "fix(payments): increase gateway timeout"

git push -u origin hotfix/payment-timeout
```

Depois:

1. abrir Pull Request para `main`;
2. validar a correção;
3. realizar o merge;
4. criar nova tag;
5. publicar a versão;
6. sincronizar `develop`;
7. remover a branch.

---

## 34. Resumo do fluxo

| Branch | Origem | Destino | Finalidade |
|---|---|---|---|
| `feature/*` | `develop` | `develop` | Nova funcionalidade |
| `fix/*` | `develop` | `develop` | Correção em desenvolvimento |
| `hotfix/*` | `main` | `main` e `develop` | Correção urgente em produção |
| `release/*` | `develop` | `main` e `develop` | Preparação de versão |
| `chore/*` | `develop` | `develop` | Manutenção |
| `refactor/*` | `develop` | `develop` | Refatoração |
| `docs/*` | `develop` | `develop` | Documentação |
| `test/*` | `develop` | `develop` | Testes |

---

## 35. Regra final

Quando houver dúvida:

1. não realize push direto em `main` ou `develop`;
2. crie uma branch com nome descritivo;
3. mantenha os commits pequenos;
4. atualize a branch antes do Pull Request;
5. execute os testes;
6. solicite revisão;
7. preserve a rastreabilidade da alteração.

A consistência do histórico é uma responsabilidade de toda a equipe.
