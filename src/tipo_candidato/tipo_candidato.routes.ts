import {Router, Request, Response, NextFunction} from 'express';
import sql from "./../database"
import response from "../types/tipos";

export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.TipoCandidatos;
      await sql`INSERT INTO tipos_candidatos VALUES (${request.tipo})`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT * FROM tipos_candidatos ORDER BY tipo`;
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get("/:tipo", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT * FROM tipos_candidatos WHERE tipo = ${req.params.tipo}`;
      res.json({
        list: response
      })
    } catch (error) {
      next(error)
    }
  })

  router.delete("/:tipo", async function (req: Request, res: Response, next: NextFunction) {
    try {
      await sql`DELETE FROM tipos_candidatos WHERE tipo = ${req.params.tipo}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  return router;
};