import { Hono } from "hono";
import { typesControllerGet } from "../controllers/typesController";

const router = new Hono();

router.get("/types", typesControllerGet);

export default router;
