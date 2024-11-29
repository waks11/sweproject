import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@(.*\.)?ufl\.edu$/.test(value); // for now just a simple check that makes sure its ufl.edu or some uf-affiliated domain like @shands.ufl.edu
            },
            message: "Invalid Email",
        },
    },
    password: { type: String, required: true } ,
    admin: { type: Boolean, default: false },
    goodStanding: { type: Boolean, default: true },
    score: { type: Number, default: 0 },
    numOfRatings: { type: Number, default: 0 }
});

export const User = mongoose.model('Users', userSchema, 'Users');
