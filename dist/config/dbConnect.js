"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mongoUrl = process?.env?.MONGO_URI;
if (!mongoUrl) {
    throw new Error("mongoUrl is required");
}
const dbConnect = async () => {
    try {
        await mongoose_1.default.connect(mongoUrl);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Error In Connecting", error);
        process.exit(1);
    }
};
exports.default = dbConnect;
//# sourceMappingURL=dbConnect.js.map