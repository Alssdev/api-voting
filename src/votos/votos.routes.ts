import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/tipos";


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Votos;
      await sql`INSERT INTO votos ${sql(request)}`;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
      
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM votos`
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500); 
    }
  })

  router.get("/:idpartido/:nmesa/:tipo", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM votos 
                              WHERE idpartido = ${req.params.idpartido} AND nmesa = ${req.params.nmesa} AND tipo =${req.params.tipo} `
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:idpartido/:nmesa/:tipo", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM votos 
      WHERE idpartido = ${req.params.idpartido} AND nmesa = ${req.params.nmesa} AND tipo =${req.params.tipo} `;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:idpartido/:nmesa/:tipo", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Votos;
      await sql`UPDATE votos SET ${sql(request,"cantidad")}                               
      WHERE idpartido = ${req.params.idpartido} AND nmesa = ${req.params.nmesa} AND tipo =${req.params.tipo}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};
