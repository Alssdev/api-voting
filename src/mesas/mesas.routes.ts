/*import { Router, Request, Response } from "express";
import sql from "./../database"
import response from "../types/tipos";


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Mesas;
      await sql`INSERT INTO mesas ${sql(request)}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM mesas`
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.get("/:nmesa/:idest", async function (req: Request, res: Response) {
    try {
      let response = await sql`SELECT * FROM mesas WHERE nmesa = ${req.params.nmesa} AND idest = ${req.params.idest}`
      res.json({
        list: response,
      })
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.delete("/:nmesa/:idest", async function (req: Request, res: Response) {
    try {
      await sql`DELETE FROM mesas WHERE nmesa = ${req.params.nmesa} AND idest = ${req.params.idest}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  })

  router.put("/:nmesa/:idest", async function (req: Request, res: Response) {
    try {
      let request = req.body as Req.Mesas;
      await sql`UPDATE mesas SET ${sql(request,"cotaInferior", "cotaSuperior")}  WHERE nmesa = ${req.params.nmesa} AND idest = ${req.params.idest}`;
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })

  return router;
};
*/

//A la hora de ser una llave cmpuesta
//¿No permite cambiar la llave primaria? 