import express from "express";
import * as company_control from "../controllers/company_controller.js";

const Router = express.Router();

Router.post("/login_company", company_control.Login_Company);

export default Router;
