import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/tipos";


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Municipios;
      await sql`INSERT INTO municipios ${sql(request, "dnombre", "nombre", "numh")}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM municipios`
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:idmunicipio", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM municipios WHERE idmunicipio = ${req.params.idmunicipio}`
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:idmunicipio", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM municipios WHERE idmunicipio = ${req.params.idmunicipio}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  return router;
};
