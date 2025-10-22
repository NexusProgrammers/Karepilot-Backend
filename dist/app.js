"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const v1_1 = __importDefault(require("./routes/v1"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.options("*", (0, cors_1.default)());
const port = Number(process.env.PORT) || 8000;
app.get("/", (req, res) => {
    res.send("Api Running");
});
(0, dbConnect_1.default)();
app.use("/api/v1", v1_1.default);
app.use((req, res, next) => {
    const error = new Error("Not Found");
    next(error);
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=app.js.map