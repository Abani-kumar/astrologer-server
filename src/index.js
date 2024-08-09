import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/connectDb.js";
import routes from "./routes/astrologer.routes.js";
import cloudinaryConnect from "./utils/cloudinary.js";
import fileUpload from "express-fileupload";
dotenv.config({
  path: "./.env",
});

const app = express();

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", routes);

app.get("/", (req, res) => {
  return res.json({ message: "Here we go..." });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

connectDb();

cloudinaryConnect();
