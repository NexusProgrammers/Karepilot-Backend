import { Router } from "express";
import adminRouter from "./admin";
import mobileRouter from "./mobile";
const mainRouter = Router();
const defaultRoutes = [
    {
        path: "/users/admin",
        route: adminRouter,
    },
    {
        path: "/users/mobile",
        route: mobileRouter,
    },
];
defaultRoutes.forEach((route) => {
    mainRouter.use(route.path, route.route);
});
export default mainRouter;
//# sourceMappingURL=index.js.map