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
;
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
};