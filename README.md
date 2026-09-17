# 🪷 Lotus Hosting - Hub Principal

Plataforma web moderna e responsiva para a **Lotus Hosting**, voltada para a divulgação de serviços de hospedagem e criação de sites de alta performance. O projeto foi construído utilizando o conceito de **Single Page Application (SPA)** simples, garantindo uma navegação fluida por subpáginas/abas sem recarregamento de página.

---

## 🎨 Paleta de Cores e Identidade Visual

* **Roxo Claro (`#A78BFA`):** Cor primária e branding da Lotus.
* **Preto/Grafite (`#0D0F12`):** Background principal em visual *Dark Mode* moderno.
* **Branco (`#FFFFFF`):** Textos principais e cards.
* **Laranja (`#F97316`):** Botões de ação (CTA - *Call to Action*).
* **Verde (`#22C55E`):** Indicadores de status ("100% Online") e mensagens de sucesso.

---

## ⚡ Funcionalidades

- **Navegação Dinâmica (SPA):** Transição instantânea entre as seções (*Início*, *Planos*, *Diferenciais* e *Pedir Site*) sem recarregar o navegador.
- **Tabela de Planos Integradora:** Seleção direta de planos (*Starter Site*, *Pro Business*, *Custom/E-commerce*) pré-preenchendo o formulário de pedido.
- **Notificação em Tempo Real via Discord:** Integração nativa de formulário com **Discord Webhooks**, enviando um alerta formatado (*embed*) para o canal da equipe a cada nova solicitação.
- **Layout Totalmente Responsivo:** Adaptado para dispositivos móveis, tablets e desktops.

---

## 📁 Estrutura de Arquivos

```text
lotus-hosting/
├── index.html     # Estrutura HTML do Hub e subpáginas
├── style.css      # Estilização completa, variáveis CSS e temas
├── script.js     # Lógica de navegação SPA e integração Webhook Discord
|__ logo.png      # a nossa logo
└── README.md      # Documentação do projeto
