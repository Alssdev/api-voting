import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/tipos";

export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Voluntarios;
      await sql`INSERT INTO voluntarios ${sql(request)}`;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM voluntarios`;
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:tipo", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM voluntarios WHERE tipo = ${req.params.tipo}`;
      res.json({
        list: response
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:tipo", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM voluntarios WHERE tipo = ${req.params.tipo}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  return router;
};