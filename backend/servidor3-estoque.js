constexpress= require("express");
constapp = express();

app.use(express.json());

let estoque = [
  {CodProduto: 1, NomeProduto: "Hamburguer do Jacquin", Estoque: 5 },
  {CodProduto: 2, NomeProduto: "Refrigerante Pepsi-Cola de 350ml", Estoque: 9,},
  {CodProduto: 3, NomeProduto: "Batatinha do Fogaça", Estoque: 7 },
];

app.get("/estoque", (req, res) => {
  res.json(estoque);
});

app.post("/baixa", (req, res) => {
  const itens = req.body;

    for (const item of itens) {
        const produto = estoque.find(p => p.CodProduto === item.CodProduto);
        if (produto) {
            if (produto.Estoque >= item.Quantidade) {
                produto.Estoque -= item.Quantidade;
            } else {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.NomeProduto}.` });
            }
        }
    }
    res.json(estoque);
});

app.post('/reposicao',Cardapio,validar,(req,res)=>{
res.status(201).json(matchedData(req)).
json({ error: "A lista de itens encontrada é inválida." });;
});

app.listen(3002, () => {
  console.log("O Servidor 3 (Estoque) está funcionando em http://localhost:3002",);
  });