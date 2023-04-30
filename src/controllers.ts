import { Application } from "express";
import Departamentos from "./departamentos/departamentos.routes";
import Municipios from './municipios/municipios.routes';
export default(app: Application) =>{
  app.use('/departamentos', Departamentos())
  app.use('/municipios', Municipios())
};