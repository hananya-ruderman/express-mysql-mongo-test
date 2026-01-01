import express from "express";
import { myProfile } from "../controllers/users.js";



const router = express.Router();

router.route("/me")
    .get(myProfile)


    


export default router;

