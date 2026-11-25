const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/pedidos", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(3000, () => {
    console.log("Servidor 1 funcionando em http://localhost:3000");
});