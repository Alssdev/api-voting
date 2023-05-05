import { Application } from "express";
import Departamentos from "./departamentos/departamentos.routes";
import Establecimientos from './establecimientos/establecimientos.routes'
import Municipios from './municipios/municipios.routes';
import  TipoCandidatos from './tipo_candidato/tipo_candidato.routes';
import  Mesas  from './mesas/mesas.routes';
;
export default(app: Application) =>{
  app.use('/municipios', Municipios())
  app.use('/tipo_candidato', TipoCandidatos())
  app.use('/establecimientos', Establecimientos())
  app.use('/departamentos', Departamentos())
  app.use('/mesas', Mesas())
};