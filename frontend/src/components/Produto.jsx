function Produto(props) {

    function alterarQuantidade(e) {
        props.aoAlterarQuantidade(props.codigo, e.target.value);
    }

    return (
        <div className="produto">
            <p>Código: {props.codigo}</p>
            <h3>{props.nome}</h3>
            <p>Preço: R$ {props.preco}</p>
            <p>Estoque: {props.estoque}</p>

            <label>
                Quantidade:{" "}
                <input
                    type="number"
                    min="0"
                    max={props.estoque}
                    step="any"
                    value={props.quantidade}
                    onChange={alterarQuantidade}
                />
            </label>

            <p>Quantidade selecionada: {props.quantidade}</p>
        </div>
    );
}

export default Produto;