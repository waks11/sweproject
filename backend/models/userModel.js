import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
});

export const User = mongoose.model('User', userSchema, 'Users');
