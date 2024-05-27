import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "user name is required"],
            trim: true,
        },
        levelinschool: {
            type: Number,
            required: true
        },
        lodge: {
            type: String,
            required: true
        },
        phonenumber: {
            type: Number,
            required: true
        },
        courseofstudy: {
            type: String,
            required: true
        }
    },
    {

        timestamps: true
    }
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
        }
    },
    {

        timestamps: true
    }
)

export const Signup = mongoose.model("Signup", SignupSchema);



