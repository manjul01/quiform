
import { Router } from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { generateForm, getForm, getSubmission, getSubmittedFormData, getUserForms, submitForm } from "../controllers/form.controllers.js";



const router = new Router()

router.post("/generate-form" , verifyToken , generateForm)
router.get("/get-form" , verifyToken , getForm)
router.post("/submit-form" , verifyToken , submitForm)
router.get("/get-submitted-form" , verifyToken , getSubmittedFormData)
router.post("/get-submission" , verifyToken , getSubmission)


export default router

