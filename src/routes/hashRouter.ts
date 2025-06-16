import { Hono } from "hono";
import { hashControllerPost } from "../controllers/hashController";

const hashRouter = new Hono();

hashRouter.post("/hash/:hashType", hashControllerPost);

export default hashRouter;
