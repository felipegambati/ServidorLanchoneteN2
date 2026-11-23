const express = require('express');
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get('/paginas', (req, res) => {
  res.send('Servidor 1 rodando com sucesso!');
});

app.listen(3000, () => {
  console.log('Servidor 1 funcionando em http://localhost:3000');
});