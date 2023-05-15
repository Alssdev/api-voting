import { Router, Request, Response, NextFunction } from 'express';
import sql from "./../database"
import { leerMunicipio, leerCiudadano, leerTipoCandidato, leerPartido } from '../helpers/funciones';



export default (): Router => {
  const router = Router();
  router.post("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Candidatos;
      await sql`INSERT INTO candidatos ${sql(request, "idemp", "idpartido", "casilla", "tipo", "idmunicipio", "iddep")}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Candidatos[]>`SELECT * FROM candidatos ORDER BY idemp`;
      for (let candidato of response) {
        let municipio = await leerMunicipio(candidato.idmunicipio);
        let tipo = await leerTipoCandidato(candidato.tipo);
        let partido = await leerPartido(candidato.idpartido);
        let ciudadanos = await leerCiudadano(candidato.idemp);
        candidato.municipios = municipio;
        candidato.tipoCandidatos = tipo;
        candidato.partido = partido;
        candidato.ciudadanos = ciudadanos;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      console.log(error);
      next(error)
    }
  })

  router.get("/:idemp", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT * FROM candidatos WHERE idemp = ${req.params.idemp}`
      let municipio = await leerMunicipio(response[0].idmunicipio);
      let tipo = await leerTipoCandidato(response[0].tipo);
      let partido = await leerPartido(response[0].idpartido);
      let ciudadanos = await leerCiudadano(response[0].idemp);
      response[0].municipios = municipio;
      response[0].tipoCandidatos = tipo;
      response[0].partido = partido;
      response[0].ciudadanos = ciudadanos;
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.get("/:idpartido/binomio", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let responseP = await sql`SELECT * FROM candidatos WHERE idpartido = ${req.params.idpartido} AND tipo ='P'`
      let responseV = await sql`SELECT * FROM candidatos WHERE idpartido = ${req.params.idpartido} AND tipo ='V'`
      res.json({
        presidente: {
          idemp: responseP.length > 0 ? responseP[0].idemp : 0,
        },
        vicepresidente: {
          idemp: responseV.length > 0 ? responseV[0].idemp : 0,
        }
      })
    } catch (error) {
      next(error)
    }
  })

  router.get("/:idpartido/alcaldes", async function (req: Request, res: Response, next: NextFunction) {
    try {
      try {
        let response = await sql<Req.Candidatos[]>`SELECT *
                                                  FROM candidatos 
                                                  WHERE idpartido = ${req.params.idpartido} AND tipo='A'`;
        let alcaldes: Array<any> = [];
        for (let candidato of response) {
          let municipio = await leerMunicipio(candidato.idmunicipio);
          let ciudadano = await leerCiudadano(candidato.idemp);
          alcaldes.push({
            municipio: municipio,
            ciudadano: ciudadano
          })
        }
        res.json({
          alcaldes
        });
      } catch (error) {
        console.log(error);
        next(error)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })


  router.get("/:idpartido/:iddep/diputado_distrito", async function (req: Request, res: Response, next: NextFunction) {
    try {
      try {
        let response = await sql<Req.Candidatos[]>`SELECT * 
                                                  FROM candidatos 
                                                  WHERE idpartido = ${req.params.idpartido} AND iddep = ${req.params.iddep} AND tipo = 'D' 
                                                  ORDER BY casilla`;
        let diputados: Array<any> = [];
        for (let candidato of response) {
          let ciudadanos = await leerCiudadano(candidato.idemp);
          candidato.ciudadanos = ciudadanos;
          diputados.push({
            casilla: candidato.casilla,
            ciudadano: ciudadanos
          })
        }
        res.json({
          diputados: diputados,
        })
      } catch (error) {
        console.log(error);
        next(error)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/:idpartido/diputado_listado_nacional", async function (req: Request, res: Response, next: NextFunction) {
    try {
      try {
        let response = await sql<Req.Candidatos[]>`SELECT * 
                                                  FROM candidatos 
                                                  WHERE idpartido = ${req.params.idpartido}  AND tipo = 'N' 
                                                  ORDER BY casilla`;
        let diputados: Array<any> = [];
        for (let candidato of response) {
          let ciudadanos = await leerCiudadano(candidato.idemp);
          candidato.ciudadanos = ciudadanos;
          diputados.push({
            casilla: candidato.casilla,
            ciudadano: ciudadanos
          })
        }
        res.json({
          diputados: diputados,
        })
      } catch (error) {
        console.log(error);
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })


  router.delete("/:idemp", async function (req: Request, res: Response, next: NextFunction) {
    try {
      await sql`DELETE FROM candidatos WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.put("/:idemp", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Candidatos;
      await sql`UPDATE candidatos SET ${sql(request, "idpartido", "casilla", "tipo", "idmunicipio", "iddep")}  
                WHERE idemp = ${req.params.idemp}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  return router;
};
