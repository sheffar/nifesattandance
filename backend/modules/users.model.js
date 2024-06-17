import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
            trim: true,
            lowercase: true,
            // createdAt: Date
        },
        levelinschool: {
            type: String,
            required: true
        },
        lodge: {
            type: String,
            required: true   
        },
        phonenumber: {
            type: String,
            required: true,
        }, 
        courseofstudy: {
            type: String,
            required: true
        },
        dcg:{
            type: String,
            required: true
        },
        dateofbirth: {
            type: String,
            required: true
        },
        gender:{
            type: String,
            required: true
        },
        date: {
            type: Date,
             default: Date.now
        }

    },
    { timestamps: true }, 

);

export const User = mongoose.model("Attandance", userSchema);
 

// SIGNUP MODEL
const SignupSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: [true, "Username already Exist"],
            trim: true,
            lowercase: true

        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true, 
            lowercase: true
        },
    },
    {timestamps: true}
)

export const Signup = mongoose.model("Signup", SignupSchema);



