import { Router, Request, Response } from "express";
import sql from "./../database"
import {  leerMunicipio,  leerCiudadano, leerTipoCandidato, leerPartido} from '../helpers/funciones';




export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Candidatos;
      await sql`INSERT INTO candidatos ${sql(request,"idemp","idpartido","casilla","tipo","idmunicipio","iddep")}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await  sql<Req.Candidatos[]>`SELECT * FROM candidatos`;
      for(let candidato of response){
        let municipio = await leerMunicipio(candidato.idmunicipio);
        let tipo = await leerTipoCandidato(candidato.tipo);
        let partido = await leerPartido(candidato.idpartido);
        let ciudadanos = await leerCiudadano(candidato.idemp);
        candidato.municipios= municipio;
        candidato.tipoCandidatos = tipo;
        candidato.partido= partido;
        candidato.ciudadanos = ciudadanos;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })

  router.get("/:idemp", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM candidatos WHERE idemp = ${req.params.idemp}`
      let municipio = await leerMunicipio(response[0].idmunicipio);
      let tipo = await leerTipoCandidato(response[0].tipo);
      let partido = await leerPartido(response[0].idpartido);
      let ciudadanos = await leerCiudadano(response[0].idemp);
      response[0].municipios= municipio;
      response[0].tipoCandidatos = tipo;
      response[0].partido= partido;
      response[0].ciudadanos = ciudadanos;
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:idemp", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM candidatos WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:idemp", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Candidatos;
      await sql`UPDATE candidatos SET ${sql(request,"idpartido","casilla","tipo","idmunicipio","iddep")}  
                WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};
