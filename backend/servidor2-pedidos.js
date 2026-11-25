const express = require("express");
const { body, param, validationResult } = require("express-validator");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).send();
    }

    next();
});

let produtos = [
    { codigo: 1, nome: "Hamburguer do Jacquin", preco: 12 },
    { codigo: 2, nome: "Refrigerante Pepsi-Cola de 350ml", preco: 5 },
    { codigo: 3, nome: "Batatinha do Fogaça", preco: 8 },
];

let pedidos = [];
let proximoId = 1;

function validar(req, res, next) {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({ erros: erros.array() });
    }

    next();
}

app.get("/produtos", async (req, res) => {
    try {
        const resposta = await fetch("http://localhost:3002/estoque");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar estoque.");
        }

        const estoque = await resposta.json();
        const lista = [];

        for (const p of produtos) {
            const produto = estoque.find(e => e.CodProduto === p.codigo);

            if (!produto) {
                throw new Error("Produto não encontrado no estoque.");
            }

            lista.push({
                codigo: p.codigo,
                nome: p.nome,
                preco: p.preco,
                estoque: produto.Estoque
            });
        }

        res.json(lista);

    } catch (erro) {
        res.status(503).json({ error: "Servidor de estoque indisponível." });
    }
});

app.post("/pedidos",
    body("NomeCliente").custom((nome) => {
        if (typeof nome !== "string") {
            throw new Error("Nome do cliente inválido.");
        }

        let tamanho = 0;

        for (const letra of nome) {
            if (letra.trim() !== "") {
                tamanho++;
            }
        }

        if (tamanho <= 5) {
            throw new Error("O nome do cliente deve ter mais de 5 caracteres sem contar os espaços.");
        }

        return true;
    }),
    body("Itens").custom((itens) => {
        if (!Array.isArray(itens) || itens.length === 0) {
            throw new Error("A lista de itens é inválida.");
        }

        const codigos = [];

        for (const item of itens) {
            if (!item || typeof item.CodProduto !== "number" || item.CodProduto <= 0 || item.CodProduto % 1 !== 0) {
                throw new Error("Código do produto inválido.");
            }

            if (typeof item.Qtd !== "number" || item.Qtd <= 0 || item.Qtd === Infinity) {
                throw new Error("Quantidade inválida.");
            }

            const produto = produtos.find(p => p.codigo === item.CodProduto);

            if (!produto) {
                throw new Error("Produto não encontrado.");
            }

            if (codigos.includes(item.CodProduto)) {
                throw new Error("Produto repetido na lista.");
            }

            codigos.push(item.CodProduto);
        }

        return true;
    }),
    validar,
    async (req, res) => {
        const itens = req.body.Itens;
        const itensPedido = [];
        const itensBaixa = [];
        let total = 0;

        for (const item of itens) {
            const produto = produtos.find(p => p.codigo === item.CodProduto);

            itensPedido.push({
                CodProduto: produto.codigo,
                Nome: produto.nome,
                Preco: produto.preco,
                Qtd: item.Qtd
            });

            itensBaixa.push({
                CodProduto: item.CodProduto,
                Estoque: item.Qtd
            });

            total += produto.preco * item.Qtd;
        }

        try {
            const resposta = await fetch("http://localhost:3002/baixa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Itens: itensBaixa })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                return res.status(resposta.status).json(resultado);
            }

            const pedido = {
                id: proximoId,
                NomeCliente: req.body.NomeCliente.trim(),
                Total: total,
                Itens: itensPedido
            };

            pedidos.push(pedido);
            proximoId++;

            res.status(201).json(pedido);

        } catch (erro) {
            res.status(503).json({ error: "Erro ao comunicar com o servidor de estoque." });
        }
    }
);

app.get("/pedidos", (req, res) => {
    res.json(pedidos);
});

app.post("/pedidos/:id/fechar",
    param("id").isInt({ min: 1 }).withMessage("ID inválido."),
    validar,
    (req, res) => {
        const id = Number(req.params.id);
        const pedido = pedidos.find(p => p.id === id);

        if (!pedido) {
            return res.status(404).json({ error: "Pedido não encontrado." });
        }

        pedidos = pedidos.filter(p => p.id !== id);

        res.json({ mensagem: "Pedido fechado com sucesso", id: id });
    }
);

app.listen(3001, () => {
    console.log("Servidor 2 (Pedidos) funcionando em http://localhost:3001");
});