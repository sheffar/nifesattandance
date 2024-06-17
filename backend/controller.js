import jwt from "jsonwebtoken"
import { User, Signup } from "./modules/users.model.js";



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
            date: { $gte: sevenDaysAgoStart, $lte: sevenDaysAgoEnd },
        }).select('username');

        // Fetch users recorded today
        const todayUsers = await User.find({
            date: { $gte: todayStart, $lte: todayEnd },
        }).select('username');

        const sevenDaysAgoUsernames = sevenDaysAgoUsers.map(user => user.username);
        const todayUsernames = todayUsers.map(user => user.username);

        // Find users recorded 7 days ago but not today
        const missingUsernames = sevenDaysAgoUsernames.filter(
            username => !todayUsernames.includes(username)
        );

        if (missingUsernames.length === 0) {
            return res.status(400).json({ message: "No absentees found." });
        } 

        // Retrieve the full details of the missing users
        const missingUsers = await User.find({
            username: { $in: missingUsernames },
            date: { $gte: sevenDaysAgoStart, $lte: sevenDaysAgoEnd },
        }).select('username phonenumber lodge levelinschool gender');

        return res.status(200).json({ missingUsers });
    } catch (error) {
        res.status(400).json({ message: "An error occurred while fetching missing users" });
    }
};


//submit user info to the db 
// export const submitUserInfo = async (req, res) => {
//     const { username, levelinschool, lodge, phonenumber, courseofstudy, dcg, dateofbirth, gender, } = req.body;
//     // console.log(submissiondate.req.body);

//     if (!username || !levelinschool || !lodge || !phonenumber || !courseofstudy || !dcg || !dateofbirth || !gender) {
//         return res.status(400).json({ message: "All fields are required" });
        
//     }

//     // Use the provided submissio n date or default to the current date
//     // const dateToUse = submissiondate ? new Date(submissiondate) : new Date();

//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);
 

//     let ExistingUser;

//     try {
//         ExistingUser = await User.findOne({
//             username,
//             date: { 
//                 $gte: startOfDay,
//                 $lte: endOfDay
//             }
//         }) 
 
//     } catch (e) {
//         return res.status(400).json({ message: "Error occured while verifiying if user has been added to the database" })
//     }
//     // CHECK IF NAME IS ALREADY IN THE DB
//     if (ExistingUser) {
//         console.log(` The Attendant ${ExistingUser.username} Has Already Been Submitted To The Database Today`);

//         return res.status(400).json({
//             message: `The Attendant ${ExistingUser.username} Has Already Been Submitted To The Database Today`
//         });
//     }
//     try {
//         await User.create({
//             username,
//             levelinschool,
//             lodge,
//             phonenumber,
//             courseofstudy,
//             dcg,
//             dateofbirth,
//             gender,
//             // date:dateToUse
//             date
  
//         });  

//         return res.status(200).json({ message: "New Attendent Has Been Added To The DB" });

//     } catch (e) {

//         return res.status(400).json({ message: "Error Occured While Trying To Save UserInfo" });

//     }
 
// } 

export const submitUserInfo = async (req, res) => {
    const { username, levelinschool, lodge, phonenumber, courseofstudy, dcg, dateofbirth, gender, Submitdate } = req.body;
    console.log( `Date from the frontend ${Submitdate}` );
 
    if (!username || !levelinschool || !lodge || !phonenumber || !courseofstudy || !dcg || !dateofbirth || !gender) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const submissionDate = new Date(Submitdate);
    const startOfDay = new Date(submissionDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(submissionDate);
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
        return res.status(400).json({ message: "Error occured while verifiying if user has been added to the database" })
    }
    // CHECK IF NAME IS ALREADY IN THE DB
    if (ExistingUser) {
        const datePart = submissionDate.toISOString().split('T')[0];
        
        return res.status(400).json({
            message: `The Attendant ${ExistingUser.username} Has Already Been Submitted To The Database On ${datePart}`
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
            gender,
            date: submissionDate
        });
        return res.status(200).json({ message: "New Attendent Has Been Added To The DB" });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ message: "Error Occured While Trying To Save UserInfo", e });
    }
}

// LOGIN VALIDATION
export const Validatelogin = async (req, res) => {
    let { username, password } = req.body;

    let user;

    try {
        user = await Signup.findOne({ username:  { $regex: new RegExp(`^${username}$`, 'i') }  });
        if (!user) {
            return res.status(400).json({ message: "User Does Not Exist!" });
        }



        const isPasswordCorrect = password.toLowerCase() === user.password.toLowerCase();
        console.log(`Password comparison result: ${isPasswordCorrect}`);



        if (!isPasswordCorrect) {
            console.log("incorrect password");
            return res.status(400).json({ message: "Incorrect Password" })
        }

      

        const data = {
            username    
        };

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token);
        console.log(`the token during sign up${token}`); 

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
        return res.status(400).json({ message: "All fields are required" });
    }

    let newuser;

    try {
        newuser = await Signup.findOne({ 
            $or: [
                { username },
                { email }
            ]
        });
    } catch (e) {
        res.status(400).json({ message: `Sever Error occured while tryng to validate if User already exist` })
    }

    if (newuser) {
        return res.status(400).json({ message: "A User Already Exist With This Email or username, Login Instead" })
    }



    try {
        if (password !== process.env.adminPassowrd) {
            return res.status(400).json({ message: `Accesss Denied, Only Authorised Admin Can  Signup` })
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

        return res.status(200).json({ message: "Sign up successful" });

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
        }).sort({ date: -1 });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "An Error Occured" })
    }
    if (!allUsers) {
        return res.status(400).json({ message: "No user found" })
    }
    res.status(200).json(allUsers);
    // console.log(allUsers);
}

// FUNCTION TO PROTECT ROUTE
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {

        return res.status(401).json({ message: "Unauthorized Access" });
    }


    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(`Token verification failed: ${err.message}`);
            return res.status(403).json({ message: "Create an account" });
        }
        req.user = user;
        next();
    });

};


//SEARCH FOR ATTANDANT 

export const searchForAttandant = async (req, res) => {
    let { username } = req.body;
    // let Uname=  username.toLowerCase()

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: "Invalid username provided" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const searchuser = await User.find({
            username: { $eq: username, $options: "i" },
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (searchuser.length === 0) {
            return res.status(400).json({ message: `The attendant ${username} has not been submitted to the database today` });
        }

        return res.status(200).json(searchuser);
    } catch (error) {
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
            users = await User.find({ date: { $gte: start, $lte: end } }).exec();
        } else if (date) {
            const { start, end } = getDayRange(date);
            users = await User.find({ date: { $gte: start, $lte: end } }).exec();
        }
 
        if (users.length > 0) {
            return res.status(200).json({ users });
        }

        return res.status(400).json({ message: `No user was recorded on the specified date` });





    } catch (error) {// catch any sever error
        return res.status(500).json({ message: "An error occured trying to get info from the database" });
    }
}
 


 


 



