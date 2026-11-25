import { Routes, Route, Link } from "react-router-dom";
import Cardapio from "./pages/Cardapio";
import Pedidos from "./pages/Pedidos";
import "./App.css";

function App() {
    return (
        <div>
            <header>
                <h1>Lanchonete</h1>

                <nav>
                    <Link to="/">Cardápio</Link>
                    {" | "}
                    <Link to="/pedidos">Pedidos</Link>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Cardapio />} />
                    <Route path="/pedidos" element={<Pedidos />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;