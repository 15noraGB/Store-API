import * as express from "express";
import * as path from "path";
import productRoutes from "./endpoints/products";

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;



app.get('/', (req, res) => {
  res.send('querida!');
});



app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
