import { useState } from "react";
import Produto from "../components/Produto";

const produtos = [
    { codigo: 1, nome: "X-Burguer", preco: 12, estoque: 10 },
    { codigo: 2, nome: "Refrigerante", preco: 5, estoque: 20 },
    { codigo: 3, nome: "Batata", preco: 8, estoque: 15 },
];

function Cardapio() {
    const [nomeCliente, setNomeCliente] = useState("");
    const [quantidades, setQuantidades] = useState({});

    function digitar(e) {
        setNomeCliente(e.target.value);
    }

    function alterarQuantidade(codigo, quantidade) {
        setQuantidades({
            ...quantidades,
            [codigo]: quantidade
        });
    }



    async function enviar(e) {
        e.preventDefault();

        if (nomeCliente.trim().length <= 5) {
            alert("Informe um nome válido.");
            return;
        }

        const itens = [];

        for (const p of produtos) {
            const qtd = Number(quantidades[p.codigo] || 0);

            if (qtd < 0 || qtd % 1 !== 0 || qtd > p.estoque) {
                alert("Quantidade inválida para " + p.nome);
                return;
            }

            if (qtd > 0) {
                itens.push({
                    CodProduto: p.codigo,
                    Qtd: qtd
                });
            }
        }

        if (itens.length === 0) {
            alert("Selecione pelo menos um produto.");
            return;
        }

        const pedido = {
            NomeCliente: nomeCliente.trim(),
            Itens: itens
        };

        try {
            const resposta = await fetch("http://localhost:3001/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            });

            if (!resposta.ok) {
                throw new Error("Não foi possível realizar o pedido.");
            }

            alert("Pedido realizado com sucesso.");
            setNomeCliente("");
            setQuantidades({});

        } catch (erro) {
            alert(erro.message);
        }
    }


    return (
        <div>
            <h2>Cardápio</h2>

            {produtos.map((p) => (
                <Produto
                    key={p.codigo}
                    codigo={p.codigo}
                    nome={p.nome}
                    preco={p.preco}
                    estoque={p.estoque}
                    quantidade={quantidades[p.codigo] || 0}
                    aoAlterarQuantidade={alterarQuantidade}
                />
            ))}

            <form onSubmit={enviar}>
                <h2>Cliente</h2>

                <input
                    value={nomeCliente}
                    onChange={digitar}
                />

                <p>Cliente: {nomeCliente}</p>

                <button type="submit">Enviar Pedido</button>
            </form>
        </div>
    );
}

export default Cardapio;