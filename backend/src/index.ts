import express from "express";
import bodyParser from "body-parser";
import playerRouter from "./routes/playerRouter";
import roomRouter from "./routes/roomRouter";
import cors from "cors";
import cookieParser from "cookie-parser";
import gameRouter from "./routes/gameRouter";
import "dotenv/config";

const app = express();
const port: number = 3000;

const allowedOrigins = [
  "http://localhost:5173", // From localhost
  process.env.CLIENT_URL,
];

console.log("Allowed Origins: ", allowedOrigins);

const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/players", playerRouter);
app.use("/rooms", roomRouter);
app.use("/games", gameRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
