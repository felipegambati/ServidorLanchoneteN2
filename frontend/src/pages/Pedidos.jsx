import { useState, useEffect } from "react";
import ItemPedido from "../components/ItemPedido";

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [atualizacao, setAtualizacao] = useState(0);

    useEffect(() => {
        async function carregarPedidos() {
            try {
                const resposta = await fetch("http://localhost:3001/pedidos");
                const dados = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(dados.error || "Não foi possível consultar os pedidos.");
                }

                setPedidos(dados);

            } catch (erro) {
                setPedidos([]);
                setMensagem(erro.message);
            }
        }

        carregarPedidos();
    }, [atualizacao]);

    function atualizar() {
        setMensagem("");
        setAtualizacao(atualizacao + 1);
    }

    async function fecharPedido(id) {
        try {
            const resposta = await fetch("http://localhost:3001/pedidos/" + id + "/fechar", {
                method: "POST"
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                if (dados.erros) {
                    throw new Error(dados.erros[0].msg);
                }

                throw new Error(dados.error);
            }

            setMensagem(dados.mensagem);
            setAtualizacao(atualizacao + 1);

        } catch (erro) {
            setMensagem(erro.message);
        }
    }

    return (
        <div>
            <h2>Pedidos</h2>

            <button onClick={atualizar}>Atualizar Pedidos</button>

            <p className="mensagem">{mensagem}</p>

            {pedidos.length === 0 && <p>Nenhum pedido aberto.</p>}

            {pedidos.map((p) => (
                <div className="pedido" key={p.id}>
                    <h3>Pedido número {p.id}</h3>
                    <p>Cliente: {p.NomeCliente}</p>
                    <p>Total: R$ {p.Total}</p>

                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Produto</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                            </tr>
                        </thead>

                        <tbody>
                            {p.Itens.map((item) => (
                                <ItemPedido
                                    key={item.CodProduto}
                                    codigo={item.CodProduto}
                                    nome={item.Nome}
                                    preco={item.Preco}
                                    quantidade={item.Qtd}
                                />
                            ))}
                        </tbody>
                    </table>

                    <button onClick={() => fecharPedido(p.id)}>
                        Fechar Pedido
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Pedidos;