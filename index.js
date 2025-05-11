import express from 'express';
import cors from 'cors';
import { getResumoPedido } from './servico/resumo.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/resumo/:idCliente', async (req, res) => {
  const { idCliente } = req.params;

  try {
    if (!idCliente) {
      return res.status(400).json({ erro: 'ID do cliente é obrigatório.' });
    }

    const resumo = await getResumoPedido(idCliente);
    res.json(resumo);

  } catch (error) {
    console.error('Erro na rota /resumo:', error.message);
    
    const isClientError = error.message.includes('Nenhum pedido') || error.message.includes('ID do cliente');

    res.status(isClientError ? 400 : 500).json({
      erro: error.message || 'Erro inesperado ao buscar resumo do pedido.'
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
