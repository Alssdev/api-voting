import { Router, Request, Response } from "express";
import sql from "./../database"
import { leerMunicipio } from '../helpers/funciones';

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
      let response = await sql<Req.Ciudadano[]>`SELECT * FROM ciudadanos  ORDER BY idemp`;
      for(let ciudadano of response){
        let municipio = await leerMunicipio(ciudadano.idmunicipio);
        ciudadano.municipio = municipio;
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
      let response = await sql<Req.Ciudadano[]>`SELECT * FROM ciudadanos WHERE idemp = ${req.params.idemp}`;
      let municipio = await leerMunicipio(response[0].idmunicipio);
      response[0].municipio = municipio;
      res.json({
        list: response
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:idmesa/mesa", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Ciudadano[]>`SELECT C.nombres, C.apellidos, C.idemp, C.dpi FROM ciudadanos C, ubicacion_mesas M
                                                WHERE M.idmesa =  ${req.params.idmesa} AND C.idemp >= M.cotainferior AND C.idemp <= M.cotasuperior AND C.idmunicipio = M.idmunicipio`;
      res.json({
        list: response,
      })
    } catch (error) {
      console.log(error);
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

