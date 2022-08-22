import { Router } from "express";
import { getMe, login, register } from "../controllers/authController.js";
import { checkAuth } from "../utils/checkAuth.js";
const router = new Router();

//REGISTER

router.post("/register", register);

//LOGIN

router.post("/login", login);

//GET ME

router.get("/me", checkAuth, getMe);

export default router;
