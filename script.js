// CONFIGURAÇÃO DO DISCORD WEBHOOK
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1550215201943588997/_hzE5cEiOqcAU-wpCp_7gDa8GbA_KqC_Y8xYq9wz6C9cfvM6eemAoa_xGbtkmNa9dUHd";

// LISTA DE CUPONS CONFIGURADOS
const COUPONS = {
  "VIN30": { type: "percent", value: 30 },    // 30% de desconto (Primeiro parceiro!)
  "LOTUS15": { type: "percent", value: 15 }   // 15% de desconto
};

const PLAN_PRICES = {
  "Starter Site": 499,
  "Pro Business": 899,
  "Custom / E-commerce": 0
};

let appliedCoupon = null;

// NAVEGAÇÃO ENTRE SUBPÁGINAS / ABAS
function switchTab(tabId, event) {
  if (event) event.preventDefault();

  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

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
    updatePriceDisplay();
  }
  switchTab('contato');
}

// LÓGICA DE APLICAÇÃO DE CUPOM
function applyCoupon() {
  const input = document.getElementById('couponInput');
  const couponCode = input.value.trim().toUpperCase();
  const statusDiv = document.getElementById('couponStatus');

  if (!couponCode) {
    statusDiv.className = "coupon-status error";
    statusDiv.innerText = "Por favor, insira um código de cupom.";
    return;
  }

  if (COUPONS[couponCode]) {
    appliedCoupon = { code: couponCode, ...COUPONS[couponCode] };
    statusDiv.className = "coupon-status success";
    statusDiv.innerText = `✓ Cupom ${couponCode} aplicado com sucesso! (${appliedCoupon.value}% OFF)`;
  } else {
    appliedCoupon = null;
    statusDiv.className = "coupon-status error";
    statusDiv.innerText = "❌ Cupom inválido ou expirado.";
  }

  updatePriceDisplay();
}

// ATUALIZAÇÃO DO PREÇO FINAL NA TELA
function updatePriceDisplay() {
  const planSelect = document.getElementById('plan');
  const priceDisplay = document.getElementById('finalPriceDisplay');
  const selectedPlan = planSelect.value;
  const basePrice = PLAN_PRICES[selectedPlan] || 0;

  if (basePrice === 0) {
    priceDisplay.innerText = "Sob Consulta";
    return;
  }

  let finalPrice = basePrice;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      finalPrice = basePrice - (basePrice * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === "fixed") {
      finalPrice = Math.max(0, basePrice - appliedCoupon.value);
    }
  }

  priceDisplay.innerText = `R$ ${finalPrice.toFixed(2).replace('.', ',')}`;
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
  const finalPriceText = document.getElementById('finalPriceDisplay').innerText;

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";
  statusDiv.innerText = "";

  const couponText = appliedCoupon ? `${appliedCoupon.code} (${appliedCoupon.value}% OFF)` : "Nenhum";

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
          { name: "🏷️ Cupom Aplicado", value: couponText, inline: true },
          { name: "💰 Valor Final", value: finalPriceText, inline: true },
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
      appliedCoupon = null;
      document.getElementById('couponStatus').innerText = "";
      updatePriceDisplay();
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
