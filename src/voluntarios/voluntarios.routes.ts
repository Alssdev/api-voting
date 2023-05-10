import { Router, Request, Response } from "express";
import sql from "./../database"
import { leerCiudadano, leerMesa } from '../helpers/funciones';

export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Voluntarios;
      await sql`INSERT INTO voluntarios ${sql(request,"idemp","idmesa","tipo")}`;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Voluntarios[]>`SELECT * FROM voluntarios ORDER BY idemp`;
      for(let voluntario of response){
        let ciudadano = await leerCiudadano(voluntario.idemp);
        let mesa = await leerMesa(voluntario.idmesa)
        voluntario.ciudadano=ciudadano;
        voluntario.mesa= mesa;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      
      res.sendStatus(500);
    }
  })

  router.get("/:idemp", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM voluntarios WHERE idemp = ${req.params.idemp}`;
      let ciudadano = await leerCiudadano(response[0].idemp);
      let mesa = await leerMesa(response[0].idmesa)
      response[0].ciudadano=ciudadano;
      response[0].mesa= mesa;
      res.json({
        list: response
      })
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

  router.get("/:idmesa/mesa", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Voluntarios[]>`SELECT * FROM voluntarios WHERE idmesa = ${req.params.idmesa} ORDER BY idemp`;
      for(let voluntario of response){
        let ciudadano = await leerCiudadano(voluntario.idemp);
        let mesa = await leerMesa(voluntario.idmesa)
        voluntario.ciudadano=ciudadano;
        voluntario.mesa= mesa;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      
      res.sendStatus(500);
    }
  })

  router.delete("/:idemp", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM voluntarios WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:idemp", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Voluntarios;
      await sql`UPDATE voluntarios SET ${sql(request,"idmesa","tipo")}  WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};