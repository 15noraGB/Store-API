import "dotenv/config";
import express from "express";
import path from "path";

import productRoutes from "./endpoints/products";
import usersRoutes from "./endpoints/users";

const app = express();
const port = parseInt(process.env.PORT || "8080");

// Middlewares
app.use(express.json());

// Rutas API
app.use("/api/products", productRoutes);
app.use("/api/users", usersRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API Tienda Online funcionando");
});

// Servidor
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
