import 'dotenv/config';
import cors from 'cors';

import express from "express";
import studentRouter from "./routes/studentRouter.js";
const app = express();

/* Parse 'application/json': Allows express to read json body objects */
app.use(express.json());

/* parse 'application/urlencoded': allows express to read submitted form objects */
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/students", studentRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening");
});
