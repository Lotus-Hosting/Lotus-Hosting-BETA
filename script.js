// CONFIGURAÇÃO DO DISCORD WEBHOOK
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1550215201943588997/_hzE5cEiOqcAU-wpCp_7gDa8GbA_KqC_Y8xYq9wz6C9cfvM6eemAoa_xGbtkmNa9dUHd";

// NAVEGAÇÃO ENTRE SUBPÁGINAS / ABAS
function switchTab(tabId, event) {
  if (event) event.preventDefault();

  // Esconde todas as abas
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove classe active do menu
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Ativa a aba e o menu correspondente
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Atualiza o link ativo na nav
  const activeLink = document.querySelector(`.nav-link[href="#${tabId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// SELECIONAR PLANO E IR DIRETO PARA O FORMULÁRIO
function selectPlan(planName) {
  const planSelect = document.getElementById('plan');
  if (planSelect) {
    planSelect.value = planName;
  }
  switchTab('contato');
}

// ENVIO DE NOTIFICAÇÃO PARA O DISCORD VIA WEBHOOK
async function sendDiscordNotification(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const statusDiv = document.getElementById('formStatus');

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const plan = document.getElementById('plan').value;
  const details = document.getElementById('details').value || "Nenhum detalhe informado.";

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";
  statusDiv.innerText = "";

  // Formatação da mensagem (Embed do Discord)
  const discordData = {
    username: "Lotus Hosting Bot",
    avatar_url: "https://i.imgur.com/4M34hi2.png",
    embeds: [
      {
        title: "🚀 Nova Solicitação de Projeto!",
        color: 10979834, // Cor Roxo Claro (#A78BFA)
        fields: [
          { name: "👤 Cliente / Empresa", value: name, inline: true },
          { name: "📦 Plano Escolhido", value: plan, inline: true },
          { name: "📧 E-mail", value: email, inline: true },
          { name: "📱 WhatsApp / Telefone", value: phone, inline: true },
          { name: "📝 Detalhes do Projeto", value: details }
        ],
        footer: { text: "Lotus Hosting Hub • Sistema Automático" },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordData)
    });

    if (response.ok || response.status === 204) {
      statusDiv.className = "form-status success";
      statusDiv.innerText = "✓ Pedido enviado com sucesso! Entraremos em contato em breve.";
      document.getElementById('orderForm').reset();
    } else {
      throw new Error("Erro na resposta do servidor");
    }
  } catch (error) {
    statusDiv.className = "form-status error";
    statusDiv.innerText = "❌ Ocorreu um erro ao enviar. Tente novamente mais tarde.";
    console.error("Erro Discord Webhook:", error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Enviar Solicitação";
  }
}
