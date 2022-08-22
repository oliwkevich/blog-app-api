import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

//Import Routes
import authRoute from "./routes/authRoutes.js";
import postRoute from "./routes/PostRoutes.js";
import commentRoute from "./routes/CommentRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static("uploads"));
dotenv.config();

async function start() {
  try {
    await mongoose.connect(process.env.DB);

    app.listen(process.env.PORT, () => {
      console.log(
        `Server started\n\Port: localhost:${process.env.PORT}\n\DB connect: successfull`
      );
    });
  } catch (error) {
    console.log(`Server NOT started\n\DB connect: ERROR  ↓↓↓\n\n`, error);
  }
}

start();

//Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
