import express from 'express';
import cors from 'cors';
import { getResumoPedido } from './servico/resumo.js';
import registrarResumoPedido from './servico/resumoPedido.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/resumo/:idCliente', async (req, res) => {
  const { idCliente } = req.params;

  if (isNaN(idCliente) || idCliente <= 0) {
    return res.status(400).json({ erro: 'ID de cliente inválido. Deve ser um número maior que 0.' });
  }

  try {
    const resumo = await getResumoPedido(idCliente);
    res.json(resumo);
  } catch (error) {
    console.error('Erro ao buscar resumo do pedido:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar resumo do pedido.' });
  }
});

app.post('/resumo', async (req, res) => {
  try {
    const { id_cliente, valor_total, forma_pagamento } = req.body;

    if (!id_cliente || !valor_total || !forma_pagamento) {
      return res.status(400).json({ erro: 'Dados do pedido incompletos.' });
    }

    const resposta = await registrarResumoPedido(id_cliente, valor_total, forma_pagamento);

    if (resposta.status === 'erro') {
      return res.status(500).json({ erro: resposta.erro });
    }

    res.status(201).json(resposta);
  } catch (error) {
    console.error('Erro ao registrar pedido:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar pedido.' });
  }
});

app.delete('/pedidos/aguardando/:idCliente', async (req, res) => {
  const { idCliente } = req.params;

  if (isNaN(idCliente) || idCliente <= 0) {
    return res.status(400).json({ erro: 'ID de cliente inválido. Deve ser um número maior que 0.' });
  }

  try {

    const resultado = await apagarPedidosAguardando(idCliente);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao apagar pedidos aguardando:', error);
    res.status(500).json({ erro: 'Erro interno ao apagar pedidos aguardando.' });
  }
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
