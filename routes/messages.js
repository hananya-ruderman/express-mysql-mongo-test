import express from "express";
import { decryptMessage, encryptMessage, listMyMessages } from "../controllers/messages.js";



const router = express.Router();

router.route("/")
    .get(listMyMessages)


router.route("/encrypt")
    .post(encryptMessage)

router.route("/decrypt")
    .post(decryptMessage)


    


export default router;

