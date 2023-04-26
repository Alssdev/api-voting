import { Application } from "express";
import Departamentos from "./departamentos/departamentos.routes";
export default(app: Application) =>{
  app.use('/departamentos', Departamentos())
};