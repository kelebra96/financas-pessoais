# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para a **Plataforma de Gestão Financeira Pessoal**! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto adota um Código de Conduta para garantir um ambiente acolhedor para todos. Leia [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) antes de contribuir.

## 🚀 Como Contribuir

### Reportar Bugs

Bugs são rastreados como [GitHub issues](https://github.com/kelebra96/financas-pessoais/issues).

Ao reportar um bug, inclua:

- **Título descritivo**: Use um título claro e descritivo
- **Descrição do bug**: Descreva o comportamento observado e o esperado
- **Passos para reproduzir**: Liste os passos específicos para reproduzir o bug
- **Exemplos específicos**: Forneça exemplos específicos para demonstrar os passos
- **Comportamento atual**: Descreva o comportamento observado
- **Comportamento esperado**: Descreva qual deveria ser o comportamento
- **Screenshots**: Se aplicável, adicione screenshots
- **Seu ambiente**: Inclua seu SO, versão do Node.js, versão do navegador, etc.

### Sugerir Melhorias

Melhorias são rastreadas como [GitHub issues](https://github.com/kelebra96/financas-pessoais/issues).

Ao sugerir uma melhoria, inclua:

- **Título descritivo**: Use um título claro e descritivo
- **Descrição da melhoria**: Descreva a melhoria sugerida em detalhes
- **Justificativa**: Explique por que essa melhoria seria útil
- **Exemplos**: Forneça exemplos específicos para demonstrar a melhoria

### Submeter Pull Requests

1. **Fork o repositório**
   ```bash
   git clone https://github.com/seu-usuario/financas-pessoais.git
   cd financas-pessoais
   ```

2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/sua-feature-incrivel
   ```

3. **Instale as dependências**
   ```bash
   pnpm install
   ```

4. **Faça suas mudanças**
   - Siga o [Guia de Estilo](#guia-de-estilo)
   - Escreva testes para novas funcionalidades
   - Atualize a documentação conforme necessário

5. **Teste suas mudanças**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

6. **Commit suas mudanças**
   ```bash
   git commit -m "feat: descrição clara da mudança"
   ```
   
   Siga o [Conventional Commits](#conventional-commits)

7. **Push para sua fork**
   ```bash
   git push origin feature/sua-feature-incrivel
   ```

8. **Abra um Pull Request**
   - Preencha o template do PR
   - Descreva suas mudanças claramente
   - Referencie issues relacionadas com `#numero-da-issue`

## 📝 Guia de Estilo

### JavaScript/TypeScript

- Use **TypeScript** para novo código
- Use **camelCase** para variáveis e funções
- Use **PascalCase** para classes e componentes
- Use **UPPER_SNAKE_CASE** para constantes
- Máximo de 100 caracteres por linha (preferível)
- Use `const` por padrão, `let` quando necessário, evite `var`
- Use arrow functions `=>` quando apropriado

### React

- Use **Functional Components** com Hooks
- Nomes de componentes em **PascalCase**
- Nomes de props em **camelCase**
- Mantenha componentes pequenos e focados
- Use `React.memo` para componentes que não mudam frequentemente
- Evite prop drilling, use Context quando apropriado

### CSS/Tailwind

- Use **Tailwind CSS** para styling
- Prefira utilitários Tailwind em vez de CSS customizado
- Use classes semânticas quando apropriado
- Mantenha a responsividade em mente (mobile-first)

### Commits

- Use mensagens de commit claras e descritivas
- Siga [Conventional Commits](#conventional-commits)
- Cada commit deve ser uma unidade lógica de mudança

## 🎯 Conventional Commits

Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
```

### Tipos

- **feat**: Uma nova feature
- **fix**: Uma correção de bug
- **docs**: Mudanças na documentação
- **style**: Mudanças que não afetam o significado do código (formatação, etc.)
- **refactor**: Mudanças no código que não adicionam features nem corrigem bugs
- **perf**: Mudanças que melhoram a performance
- **test**: Adição ou atualização de testes
- **chore**: Mudanças em dependências, configuração, etc.

### Exemplos

```bash
# Feature
git commit -m "feat(transactions): adicionar categorização automática"

# Bug fix
git commit -m "fix(dashboard): corrigir cálculo de saldo total"

# Documentation
git commit -m "docs: atualizar README com instruções de setup"

# Refactor
git commit -m "refactor(api): simplificar lógica de validação"
```

## 🧪 Testes

- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes acima de 80%
- Use [Vitest](https://vitest.dev/) para testes unitários
- Execute testes antes de fazer commit

```bash
# Executar testes
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar testes em modo watch
pnpm test:watch
```

## 🔍 Linting e Formatação

- Use [ESLint](https://eslint.org/) para linting
- Use [Prettier](https://prettier.io/) para formatação
- Configure seu editor para formatar ao salvar

```bash
# Verificar linting
pnpm lint

# Formatar código
pnpm format

# Verificar tipos TypeScript
pnpm type-check
```

## 📚 Documentação

- Atualize o README.md se adicionar novas features
- Documente funções públicas com comentários JSDoc
- Mantenha a documentação atualizada com o código
- Use exemplos claros na documentação

### Exemplo de JSDoc

```typescript
/**
 * Formata um valor em centavos para moeda BRL
 * 
 * @param centavos - Valor em centavos
 * @returns String formatada em BRL
 * 
 * @example
 * formatCurrency(10050) // "R$ 100,50"
 */
export function formatCurrency(centavos: number): string {
  // ...
}
```

## 🔄 Processo de Review

1. Seu PR será revisado por um ou mais mantenedores
2. Mudanças podem ser solicitadas
3. Após aprovação, seu PR será mergeado
4. Seu nome será adicionado à lista de contribuidores

## 📦 Dependências

- Mantenha o número de dependências ao mínimo
- Justifique a adição de novas dependências
- Prefira dependências bem mantidas e populares
- Verifique a licença das dependências

## 🚨 Segurança

- Não comita secrets ou credenciais
- Reporte vulnerabilidades de segurança em privado
- Siga as melhores práticas de segurança
- Valide e sanitize todas as entradas do usuário

## 📞 Contato

- **Issues**: Use [GitHub Issues](https://github.com/kelebra96/financas-pessoais/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/kelebra96/financas-pessoais/discussions)
- **Email**: kelebra96@gmail.com

## 🙏 Agradecimentos

Obrigado por contribuir com a **Plataforma de Gestão Financeira Pessoal**! Sua contribuição é valiosa e ajuda a melhorar o projeto para todos.

---

**Feliz contribuindo! 🚀**
