import {Router, Request, Response, NextFunction} from 'express';
import sql from "./../database"
import { leerDepartamento } from '../helpers/funciones';


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Municipios;
      await sql`INSERT INTO municipios ${sql(request, "nombre", "numh", "iddep")}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Municipios[]>`SELECT * FROM municipios ORDER BY idmunicipio`
      for(let municipios of response){
        let depto = await leerDepartamento(municipios.iddep);
        municipios.depto =depto;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get("/:idmunicipio", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Municipios[]>`SELECT * FROM municipios WHERE idmunicipio = ${req.params.idmunicipio}`
      let depto = await leerDepartamento(response[0].iddep);
      response[0].depto =depto;
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.delete("/:idmunicipio", async function (req: Request, res: Response, next: NextFunction) {
    try {
      await sql`DELETE FROM municipios WHERE idmunicipio = ${req.params.idmunicipio}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.put("/:idmunicipio", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Municipios;
      await sql`UPDATE municipios SET ${sql(request, "nombre", "numh", "iddep")}  WHERE idmunicipio = ${req.params.idmunicipio}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
      console.log(error);
    }
  })

  return router;
};
