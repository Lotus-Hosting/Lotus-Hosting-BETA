document.addEventListener('DOMContentLoaded', () => {
  // 1. TROCA DE PÁGINAS (SPA)
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');
  const selectPlano = document.getElementById('tipo_projeto');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (link.getAttribute('target') === '_blank' || (href && href.startsWith('http'))) {
        return;
      }

      e.preventDefault();
      if (!href || !href.startsWith('#')) return;

      const targetId = href.replace('#', '');

      // Seleção automática do plano ao clicar num card
      const planName = link.getAttribute('data-plan');
      if (planName && selectPlano) {
        for (let option of selectPlano.options) {
          const nameAttribute = option.getAttribute('data-name');
          if (nameAttribute && nameAttribute.includes(planName)) {
            option.selected = true;
            atualizarValor();
            break;
          }
        }
      }

      sections.forEach(sec => sec.classList.remove('active'));
      navLinks.forEach(l => l.classList.remove('active'));

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
        const menuMatch = document.querySelectorAll(`.nav-menu a[href="#${targetId}"]`);
        menuMatch.forEach(m => m.classList.add('active'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // 2. SISTEMA DE PREÇOS E CUPONS DE DESCONTO
  const cupomInput = document.getElementById('cupom_input');
  const btnCupom = document.getElementById('btn-cupom');
  const cupomStatus = document.getElementById('cupom-status');
  const valorDisplay = document.getElementById('valor-estimado');

  let descontoAtivo = 0;
  let cupomNomeAtivo = "";

  function atualizarValor() {
    if (!selectPlano || !valorDisplay) return;
    
    const precoBase = parseFloat(selectPlano.value);

    if (precoBase === 0) {
      valorDisplay.innerText = "Sob Consulta";
      return;
    }

    const valorComDesconto = precoBase * (1 - descontoAtivo);
    valorDisplay.innerText = `R$ ${valorComDesconto.toFixed(2).replace('.', ',')}`;
  }

  // APLICAÇÃO DE CUPOM
  if (btnCupom) {
    btnCupom.addEventListener('click', () => {
      const codigo = cupomInput.value.trim().toUpperCase();

      if (codigo === 'VIN30') {
        descontoAtivo = 0.30;
        cupomNomeAtivo = 'VIN30';
        cupomStatus.style.color = '#10B981';
        cupomStatus.innerText = '✓ Cupom VIN30 aplicado com sucesso! (30% OFF)';
      } else if (codigo === 'LOTUS15') {
        descontoAtivo = 0.15;
        cupomNomeAtivo = 'LOTUS15';
        cupomStatus.style.color = '#10B981';
        cupomStatus.innerText = '✓ Cupom LOTUS15 aplicado com sucesso! (15% OFF)';
      } else {
        descontoAtivo = 0;
        cupomNomeAtivo = "";
        cupomStatus.style.color = '#EF4444';
        cupomStatus.innerText = '✗ Cupom inválido ou expirado.';
      }

      atualizarValor();
    });
  }

  if (selectPlano) {
    selectPlano.addEventListener('change', atualizarValor);
  }

  // 3. ENVIO DE PEDIDOS (WEBHOOK DE PEDIDO)
  const formPedido = document.getElementById('discord-form');
  const statusMsgPedido = document.getElementById('form-status');
  const btnEnviarPedido = document.getElementById('btn-enviar');

  const WEBHOOK_PEDIDO = 'https://discordapp.com/api/webhooks/1551395856261980200/h8vH78AayxlrUNeoWliHvbWskw9beul00kI03FVaY0XHs64eaXyvsTMbgkHwKQ_R_P2p';

  if (formPedido) {
    formPedido.addEventListener('submit', async (e) => {
      e.preventDefault();

      btnEnviarPedido.disabled = true;
      btnEnviarPedido.innerText = 'Enviando...';

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const whatsapp = document.getElementById('whatsapp').value;
      const planoSelecionado = selectPlano.options[selectPlano.selectedIndex].getAttribute('data-name');
      const valorFinal = valorDisplay.innerText;
      const mensagem = document.getElementById('mensagem').value || 'Nenhum detalhe adicional.';

      const payload = {
        embeds: [{
          title: "🚀 Novo Pedido de Site - Lotus Hosting",
          color: 9133302,
          fields: [
            { name: "👤 Nome / Empresa", value: nome, inline: true },
            { name: "📧 E-mail", value: email, inline: true },
            { name: "📱 WhatsApp", value: whatsapp, inline: true },
            { name: "📦 Plano", value: planoSelecionado, inline: false },
            { name: "🎟️ Cupom Utilizado", value: cupomNomeAtivo ? cupomNomeAtivo : "Nenhum", inline: true },
            { name: "💰 Valor Final", value: valorFinal, inline: true },
            { name: "📝 Detalhes do Projeto", value: mensagem, inline: false }
          ],
          footer: { text: "Lotus Hosting Website System" },
          timestamp: new Date()
        }]
      };

      try {
        const response = await fetch(WEBHOOK_PEDIDO, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          statusMsgPedido.style.color = '#10B981';
          statusMsgPedido.innerText = 'Pedido enviado com sucesso! Entraremos em contacto brevemente.';
          statusMsgPedido.style.display = 'block';
          formPedido.reset();
          descontoAtivo = 0;
          cupomNomeAtivo = "";
          cupomStatus.innerText = '';
          atualizarValor();
        } else {
          throw new Error('Erro ao enviar');
        }
      } catch (err) {
        statusMsgPedido.style.color = '#EF4444';
        statusMsgPedido.innerText = 'Erro ao enviar o pedido. Tente novamente.';
        statusMsgPedido.style.display = 'block';
      } finally {
        btnEnviarPedido.disabled = false;
        btnEnviarPedido.innerText = 'Enviar Pedido de Orçamento';
      }
    });
  }

  // 4. ENVIO DE AVALIAÇÕES (WEBHOOK DE AVALIAÇÃO)
  const formAvaliacao = document.getElementById('avaliacao-form');
  const statusMsgAvaliacao = document.getElementById('avaliacao-form-status');
  const btnEnviarAvaliacao = document.getElementById('btn-enviar-avaliacao');

  const WEBHOOK_AVALIACAO = 'https://discordapp.com/api/webhooks/1551376430896775188/mpG-b0IAdvvw5B30Hhcz6GHGdEsYQr5tw91xUp_RX3_MKfi2xLS_SRGuOPKIi3THlzku';

  if (formAvaliacao) {
    formAvaliacao.addEventListener('submit', async (e) => {
      e.preventDefault();

      btnEnviarAvaliacao.disabled = true;
      btnEnviarAvaliacao.innerText = 'Enviando...';

      const nomeAvaliacao = document.getElementById('avaliacao-nome').value;
      const servicoAvaliacao = document.getElementById('avaliacao-servico').value;
      const notaAvaliacao = document.getElementById('avaliacao-nota').value;
      const comentarioAvaliacao = document.getElementById('avaliacao-comentario').value;

      const payload = {
        embeds: [{
          title: "⭐ Nova Avaliação do Cliente - Lotus Hosting",
          color: 16761035, // Cor amarelada/dourada para avaliações
          fields: [
            { name: "👤 Cliente / Nick", value: nomeAvaliacao, inline: true },
            { name: "🛠️ Serviço Contratado", value: servicoAvaliacao, inline: true },
            { name: "⭐ Classificação", value: notaAvaliacao, inline: false },
            { name: "💬 Avaliação / Depoimento", value: comentarioAvaliacao, inline: false }
          ],
          footer: { text: "Sistema de Avaliações - Lotus Hosting" },
          timestamp: new Date()
        }]
      };

      try {
        const response = await fetch(WEBHOOK_AVALIACAO, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          statusMsgAvaliacao.style.color = '#10B981';
          statusMsgAvaliacao.innerText = 'Muito obrigado pela sua avaliação! Seu feedback foi enviado com sucesso.';
          statusMsgAvaliacao.style.display = 'block';
          formAvaliacao.reset();
        } else {
          throw new Error('Erro ao enviar avaliação');
        }
      } catch (err) {
        statusMsgAvaliacao.style.color = '#EF4444';
        statusMsgAvaliacao.innerText = 'Erro ao enviar a avaliação. Tente novamente.';
        statusMsgAvaliacao.style.display = 'block';
      } finally {
        btnEnviarAvaliacao.disabled = false;
        btnEnviarAvaliacao.innerText = 'Enviar Avaliação';
      }
    });
  }
});
