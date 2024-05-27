import express from "express";
import path from 'path';
import { submitUserInfo, Validatelogin, ValidateSignup, findMissingUsers, authenticateToken } from "./controller.js";
const router = express.Router()


// Middleware to serve the dashboard page, protected by authenticateToken
router.get("/dashboard", authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Dashboard.html'));
});

router.post("/submit", submitUserInfo);//TO SUBMIT ATTANDENT INFO
router.post("/Adsentees", findMissingUsers);//To get absentees
router.post("/login", Validatelogin)// FOR ADMIN LOGIN
router.post("/signup", ValidateSignup);//TO CREATE NEW  ADMIN



export default router