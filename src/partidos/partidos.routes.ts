import {Router, Request, Response, NextFunction} from 'express';
import sql from "./../database"
import { leerCiudadano} from '../helpers/funciones';


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Partidos;
      await sql`INSERT INTO partidos ${sql(request,"acronimo","idemp","logo","nombre")}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Partidos[]>`SELECT * FROM partidos  WHERE idemp is NOT NULL  ORDER BY idpartido`
      for(let partido of response){
        let ciudadano = await leerCiudadano(partido.idemp);
        partido.secretario=ciudadano;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      console.log(error);
      next(error)
    }
  })

  router.get("/:idpartido", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Partidos[]>`SELECT * FROM partidos WHERE idpartido = ${req.params.idpartido} WHERE idemp is NOT NULL`
      let ciudadano = await leerCiudadano(response[0].idemp);
      response[0].secretario=ciudadano;
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.delete("/:idpartido", async function (req: Request, res: Response, next: NextFunction) {
    try {
      await sql`DELETE FROM partidos WHERE idpartido = ${req.params.idpartido}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.put("/:idpartido", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Partidos;
      await sql`UPDATE partidos SET ${sql(request,"acronimo","idemp","logo","nombre")}  WHERE idpartido = ${req.params.idpartido
      }`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
      console.log(error);
    }
  })

  return router;
};
