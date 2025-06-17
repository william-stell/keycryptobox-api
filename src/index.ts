import { Hono } from "hono";
import hashRouter from "./routes/hashRouter";
import typesRouter from "./routes/typesRouter";
import keyRouter from "./routes/keyRouter";

const app = new Hono();

app.get("/", (c) => c.text("KeyCryptoBox API is running"));
app.route("/", hashRouter);
app.route("/", typesRouter);
app.route("/", keyRouter);

export default app;
