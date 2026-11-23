const express = require("express");
const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.json());

function NomeCliente(req, res, next) {
    if (req.body.NomeCliente && req.body.NomeCliente.length >= 5) {
        next();
    } else {
        res.status(400).json({ error: "O nome do cliente deve ter pelo menos 5 caracteres." });
    }
}

function ListaItens(req, res, next) {
    if (req.body.ListaItens && req.body.ListaItens.length > 0) {
        next();
    } else {
        res.status(400).json({ error: "A lista de itens não pode estar vazia." });
    }
}

app.post(
    '/pedidos', 
    body('email').isEmail().withMessage('E-mail inválido'),
    NomeCliente,
    ListaItens,
    (req, res) => {
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            return res.status(400).json({ erros: erros.array() });
        }

        res.json({ mensagem: 'Pedido recebido com sucesso!' });
    }
);

app.get('/produtos', (req, res) => {
    res.json({ mensagem: 'Lista de produtos' });
});

app.post('/pedidos/:id/fechar', (req, res) => {
    res.json({ mensagem: 'Pedido fechado com sucesso', id: req.params.id });
});

app.listen(3001, () => {
    console.log("Servidor 2 (Pedidos) funcionando em http://localhost:3001");
});