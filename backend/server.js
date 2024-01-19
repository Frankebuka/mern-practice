import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

app.listen(3000, console.log("Server is running on port 3000"));
