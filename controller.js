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

    if (!username || !levelinschool || !lodge || !phonenumber || !courseofstudy) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    let ExistingUser;

    try {
        ExistingUser = await User.findOne({
            username,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

    } catch (e) {
        console.log(e.message);
        res.status(400).json({ message: "Sever Error" })
    }
    // CHECK IF NAME IS ALREADY IN THE DB
    if (ExistingUser) {
        console.log(` The Attendant ${ExistingUser.username} Has Already Submitted To The Database Today`);

        return res.status(400).json({ message: `The Attendant ${ExistingUser.username} Has Already Submitted To The Database Today`
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
        res.status(400).json({ message: "Server error" });
    }

}

// LOGIN VALIDATION
export const Validatelogin = async (req, res) => {
    let { username, password } = req.body;

    // let user;

    try {
        const user = await Signup.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User Does Not Exist!" });
        }


        // const isPasswordCorrect = await bcrypt.compare(password, user.password); // compare the password if the username is found in the DB
        // console.log(`Password comparison result: ${isPasswordCorrect}`);

        const isPasswordCorrect = password === user.password;
        console.log(`Password comparison result: ${isPasswordCorrect}`);



        if (!isPasswordCorrect) {
            console.log("incorrect password");
            return res.status(400).json({ message: "Incorrect Password" })
        }

        console.log("Login Successful");
        res.redirect("/dashboard")
    } catch (e) {
        console.log(e.message);
        res.status(400).json({ message: "Server error" });
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
        console.log("Email already exist, login instead");
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

        console.log("A new user has been created");

        const data = {
            username,
            email
        }
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" })
        res.cookie("token", token)
        console.log(`This ${token} has been saved in the cookies`);

        return res.status(200).json({ message: "New User Added To Th DB" });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ message: "Server error" });
    }

};

// Getcurrentusers
export const getcurrentusers = async (req, res) => {

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let allUsers;
    try {
        allUsers = await User.find({
           
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "An Error Occured" })
    }
    if (!allUsers) {
        return res.status(400).json({ message: "No user found" })
    }
    res.status(200).json(allUsers);
    console.log(allUsers);
}

// FUNCTION TO PROTECT ROUTE
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token
    console.log(`The token: ${token}`);
    if (!token) {
        console.log(`No token found. Unauthorized`);
        return res.status(401).json({ message: "Unauthorized Access" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(`Token verification failed: ${err.message}`);
            return res.status(403).json({ message: "Forbidden, invalid token" });
        }
        req.user = user;
        console.log('Token verified successfully. Proceeding to next middleware.');
        next();
    });

};

