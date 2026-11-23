function Produto(props) {

    function alterarQuantidade(e) {
        props.aoAlterarQuantidade(props.codigo, e.target.value);
    }

    return (
        <div>
            <p>Código: {props.codigo}</p>
            <h3>{props.nome}</h3>
            <p>Preço: R$ {props.preco}</p>
            <p>Estoque: {props.estoque}</p>

            <input
                type="number"
                min="0"
                max={props.estoque}
                value={props.quantidade}
                onChange={alterarQuantidade}
            />

            <p>Quantidade selecionada: {props.quantidade}</p>
        </div>
    );
}

export default Produto;