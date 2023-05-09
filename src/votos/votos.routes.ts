import { Router, Request, Response } from "express";
import sql from "./../database"
import {  leerMunicipio,  leerCiudadano, leerMesa , leerTipoCandidato, leerPartido} from '../helpers/funciones';


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Votos;
      await sql`INSERT INTO votos ${sql(request, "idpartido","idmesa","tipo","cantidad")}`;
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
      
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Votos[]>`SELECT * FROM votos ORDER BY idmesa`
      for(let votos of response){
        let partido = await leerPartido(votos.idpartido);
        let mesa = await leerMesa(votos.idmesa);
        let tipo = await leerTipoCandidato(votos.tipo);
        votos.partido = partido;
        votos.mesa = mesa;
        votos.tipoCandidato = tipo;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500); 
    }
  })

  router.get("/:idpartido/:idmesa/:tipo", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Votos[]>`SELECT * FROM votos 
                              WHERE idpartido = ${req.params.idpartido} AND idmesa = ${req.params.idmesa} AND tipo =${req.params.tipo} `
      let partido = await leerPartido(response[0].idpartido);
      let mesa = await leerMesa(response[0].idmesa);
      let tipo = await leerTipoCandidato(response[0].tipo);
      response[0].partido = partido;
      response[0].mesa = mesa;
      response[0].tipoCandidato = tipo;
      res.json({
        list: response,
      })
    } catch (error) {
      console.log(error)
      res.sendStatus(500);
    }
  })

  router.delete("/:idpartido/:idmesa/:tipo", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM votos 
      WHERE idpartido = ${req.params.idpartido} AND idmesa = ${req.params.idmesa} AND tipo =${req.params.tipo} `;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:idpartido/:idmesa/:tipo", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Votos;
      await sql`UPDATE votos SET ${sql(request,"cantidad")}                               
      WHERE idpartido = ${req.params.idpartido} AND idmesa = ${req.params.idmesa} AND tipo =${req.params.tipo}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};
