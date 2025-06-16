import { Hono } from "hono";
import hashController from "./routes/hashRouter";

const app = new Hono();

app.get("/", (c) => c.text("KeyCryptoBox API is running"));
app.route("/", hashController);

export default app;
