import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/tipos";

export default (): Router => {
  const router = Router();
  //Crear departamentos
  router.post("/", async function (req: Request, res: Response) {
    try {
      //Recibir los datos 
      let request = req.body as Req.Depto;
      //Ejecutar el query
      await sql`INSERT INTO departamentos VALUES ${sql(request, "nombre")}`;
      //Respuesta codigo
      res.sendStatus(200);
    } catch (error) {
      //codigo error
      res.sendStatus(500);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      //Tomo los datos de la base de datos
      let response = await sql`SELECT * FROM departamentos`;
      //envío la respuesta en un json
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:iddep", async function (req: Request, res: Response) {
    try {
      //Tomo los datos de la base de datos
      let response = await sql`SELECT * FROM departamentos WHERE iddep = ${req.params.iddep}`;
      //envío la respuesta en un json
      res.json({
        list: response
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:iddep", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM departamentos WHERE iddep = ${req.params.iddep}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:iddep", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Depto;
      await sql`UPDATE departamentos SET ${sql(request,"nombre")}  WHERE iddep = ${req.params.iddep}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  return router;
};