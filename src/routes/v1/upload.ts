import { Router } from "express";
import { uploadFile, deleteFile } from "../../controllers/uploadController";
import { uploadSingleFile } from "../../middlewares/upload";

const uploadRouter = Router();

uploadRouter.post("/file", uploadSingleFile, uploadFile);

uploadRouter.delete("/delete/*", deleteFile);

export default uploadRouter;

