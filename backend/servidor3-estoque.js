const express = require("express");
const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.json());

let estoque = [
    { CodProduto: 1, NomeProduto: "Hamburguer do Jacquin", Estoque: 5 },
    { CodProduto: 2, NomeProduto: "Refrigerante Pepsi-Cola de 350ml", Estoque: 9 },
    { CodProduto: 3, NomeProduto: "Batatinha do Fogaça", Estoque: 7 },
];

function validar(req, res, next) {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({ erros: erros.array() });
    }

    next();
}

app.get("/estoque", (req, res) => {
    res.json(estoque);
});

app.post("/baixa",
    body("Itens").custom((itens) => {
        if (!Array.isArray(itens) || itens.length === 0) {
            throw new Error("A lista de itens é inválida.");
        }

        const codigos = [];

        for (const item of itens) {
            if (!item || !Number.isInteger(item.CodProduto) || item.CodProduto <= 0) {
                throw new Error("Código do produto inválido.");
            }

            if (typeof item.Estoque !== "number" || !Number.isFinite(item.Estoque) || item.Estoque <= 0) {
                throw new Error("Quantidade inválida.");
            }

            const produto = estoque.find(p => p.CodProduto === item.CodProduto);

            if (!produto) {
                throw new Error("Produto não encontrado.");
            }

            if (codigos.includes(item.CodProduto)) {
                throw new Error("Produto repetido na lista.");
            }

            codigos.push(item.CodProduto);

            if (produto.Estoque < item.Estoque) {
                throw new Error("Estoque insuficiente para " + produto.NomeProduto);
            }
        }

        return true;
    }),
    validar,
    (req, res) => {
        const itens = req.body.Itens;

        for (const item of itens) {
            const produto = estoque.find(p => p.CodProduto === item.CodProduto);
            produto.Estoque -= item.Estoque;
        }

        res.json(estoque);
    }
);

app.post("/reposicao",
    body("Itens").custom((itens) => {
        if (!Array.isArray(itens) || itens.length === 0) {
            throw new Error("A lista de itens é inválida.");
        }

        for (const item of itens) {
            if (!item || !Number.isInteger(item.CodProduto) || item.CodProduto <= 0) {
                throw new Error("Código do produto inválido.");
            }

            if (typeof item.Quantidade !== "number" || !Number.isFinite(item.Quantidade) || item.Quantidade <= 0) {
                throw new Error("Quantidade inválida.");
            }

            const produto = estoque.find(p => p.CodProduto === item.CodProduto);

            if (!produto) {
                throw new Error("Produto não encontrado.");
            }
        }

        return true;
    }),
    validar,
    (req, res) => {
        const itens = req.body.Itens;

        for (const item of itens) {
            const produto = estoque.find(p => p.CodProduto === item.CodProduto);
            produto.Estoque += item.Quantidade;
        }

        res.json(estoque);
    }
);

app.listen(3002, () => {
    console.log("O Servidor 3 (Estoque) está funcionando em http://localhost:3002");
});