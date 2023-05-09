import { Router, Request, Response } from "express";
import sql from "./../database"
import { leerCiudadano} from '../helpers/funciones';


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Partidos;
      await sql`INSERT INTO partidos ${sql(request,"acronimo","idemp","logo","nombre")}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Partidos[]>`SELECT * FROM partidos`
      for(let partido of response){
        let ciudadano = await leerCiudadano(partido.idemp);
        partido.secretario=ciudadano;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

  router.get("/:idpartido", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Partidos[]>`SELECT * FROM partidos WHERE idpartido = ${req.params.idpartido}`
      let ciudadano = await leerCiudadano(response[0].idemp);
      response[0].secretario=ciudadano;
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:idpartido", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM partidos WHERE idpartido = ${req.params.idpartido}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:idpartido", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Partidos;
      await sql`UPDATE partidos SET ${sql(request,"acronimo","idemp","logo","nombre")}  WHERE idpartido = ${req.params.idpartido
      }`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};
