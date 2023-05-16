import { Router, Request, Response, NextFunction } from 'express';
import sql from "./../database"
import { encontrarNulo, encontrarBlanco } from '../helpers/funciones';


export default (): Router => {
  const router = Router();

  router.get("/:idmesa/padron_mesa", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Ciudadano[]>`SELECT C.nombres, C.apellidos, C.idemp, C.dpi FROM ciudadanos C, ubicacion_mesas M
                                                WHERE M.idmesa =  ${req.params.idmesa} AND C.idemp >= M.cotainferior AND C.idemp <= M.cotasuperior AND C.idmunicipio = M.idmunicipio`;
      res.json({
        ciudadanos: response,
      })
    } catch (error) {
      console.log(error);
      next(error)
    }
  });

  router.get("/:idmesa/:tipo/mesa_tipo", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Votos[]>`SELECT P.logo,P.nombre, P.acronimo, V.cantidad FROM votos V, Partidos P 
      WHERE P.idpartido = V.idpartido
      AND V.idmesa = ${req.params.idmesa}
      AND V.tipo = ${req.params.tipo}
      AND idemp IS NOT NULL`;

      const nulos = (await sql<Req.Votos[]>`SELECT V.cantidad FROM votos V 
      WHERE V.idmesa = ${req.params.idmesa}
      AND V.tipo = ${req.params.tipo}
      AND idpartido = ${await encontrarNulo()}`)[0].cantidad || 0;

      const blancos = (await sql<Req.Votos[]>`SELECT V.cantidad FROM votos V 
      WHERE V.idmesa = ${req.params.idmesa}
      AND V.tipo = ${req.params.tipo}
      AND idpartido = ${await encontrarBlanco()}`)[0].cantidad || 0;

      res.json({
        list: response,
        nulos,
        blancos
      })
    } catch (error) {
      next(error)
    }
  });

  router.get("/votos_presidente", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT I.nombres, I.apellidos, P.nombre, sum (V.cantidad)as conteo, P.logo, P.idpartido, P.acronimo, C.idemp
      FROM votos V, candidatos C, ciudadanos I, partidos P 
      WHERE C.idemp = I.idemp
      AND C.idpartido = V.idpartido
      AND C.idpartido = P.idpartido
      AND C.tipo = 'P'
      AND V.tipo = 'P'
      AND P.idemp IS NOT NULL
      GROUP BY V.idpartido, P.nombre,I.nombres, I.apellidos, P.logo, P.idpartido, C.idemp, P.acronimo
      ORDER BY sum (V.cantidad) DESC `;

      let idblancos = await encontrarBlanco();
      let idnulos = await encontrarNulo();

      let nulos = (await sql`SELECT sum(cantidad) FROM votos WHERE tipo = 'P' AND idpartido = ${idnulos}`)[0]
      let blancos = (await sql`SELECT sum(cantidad) FROM votos WHERE tipo = 'P' AND idpartido = ${idblancos} `)[0]
      res.json({
        list: response,
        nulos,
        blancos
      })
    } catch (error) {
      next(error)
    }
  });

  router.get("/:idmunicipio/votos_alcalde", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT
      I.nombres,
      I.apellidos,
      P.nombre,
      V.conteo,
      P.logo,
      P.idpartido,
      C.idemp, P.acronimo
      FROM (SELECT V.idpartido, sum(V.cantidad) AS conteo
            FROM votos V, ubicacion_mesas U
            WHERE V.tipo= 'A' AND V.idmesa = U.idmesa AND U.idmunicipio = ${req.params.idmunicipio}
            GROUP BY V.idpartido) V, candidatos C, ciudadanos I, partidos P 
      WHERE C.idemp = I.idemp
      AND C.idpartido = V.idpartido
      AND C.idpartido = P.idpartido
      AND C.tipo = 'A'
      AND C.idmunicipio = ${req.params.idmunicipio}
      ORDER BY V.conteo DESC 
      `

      let idblancos = await encontrarBlanco();
      let idnulos = await encontrarNulo();

      let nulos = (await sql`SELECT sum(V.cantidad) AS conteo
                            FROM votos V, ubicacion_mesas U
                            WHERE V.tipo= 'A' AND V.idmesa = U.idmesa AND U.idmunicipio = 1 AND idpartido = ${idnulos} `)[0]
      let blancos = (await sql`SELECT sum(V.cantidad) AS conteo
                              FROM votos V, ubicacion_mesas U
                              WHERE V.tipo= 'A' AND V.idmesa = U.idmesa AND U.idmunicipio = 1 AND idpartido = ${idblancos} `)[0]

      res.json({
        list: response,
        nulos,
        blancos
      })
    } catch (error) {
      next(error)
    }
  });

  router.get("/votos_diputado_nacional", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT P.nombre,
      sum (V.cantidad) as conteo,
      P.logo,
      P.idpartido,
      P.acronimo
      FROM votos V, partidos P 
      WHERE V.tipo = 'N' AND V.idpartido = P.idpartido AND P.idemp IS NOT NULl
      GROUP BY V.idpartido, P.nombre, P.logo, P.idpartido, P.acronimo`
      let idblancos = await encontrarBlanco();
      let idnulos = await encontrarNulo();

      let nulos = (await sql`SELECT sum(cantidad) FROM votos WHERE tipo = 'N' AND idpartido = ${idnulos} `)[0]
      let blancos = (await sql`SELECT sum(cantidad) FROM votos WHERE tipo = 'N' AND idpartido = ${idblancos} `)[0]
      res.json({
        list: response,
        nulos,
        blancos
      })
    } catch (error) {
      next(error)
    }
  });

  router.get("/:iddep/votos_diputado_distrito", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT
      P.nombre,
      sum (V.cantidad) as conteo,
      P.logo, P.idpartido,
      P.acronimo
      FROM votos V, partidos P 
      WHERE V.tipo = 'D' AND V.idpartido = P.idpartido AND P.idemp IS NOT NULL
      GROUP BY V.idpartido, P.nombre, P.logo, P.idpartido, P.acronimo`

      let idblancos = await encontrarBlanco();
      let idnulos = await encontrarNulo();

      let nulos = (await sql`SELECT sum(cantidad) FROM votos WHERE tipo = 'D' AND idpartido = ${idnulos} `)[0]
      let blancos = (await sql`SELECT sum(cantidad) FROM votos WHERE tipo = 'D' AND idpartido = ${idblancos} `)[0]
      res.json({
        list: response,
        nulos,
        blancos
      })
    } catch (error) {
      next(error)
    }
  });

  router.get("/minorias_diputado_nacional", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT idpartido,  TRUNC((conteo/(SELECT * FROM cifra_repartidora_nacional)), 0)  AS cantidad_diputados 
                              FROM minorias_nacional`;
                              
      let diputados: Req.Candidatos[] = [];
      for (const item of response) {
        const idpartido = item.idpartido;
        const cantidad = item.cantidad_diputados;

        const list = <Req.Candidatos[]>await sql`
          SELECT P.idpartido, C.idemp, P.logo, P.nombre, P.acronimo, I.nombres, I.apellidos FROM Candidatos C
          INNER JOIN Partidos P ON C.idpartido = P.idpartido
          INNER JOIN Ciudadanos I ON C.idemp = I.idemp
          WHERE C.tipo='N' AND P.idpartido=${idpartido}
          ORDER BY C.casilla ASC
          LIMIT ${cantidad};
        `;
        
        diputados = diputados.concat(list);
      }
      res.json({
        list: diputados,
      })
    } catch (error) {
      next(error)
    }
  });

  router.get("/:iddep/minorias_diputado_distrito", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT idpartido, TRUNC((conteo/(SELECT *FROM (
                                                                              (SELECT conteo FROM minorias_distrito WHERE iddep = ${req.params.iddep})
                                                                              UNION
                                                                              (SELECT divisor2 FROM minorias_distrito WHERE iddep = ${req.params.iddep})
                                                                              UNION
                                                                              (SELECT divisor3 FROM minorias_distrito WHERE iddep = ${req.params.iddep})
                                                                              UNION
                                                                              (SELECT divisor4 FROM minorias_distrito WHERE iddep = ${req.params.iddep})
                                                                              UNION
                                                                              (SELECT divisor5 FROM minorias_distrito WHERE iddep = ${req.params.iddep})) cifras
                                                                        ORDER BY conteo DESC limit 1 OFFSET 4)), 0) AS cantidad_diputados 
                                                                        FROM minorias_distrito
                                                                        WHERE iddep = ${req.params.iddep}`;
      
      let diputados: Req.Candidatos[] = [];
      for (const item of response) {
        const idpartido = item.idpartido;
        const cantidad = item.cantidad_diputados;

        const list = <Req.Candidatos[]>await sql`
          SELECT P.idpartido, C.idemp, P.logo, P.nombre, P.acronimo, I.nombres, I.apellidos FROM Candidatos C
          INNER JOIN Partidos P ON C.idpartido = P.idpartido
          INNER JOIN Ciudadanos I ON C.idemp = I.idemp
          WHERE C.tipo='D' AND P.idpartido=${idpartido}
          ORDER BY C.casilla ASC
          LIMIT ${cantidad};
        `;
        
        diputados = diputados.concat(list);
      }
      res.json({
        list: diputados,
      })
    } catch (error) {
      next(error)
    }
  });

  return router;
};
