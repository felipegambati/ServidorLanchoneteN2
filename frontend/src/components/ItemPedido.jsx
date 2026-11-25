function ItemPedido(props) {
    return (
        <tr>
            <td>{props.codigo}</td>
            <td>{props.nome}</td>
            <td>R$ {props.preco}</td>
            <td>{props.quantidade}</td>
        </tr>
    );
}

export default ItemPedido;