import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/response";

export default(): Router =>{
  const router = Router();
  //Crear departamentos
  router.post("/", async function(req: Request, res: Response){
    try {
      //Recibir los datos 
      let request = req.body as Req.Depto;
      //Ejecutar el query
      await sql`INSERT INTO departamentos VALUES (${request.nombre})`
      //Respuesta codigo
      res.sendStatus(200);
    } catch (error) {
      //codigo error
      res.sendStatus(500);
    }
  })

  router.get("/", async function(req:Request, res: Response){
    try {
      //Tomo los datos de la base de datos
      let response = await sql`SELECT * FROM departamentos`
      //envío la respuesta en un json
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:nombre", async function(req:Request, res: Response){
    try {
      //Tomo los datos de la base de datos
      let response = await sql`SELECT * FROM departamentos WHERE nombre = ${req.params.nombre}`
      //envío la respuesta en un json
      res.json({
        list: response
      })
    } catch (error) {
      res.sendStatus(500);
      console.log(`${req.params.nombre}`);
      console.log(error);
    }
  })





  return router;
};