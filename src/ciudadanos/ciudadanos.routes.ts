import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/tipos";

export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Ciudadano;
      await sql`INSERT INTO ciudadanos ${sql(request, "nombres","apellidos","dpi","idmunicipio","direccion")}`;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM ciudadanos`;
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:idemp", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM ciudadanos WHERE idemp = ${req.params.idemp}`;
      res.json({
        list: response
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:idemp", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM ciudadanos  WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:idemp", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Ciudadano;
      await sql`UPDATE ciudadanos SET${sql(request, "nombres","apellidos","direccion","dpi","idmunicipio")}  WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  return router;
};