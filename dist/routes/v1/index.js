"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("./admin"));
const mobile_1 = __importDefault(require("./mobile"));
const mainRouter = (0, express_1.Router)();
const defaultRoutes = [
    {
        path: "/users/admin",
        route: admin_1.default,
    },
    {
        path: "/users/mobile",
        route: mobile_1.default,
    },
];
defaultRoutes.forEach((route) => {
    mainRouter.use(route.path, route.route);
});
exports.default = mainRouter;
//# sourceMappingURL=index.js.map