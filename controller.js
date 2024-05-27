// import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { User, Login, Signup } from "./modules/users.model.js";


// Helper function to get the start and end of last Sunday
const getLastSundayRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceSunday = (dayOfWeek + 7) % 7; // Days since the last Sunday (0 for Sunday itself)
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - daysSinceSunday);
    lastSunday.setHours(0, 0, 0, 0); // Start of the day

    const nextSunday = new Date(lastSunday);
    nextSunday.setDate(lastSunday.getDate() + 7);
    nextSunday.setHours(0, 0, 0, 0); // Start of the next Sunday

    return { start: lastSunday, end: nextSunday };
};

// Helper function to get the start and end of this Sunday
const getThisSundayRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7; // Days until the next Sunday (0 for Sunday itself)
    const thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() + daysUntilSunday);
    thisSunday.setHours(0, 0, 0, 0); // Start of the day

    const nextSunday = new Date(thisSunday);
    nextSunday.setDate(thisSunday.getDate() + 7);
    nextSunday.setHours(0, 0, 0, 0); // Start of the next Sunday

    return { start: thisSunday, end: nextSunday };
};


export const findMissingUsers = async (req, res) => {
    try {
        const { start: lastSundayStart, end: lastSundayEnd } = getLastSundayRange();
        const { start: thisSundayStart, end: thisSundayEnd } = getThisSundayRange();

        // Find users recorded last Sunday
        const lastSundayUsers = await User.find({
            createdAt: {
                $gte: lastSundayStart,
                $lt: lastSundayEnd,
            },
        });

        // Extract usernames of users recorded last Sunday
        const lastSundayUsernames = lastSundayUsers.map(user => user.username);

        // Find users recorded this Sunday
        const thisSundayUsers = await User.find({
            createdAt: {
                $gte: thisSundayStart,
                $lt: thisSundayEnd,
            },
        });

        // Extract usernames of users recorded this Sunday
        const thisSundayUsernames = thisSundayUsers.map(user => user.username);

        // Find users recorded last Sunday but not this Sunday
        const missingUsernames = lastSundayUsernames.filter(
            username => !thisSundayUsernames.includes(username)
        );

        // Retrieve the full details of the missing users
        const missingUsers = await User.find({
            username: { $in: missingUsernames },
            createdAt: {
                $gte: lastSundayStart,
                $lt: lastSundayEnd,
            },
        }).select('username phonenumber lodge levelinschool');

        res.status(200).json({ missingUsers });
    } catch (error) {
        res.status(500).json({ message: "All present" });
    }
};



//submit user info to the db 
export const submitUserInfo = async (req, res) => {
    const { username, levelinschool, lodge, phonenumber, courseofstudy } = req.body;
    // Get the input from the body and save it to the mongooes db with the created schema
    // Check if all required fields are provided

    // Log the incoming request body
    console.log("Request Body:", req.body);

    if (!username || !levelinschool || !lodge || !phonenumber || !courseofstudy) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //find a user by username
    let ExistingUser;

    try {
        ExistingUser = await User.findOne({ username })

    } catch (e) {
        console.log(e.message);
    }
    // CHECK IF NAME IS ALREADY IN THE DB
    if (ExistingUser) {
        console.log("user already exist");

        return res.status(400).json({
            message: "Attendant Already Exist With This Name"
        });
    }

    try {
        await User.create({
            username,
            levelinschool,
            lodge,
            phonenumber,
            courseofstudy

        });
        res.status(200).json({ message: "New Attendent Has Been Added To The DB" });
    } catch (e) {
        console.log(e.message);
    }

}

// LOGIN VALIDATION
export const Validatelogin = async (req, res) => {
    let { username, password } = req.body;

    try {
        const user = await Signup.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User Does Not Exist!" });
        }

        // console.log(`User found: ${user.username}, Hashed Password: ${user.password}`);
        // console.log(`Provided Password: ${password}`); // Log the provided password for debugging

        // const isPasswordCorrect = await bcrypt.compare(password, user.password); // compare the password if the username is found in the DB
        // console.log(`Password comparison result: ${isPasswordCorrect}`);

        const isPasswordCorrect = password === user.password;
        console.log(`Password comparison result: ${isPasswordCorrect}`);


        if (!isPasswordCorrect) {
            console.log("incorrect password");
            return res.status(400).json({ message: "Incorrect Password" })
        }

        console.log("Login Successful");
        return res.status(200).json({ message: "Login Successful" })
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ message: "Server error" });
    }

}

// SIGNUP VALIDATION
export const ValidateSignup = async (req, res) => {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.log("inputs  are required");
        return res.status(400).json({ message: "All fields are required" });
    }

    let newuser;

    try {
        newuser = await Signup.findOne({ email });
    } catch (e) {
        console.log(e.message)
    }

    if (newuser) {
        console.log("user already exist");
        return res.status(400).json({ message: "A User Already Exist With This Email, Login Instead" })
    }
    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(`Hashed Password: ${hashedPassword}`);

    try {
        await Signup.create({
            username,
            email,
            password: password
        })
        console.log("new user created");
        const data = { 
            email,
            username
        }
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" })
        if (typeof window !== 'undefined') {
            console.log("im setting the token " + token );
            sessionStorage.setItem("token", token)

        }

        return res.status(200).json({ message: "New User Added To Th DB", token });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: "Server error" });
    }

};

export const authenticateToken = (req, res, next) => {
    const token =  sessionStorage.getItem('token')
    // const authHeader = req.headers['authorization'];
    // console.log(token);
    // const token = authHeader && authHeader.split(' ')[1];
console.log(`the token ` + token);
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { 
        if (err) {
            return res.status(401).send('Forbidden');
        }
        req.user = user;
        next();
    });
};

