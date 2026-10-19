**Linked Portfolio**
====================

O **Linked Portfolio** é um portfólio pessoal feito com foco em performance, design elegante e responsividade. Ele utiliza tecnologias modernas para criar animações suaves e um layout acessível e adaptável.

**Tecnologias Utilizadas**
--------------------------

-   **React.js e Next.js**: Para desenvolvimento de interfaces e renderização de páginas.
-   **TailwindCSS**: Para estilização rápida e responsiva.
-   **TypeScript**: Para maior segurança e escalabilidade no código.
-   **React Hook Form**: Para gerenciamento de formulários de forma leve e eficiente.
-   **Framer Motion**: Para criar animações interativas e fluidas.
-   **EmailJs**: Para o envio de emails.
-   **Vercel**: Plataforma de deploy para hospedar a aplicação.

**Funcionalidades**
-------------------

1.  **Design Personalizável**: Layout limpo e responsivo com possibilidade de personalização.
2.  **Animações Suaves**: Utiliza Framer Motion para animações que enriquecem a experiência do usuário.
3.  **Performance Otimizada**: Implementado com Next.js para renderização eficiente e carregamento rápido.
4.  **SEO-Friendly**: Utiliza as capacidades de otimização do Next.js para melhorar o SEO.

* * * * *

**Como Configurar o Projeto**
-----------------------------

### **1\. Clonar o Repositório**
``` bash
  git clone https://github.com/phladev/linked-portfolio.git
```
### **2\. Acessar o Diretório**
``` bash
  cd linked-portfolio
```

### **3\. Instalar Dependências**
Certifique-se de ter o Node.js e npm instalados em sua máquina:
``` bash
  npm install
```

### **4\. Rodar o Projeto em Ambiente de Desenvolvimento**
``` bash
  npm run dev
```
O projeto estará disponível no navegador no endereço http://localhost:3000. É preciso também configurar as variáveis de ambiente para o uso do EmailJs.

**Deploy**
----------

O deploy é realizado automaticamente na **Vercel**. Cada commit na branch principal dispara um novo build, garantindo que a aplicação esteja sempre atualizada. Link do projeto no ar: https://www.phladev.com.br

* * * * *

**Painel de prospecção (painel.phladev.com.br)**
------------------------------------------------

Área privada para gerenciar a busca de clientes. Só responde no host do painel e exige login com a conta GitHub autorizada (`ADMIN_GITHUB_ID`).

| Rota | Para quê |
|---|---|
| `/admin` | **Hoje**: fila do dia (atrasados, hoje, esfriando, sem contato), régua de contatos e meta diária |
| `/admin/funil` | Kanban arrastável por etapa, com filtro por nicho e cidade |
| `/admin/leads`, `/admin/leads/[id]` | Lista com busca, filtros e ações em lote; ficha com próxima ação, histórico e dados |
| `/admin/leads/importar` | Importar CSV (Google Maps, planilhas) ou colar nomes, um por linha |
| `/admin/demos` | Demos que você envia, com envios, respostas e fechamentos de cada uma |
| `/admin/modelos` | Mensagens prontas com `{{nome}}`, `{{cidade}}`, `{{contato}}`, `{{demo_url}}` |
| `/admin/metricas` | Resposta por nicho e origem, contatos por dia, motivos de perda |
| `/admin/projects` | Projetos do portfólio público (já existia) |

Atalho: `Ctrl/⌘ + K` abre o cadastro rápido de lead em qualquer tela.

**Dados:** tabelas `leads`, `lead_interactions`, `message_templates` e `demos` (SQL em `lib/db/migrations/0001_prospeccao.sql`, só adiciona objetos novos). A meta diária fica em `site_content` (`painel_settings`).

**Código:** regras e consultas em `lib/leads/` e `lib/db/queries/leads.ts`; server actions em `app/admin/(painel)/leads/actions.ts` (todas exigem sessão de admin); interface em `components/painel/`; tokens visuais ("caderno de campo") em `app/admin/painel.css`, escopados em `.painel` para não afetar o site público.
