import { Application } from "express";
import Departamentos from "./departamentos/departamentos.routes";
import Municipios from './municipios/municipios.routes';
import  TipoCandidatos from './tipo_candidato/tipo_candidato.routes';
export default(app: Application) =>{
  app.use('/departamentos', Departamentos())
  app.use('/municipios', Municipios())
  app.use('/tipo_candidato', TipoCandidatos())
};