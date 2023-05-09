import { Router, Request, Response } from "express";
import sql from "./../database"
import { leerDepartamento } from '../helpers/funciones';


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Municipios;
      await sql`INSERT INTO municipios ${sql(request, "nombre", "numh", "iddep")}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Municipios[]>`SELECT * FROM municipios`
      for(let municipios of response){
        let depto = await leerDepartamento(municipios.iddep);
        municipios.depto =depto;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:idmunicipio", async function (req: Request, res: Response) {
    try {
      let response = await sql<Req.Municipios[]>`SELECT * FROM municipios WHERE idmunicipio = ${req.params.idmunicipio}`
      let depto = await leerDepartamento(response[0].iddep);
      response[0].depto =depto;
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

  router.put("/:idmunicipio", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Municipios;
      await sql`UPDATE municipios SET ${sql(request, "nombre", "numh", "iddep")}  WHERE idmunicipio = ${req.params.idmunicipio}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};
