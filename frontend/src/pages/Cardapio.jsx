
import { useState, useEffect } from "react";
import Produto from "../components/Produto";

function Cardapio() {
    const [produtos, setProdutos] = useState([]);
    const [nomeCliente, setNomeCliente] = useState("");
    const [quantidades, setQuantidades] = useState({});
    const [mensagem, setMensagem] = useState("");
    const [atualizacao, setAtualizacao] = useState(0);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const resposta = await fetch("http://localhost:3001/produtos");
                const dados = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(dados.error);
                }

                setProdutos(dados);

            } catch (erro) {
                setProdutos([]);
                setMensagem(erro.message);
            }
        }

        carregarProdutos();
    }, [atualizacao]);

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

        if (enviando) {
            return;
        }

        const itens = [];

        for (const p of produtos) {
            const qtd = Number(quantidades[p.codigo] || 0);

            if (qtd > 0) {
                itens.push({
                    CodProduto: p.codigo,
                    Qtd: qtd
                });
            }
        }

        const pedido = {
            NomeCliente: nomeCliente.trim(),
            Itens: itens
        };

        setEnviando(true);

        try {
            const resposta = await fetch("http://localhost:3001/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedido)
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                if (dados.erros) {
                    throw new Error(dados.erros[0].msg);
                }

                throw new Error(dados.error);
            }

            setMensagem("Pedido realizado com sucesso.");
            setNomeCliente("");
            setQuantidades({});
            setAtualizacao(atualizacao + 1);

        } catch (erro) {
            setMensagem(erro.message);
        }

        setEnviando(false);
    }

    return (
        <div>
            <h2>Cardápio</h2>

            <form onSubmit={enviar}>
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

                <div className="cliente">
                    <h2>Cliente</h2>

                    <label htmlFor="nomeCliente">Nome do cliente: </label>

                    <input
                        type="text"
                        id="nomeCliente"
                        value={nomeCliente}
                        onChange={digitar}
                    />

                    <p>Cliente: {nomeCliente}</p>

                    <button type="submit" disabled={enviando || produtos.length === 0}>
                        Enviar Pedido
                    </button>
                </div>
            </form>

            <p className="mensagem">{mensagem}</p>
        </div>
    );
}

export default Cardapio;