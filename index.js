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
        const resumo = await getResumoPedido(idCliente);
        res.json(resumo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar resumo do pedido' });
    }
});

app.listen(port, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${port}`);
});
