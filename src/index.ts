import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("KeyCryptoBox API is running"));

export default app;
