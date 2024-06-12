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
    
 
router.post("/submit", submitUserInfo);//Submit attandant info

router.post("/Adsentees", findMissingUsers);//Get all absentee

router.post("/login", authenticateToken, Validatelogin)// Login route

router.post("/signup", ValidateSignup);//Sign up 

router.get("/getcurrentusers", getcurrentusers)//Get all attandant for that day 

router.post("/searchForAttandant", searchForAttandant)//Search for attandant

router.post("/getReport", Getreport)// Get absentee based on inputed date



export default router