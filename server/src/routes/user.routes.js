import { Router } from "express";
import { getUserDetails, logout, userLogin, userSignup } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { getUserForms } from "../controllers/form.controllers.js";

const router = new Router()

router.post("/login" , userLogin);
router.post("/signup" , userSignup);
router.post("/logout", verifyToken , logout);
router.get("/user-info", verifyToken , getUserDetails);
router.get("/forms-by-user" , verifyToken , getUserForms)
export default router

