import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import ExpressMongoSanitize from "express-mongo-sanitize";
import dbConnect from "./config/dbConnect";
import mainRouter from "./routes/v1";
config();
const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(ExpressMongoSanitize());
app.options("*", cors());
const port = Number(process.env.PORT) || 8000;
app.get("/", (req, res) => {
    res.send("Api Running");
});
dbConnect();
app.use("/api/v1", mainRouter);
app.use((req, res, next) => {
    const error = new Error("Not Found");
    next(error);
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=app.js.map