import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/tipos";


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Mesas;
      await sql`INSERT INTO mesas ${sql(request,"nmesa","cotasuperior","cotainferior","idest")}`;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
      
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Mesas[]>`SELECT * FROM mesas`
      for(let mesas of response){
        let est = (await sql<Req.Establecimientos[]>`SELECT * FROM establecimientos WHERE idest=${mesas.idest}`)[0];
        mesas.est =est;
      }

      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:idmesa", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Mesas[]>`SELECT * FROM mesas WHERE idmesa = ${req.params.idmesa}`
      for(let mesas of response){
        let est = (await sql<Req.Establecimientos[]>`SELECT * FROM establecimientos WHERE idest=${mesas.idest}`)[0];
        mesas.est =est;
      }

      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:idmesa", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM mesas WHERE idmesa = ${req.params.idmesa}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:idmesa", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Mesas;
      await sql`UPDATE mesas SET ${sql(request,"nmesa","cotasuperior","cotainferior","idest")} WHERE idmesa = ${req.params.idmesa}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};
