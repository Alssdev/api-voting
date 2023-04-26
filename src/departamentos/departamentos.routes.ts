import { Router, Request, Response } from "express";
import sql from "./../database"

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





  return router;
};