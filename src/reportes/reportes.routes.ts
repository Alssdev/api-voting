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
  })

  router.get("/:idmesa/:tipo/mesa_tipo", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Votos[]>`SELECT P.nombre, V.cantidad FROM votos V, Partidos P 
                                            WHERE P.idpartido = V.idpartido AND V.idmesa = ${req.params.idmesa} AND V.tipo = ${req.params.tipo} `
      res.json({
        list: response
      })
    } catch (error) {
      next(error)
    }
  })

  router.get("/votos_presidente", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT I.nombres, I.apellidos, P.nombre,  sum (V.cantidad)as conteo, P.logo, P.idpartido, C.idemp
      FROM votos V , candidatos C, ciudadanos I, partidos P 
      WHERE C.idemp = I.idemp AND C.idpartido = V.idpartido AND C.idpartido = P.idpartido AND C.tipo = 'P' AND V.tipo = 'P'
      GROUP BY V.idpartido, P.nombre,I.nombres, I.apellidos
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
  })

  router.get("/:idmunicipio/votos_alcalde", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT I.nombres, I.apellidos, P.nombre, V.conteo, P.logo, P.idpartido, C.idemp
      FROM (SELECT V.idpartido, sum(V.cantidad) AS conteo
          FROM votos V, ubicacion_mesas U
          WHERE V.tipo= 'A' AND V.idmesa = U.idmesa AND U.idmunicipio = ${req.params.idmunicipio}
          GROUP BY V.idpartido) V, candidatos C, ciudadanos I, partidos P 
      WHERE C.idemp = I.idemp AND C.idpartido = V.idpartido AND C.idpartido = P.idpartido AND C.tipo = 'A' AND C.idmunicipio = ${req.params.idmunicipio}
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
  })

  router.get("/votos_diputado_nacional", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT P.nombre, sum (V.cantidad), P.logo, P.idpartido
                                FROM votos V, partidos P 
                                WHERE V.tipo = 'N' AND V.idpartido = P.idpartido
                                GROUP BY V.idpartido, P.nombre`
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
  })

  router.get("/:iddep/votos_diputado_distrito", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql`SELECT P.nombre, sum (V.cantidad), P.logo, P.idpartido
                                FROM votos V, partidos P 
                                WHERE V.tipo = 'D' AND V.idpartido = P.idpartido
                                GROUP BY V.idpartido, P.nombre`

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
  })



  return router;
};


/*
 PRESIDENTE:

SELECT I.nombres, I.apellidos, P.nombre,  sum (V.cantidad)as conteo
FROM votos V , candidatos C, ciudadanos I, partidos P 
WHERE C.idemp = I.idemp AND C.idpartido = V.idpartido AND C.idpartido = P.idpartido AND C.tipo = 'P' AND V.tipo = 'P'
GROUP BY V.idpartido, P.nombre,I.nombres, I.apellidos
ORDER BY sum (V.cantidad) DESC


ALCALDE: 

SELECT I.nombres, I.apellidos, P.nombre, V.conteo
FROM (SELECT V.idpartido, sum(V.cantidad) AS conteo
    FROM votos V, establecimientos E, mesas M
    WHERE V.tipo= 'A' AND V.idmesa =M.idmesa AND E.idest = M.idest AND E.idmunicipio = 1
    GROUP BY V.idpartido) V, candidatos C, ciudadanos I, partidos P 
WHERE C.idemp = I.idemp AND C.idpartido = V.idpartido AND C.idpartido = P.idpartido AND C.tipo = 'A'
ORDER BY V.conteo DESC


DISTRITO 
// Por partido
SELECT P.nombre, sum (V.cantidad)
FROM votos V, partidos P 
WHERE V.tipo = 'D' AND V.idpartido = P.idpartido
GROUP BY V.idpartido, P.nombre

// Por partido y departamento
SELECT P.nombre, V.conteo
FROM (SELECT V.idpartido, sum(V.cantidad) AS conteo 
    FROM votos V
    WHERE tipo = 'D' AND idmesa IN (SELECT  M.idmesa
                    FROM municipios U, establecimientos E, mesas M
                    WHERE U.idmunicipio = E.idmunicipio AND U.iddep = ${req.params.iddep} AND E.idest = M.idest)
    GROUP BY V.idpartido
) V,  partidos P 
WHERE  V.idpartido = P.idpartido 
ORDER BY V.conteo DESC

LISTADO NACIONAL
// Por partido
SELECT P.nombre, sum (V.cantidad)
FROM votos V, partidos P 
WHERE V.tipo = 'N' AND V.idpartido = P.idpartido
GROUP BY V.idpartido, P.nombre

// Por partido y municipio
SELECT P.nombre, V.conteo
FROM (SELECT V.idpartido, sum(V.cantidad) AS conteo
    FROM votos V, establecimientos E, mesas M
    WHERE V.tipo= 'N' AND V.idmesa = M.idmesa AND E.idest = M.idest AND E.idmunicipio = 1
    GROUP BY V.idpartido) V, partidos P 
WHERE  V.idpartido = P.idpartido 
ORDER BY V.conteo DESC
 */


