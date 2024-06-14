import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "user name is required"],
            trim: true,
            lowercase: true,
            createdAt: Date
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
            required: true
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


// LOGIN MODEL
const LoginSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            lowercase: true

        }

    });

export const Login = mongoose.model("login", LoginSchema);


// SIGNUP MODEL
const SignupSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
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



