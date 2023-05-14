import {Router, Request, Response, NextFunction} from 'express';
import sql from "./../database"
import { insertarVoto, leerMesa, leerTipoCandidato, leerPartido, encontrarNulo, encontrarBlanco } from '../helpers/funciones';


export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response, next: NextFunction) {
    try {

      let idmesa = req.body.idmesa;
      let tipo = req.body.tipo;
      let votosNulos = req.body.votosNulos;
      let votosBlancos = req.body.votosBlancos;

      for (let votos of req.body.detalles) {
        await insertarVoto(votos.idpartido, idmesa, tipo, votos.cantidad)
      }

      await insertarVoto(await encontrarNulo(), idmesa, tipo, votosNulos)
      await insertarVoto(await encontrarBlanco(), idmesa, tipo, votosBlancos)

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      next(error)

    }
  })

  router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Votos[]>`SELECT * FROM votos`
      for (let votos of response) {
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
      next(error)
    }
  })


  router.get("/:idpartido/:idmesa/:tipo", async function (req: Request, res: Response, next: NextFunction) {
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
      next(error)
    }
  })

  router.delete("/:idpartido/:idmesa/:tipo", async function (req: Request, res: Response, next: NextFunction) {
    try {
      await sql`DELETE FROM votos 
      WHERE idpartido = ${req.params.idpartido} AND idmesa = ${req.params.idmesa} AND tipo =${req.params.tipo} `;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.put("/:idpartido/:idmesa/:tipo", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Votos;
      await sql`UPDATE votos SET ${sql(request, "cantidad")}                               
      WHERE idpartido = ${req.params.idpartido} AND idmesa = ${req.params.idmesa} AND tipo =${req.params.tipo}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  return router;
};
