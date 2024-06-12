import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { submitUserInfo, Validatelogin, ValidateSignup, findMissingUsers, authenticateToken, getcurrentusers, searchForAttandant, Getreport } from "./controller.js";
const router = express.Router()

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to serve the dashboard page, and protected by authenticateToken
router.get("/dashboard", authenticateToken, (req, res) => { 
    res.sendFile(path.join(__dirname, '../public', 'Dashboard.html'));
});

//Middleware to serve the signup page
router.get("/signR", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
}); 


router.post("/submit", submitUserInfo);//TO SUBMIT ATTANDENT INFO
router.post("/Adsentees", findMissingUsers);//TO GET ABSEBTEES
router.post("/login", authenticateToken, Validatelogin)// FOR  LOGIN
router.post("/signup", ValidateSignup);//TO CREATE NEW  ADMIN
router.get("/getcurrentusers", getcurrentusers)//TO GET ATTENDANCE FOR THAT DAY
router.post("/searchForAttandant", searchForAttandant)
router.post("/getReport", Getreport)// GET ATTENDACES BASED ON INPUTED DATE



export default router