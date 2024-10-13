require('dotenv').config()

const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: "https://localhost:3000"
};

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.json({mssg: 'Welcome'})
});

app.listen(process.env.PORT, () => {
    console.log("listening on port", process.env.PORT)
});