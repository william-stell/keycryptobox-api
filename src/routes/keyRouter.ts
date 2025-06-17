import { Hono } from "hono";
import { keyControllerPost } from "../controllers/keyController";

const hashRouter = new Hono();

hashRouter.post("/key", keyControllerPost);
hashRouter.post("/key/", keyControllerPost);
hashRouter.post("/key/:keyType", keyControllerPost);


export default hashRouter;
