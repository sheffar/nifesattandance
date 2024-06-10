// import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { User, Login, Signup } from "./modules/users.model.js";



// Helper function to get the start and end of a specific day
const getDayRange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

// Function to find missing users
export const findMissingUsers = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const { start: sevenDaysAgoStart, end: sevenDaysAgoEnd } = getDayRange(sevenDaysAgo);
        const { start: todayStart, end: todayEnd } = getDayRange(today);

        // Fetch users recorded 7 days ago
        const sevenDaysAgoUsers = await User.find({
            createdAt: { $gte: sevenDaysAgoStart, $lte: sevenDaysAgoEnd },
        }).select('username');

        // Fetch users recorded today
        const todayUsers = await User.find({
            createdAt: { $gte: todayStart, $lte: todayEnd },
        }).select('username');

        const sevenDaysAgoUsernames = sevenDaysAgoUsers.map(user => user.username);
        const todayUsernames = todayUsers.map(user => user.username);

        // Find users recorded 7 days ago but not today
        const missingUsernames = sevenDaysAgoUsernames.filter(
            username => !todayUsernames.includes(username)
        );

        if (missingUsernames.length === 0) {
            return res.status(200).json({ message: "No absentees found." });
        }

        // Retrieve the full details of the missing users
        const missingUsers = await User.find({
            username: { $in: missingUsernames },
            createdAt: { $gte: sevenDaysAgoStart, $lte: sevenDaysAgoEnd },
        }).select('username phonenumber lodge levelinschool');

        res.status(200).json({ missingUsers });
    } catch (error) {
        res.status(400).json({ message: "An error occurred while fetching missing users" });
    }
};



//submit user info to the db 
export const submitUserInfo = async (req, res) => {
    const { username, levelinschool, lodge, phonenumber, courseofstudy, dcg, dateofbirth, gender } = req.body;

    if (!username || !levelinschool || !lodge || !phonenumber || !courseofstudy || !dcg || !dateofbirth || !gender) {
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

        return res.status(400).json({
            message: `The Attendant ${ExistingUser.username} Has Already Submitted To The Database Today`
        });
    }
    try {
        await User.create({
            username,
            levelinschool,
            lodge,
            phonenumber,
            courseofstudy,
            dcg,
            dateofbirth,
            gender

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

    let user;

    try {
        user = await Signup.findOne({ username });
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

        const data = {
            username
        }

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" })
        res.cookie("token", token)

        console.log("Login Successful");
        return res.redirect("/dashboard")
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

  

    try {
        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(`Hashed Password: ${hashedPassword}`);
        if (password !== process.env.adminPassowrd) {
            return res.status(400).json({message: `Accesss Denied, Only Authorised Admin Can  Signup`})
        }



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
    // console.log(`The token: ${token}`);
    if (!token) {

        return res.status(401).json({ message: "Unauthorized Access" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(`Token verification failed: ${err.message}`);
            return res.status(403).json({ message: "Forbidden, invalid token" });
        }
        req.user = user;
        // console.log('Token verified successfully. Proceeding to next middleware.');
        next();
    });

};

//SEARCH FOR ATTANDANT 

export const searchForAttandant = async (req, res) => {
    let { username } = req.body;

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: "Invalid username provided" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const searchuser = await User.find({
            username: { $eq: username },
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (searchuser.length === 0) {
            return res.status(400).json({ message: `The attendant ${username} has not been submitted to the database today` });
        }

        return res.status(200).json(searchuser);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(400).json({ message: `An error occurred while trying to get ${username}` });
    }
};


// GET REPORT BASED ON DATE
export const Getreport = async (req, res) => {
    // Helper function to get the start and end of a specific day
    const getDayRange = (date) => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    };

    // Helper function to get the start and end of a month
    const getMonthRange = (year, month) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);
        return { start, end };
    };
    let users = [];

    try {
        const { date, month } = req.body;

        if (month) {
            const [year, monthNumber] = month.split('-');
            const { start, end } = getMonthRange(parseInt(year), parseInt(monthNumber));
            users = await User.find({ createdAt: { $gte: start, $lte: end } });
        } else if (date) {
            const { start, end } = getDayRange(date);
            users = await User.find({ createdAt: { $gte: start, $lte: end } });
        }

        if (users.length > 0) {
            return res.status(200).json({ users });
        } else {
            return res.status(400).json({ message: ` No user was recorded on th specified date` })
        }

    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(400).json({ message: "An error occurred while fetching the users.", error });
    }
}










