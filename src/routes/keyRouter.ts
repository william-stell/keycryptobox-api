import { Hono } from "hono";
import {
  keyControllerPost,
  keyControllerSignPost,
  keyControllerVerifyPost,
} from "../controllers/keyController";

const hashRouter = new Hono();

hashRouter.post("/key", keyControllerPost);
hashRouter.post("/key/", keyControllerPost);
hashRouter.post("/key/:keyType", keyControllerPost);

hashRouter.post("/key/:keyType/sign", keyControllerSignPost);
hashRouter.post("/key/:keyType/verify", keyControllerVerifyPost);

export default hashRouter;
