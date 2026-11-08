import "dotenv/config";

import express from "express";

import cors from "cors";
import { fileURLToPath } from "node:url";


import connectDB
    from "./config/mongodb.js";


import userRouter
    from "./routes/userRoute.js";

import doctorRouter
    from "./routes/doctorRoute.js";

import adminRouter
    from "./routes/adminRoute.js";



// App config

const app =
    express();

const port =
    process.env.PORT ||
    4000;


// Database

connectDB();


// Middlewares

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    cors()
);

app.use(
    "/uploads",
    express.static(fileURLToPath(new URL("./uploads/", import.meta.url)))
);


// API endpoints

app.use(
    "/api/user",
    userRouter
);

app.use(
    "/api/admin",
    adminRouter
);

app.use(
    "/api/doctor",
    doctorRouter
);


// Test API

app.get(
    "/",
    (req, res) => {

        res.send(
            "API Working"
        );
    }
);


// Start server

app.listen(
    port,
    () => {

        console.log(
            `Server started on PORT:${port}`
        );
    }
);