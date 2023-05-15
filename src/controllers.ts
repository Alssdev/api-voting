import { Application } from "express";
import Departamentos from "./departamentos/departamentos.routes";
import Establecimientos from './establecimientos/establecimientos.routes'
import Municipios from './municipios/municipios.routes';
import  TipoCandidatos from './tipo_candidato/tipo_candidato.routes';
import  Mesas  from './mesas/mesas.routes';
import  Ciudadano  from './ciudadanos/ciudadanos.routes';
import Voluntarios from './voluntarios/voluntarios.routes';
import Partidos  from './partidos/partidos.routes';
import Candidatos from './candidatos/candidatos.routes';
import Votos  from './votos/votos.routes';
import Reportes from './reportes/reportes.routes'
import { Request, Response, NextFunction} from 'express';
import { PostgresError } from "postgres";

export default(app: Application) =>{
  app.use('/municipios', Municipios())
  app.use('/tipos_candidatos', TipoCandidatos())
  app.use('/establecimientos', Establecimientos())
  app.use('/departamentos', Departamentos())
  app.use('/mesas', Mesas())
  app.use('/ciudadanos', Ciudadano())
  app.use('/voluntarios', Voluntarios())
  app.use('/partidos', Partidos())
  app.use('/candidatos', Candidatos())
  app.use('/votos', Votos())
  app.use('/reportes', Reportes())
  // error route
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof PostgresError){
      res.status(400).json({
        code: error.code,
        column_name: error.column_name,
        constraint_name: error.constraint_name,
        message   :error.message

      })
      console.log(error);
    }else{
      res.sendStatus(500)
    }

    console.log(error);
    
  });
};