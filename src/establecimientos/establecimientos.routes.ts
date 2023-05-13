import {Router, Request, Response, NextFunction} from 'express';
import sql from "./../database"
import { leerMunicipio } from '../helpers/funciones';


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Establecimientos;
      await sql`INSERT INTO establecimientos ${sql(request,"nombre","idmunicipio","direccion")}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Establecimientos[]>`SELECT * FROM establecimientos ORDER BY idest`
      for(let establecimiento of response){
        let municipio = await leerMunicipio(establecimiento.idmunicipio);
        establecimiento.municipio = municipio;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get("/:idest", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Establecimientos[]>`SELECT * FROM establecimientos WHERE idest = ${req.params.idest}`
      let municipio = await leerMunicipio(response[0].idmunicipio);
      response[0].municipio = municipio;
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.delete("/:idest", async function (req: Request, res: Response, next: NextFunction) {
    try {
      await sql`DELETE FROM establecimientos WHERE idest = ${req.params.idest}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.put("/:idest", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Establecimientos;
      await sql`UPDATE establecimientos SET ${sql(request,"nombre","idmunicipio","direccion")}  WHERE idest = ${req.params.idest}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
      console.log(error);
    }
  })

  return router;
};