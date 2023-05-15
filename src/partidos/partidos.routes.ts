import { Router, Request, Response, NextFunction } from 'express';
import sql from "./../database"
import { leerCiudadano } from '../helpers/funciones';
import multer from 'multer';
import path from 'path';

// this is for logo files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[1]);
  }
})
const upload = multer({ storage })


export default (): Router => {
  const router = Router();
  router.post("/", upload.single('logo'), async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Partidos;
      request.logo = req.file?.filename || '';
      await sql`INSERT INTO partidos ${sql(request,"acronimo","idemp","logo","nombre")}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
      console.log(error);
    }
  })

  router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Partidos[]>`SELECT * FROM partidos  WHERE idemp is NOT NULL  ORDER BY idpartido`
      for(let partido of response){
        let ciudadano = await leerCiudadano(partido.idemp);
        partido.secretario=ciudadano;
      }
      res.json({
        list: response,
      })
    } catch (error) {
      console.log(error);
      next(error)
    }
  })

  router.get("/:idpartido", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let response = await sql<Req.Partidos[]>`SELECT * FROM partidos WHERE idpartido = ${req.params.idpartido} AND idemp IS NOT NULL`
      let ciudadano = await leerCiudadano(response[0].idemp);
      response[0].secretario=ciudadano;
      res.json({
        list: response,
      })
    } catch (error) {
      next(error)
    }
  })

  router.delete("/:idpartido", async function (req: Request, res: Response, next: NextFunction) {
    try {
      await sql`DELETE FROM partidos WHERE idpartido = ${req.params.idpartido}`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
    }
  })

  router.put("/:idpartido", async function (req: Request, res: Response, next: NextFunction) {
    try {
      let request = req.body as Req.Partidos;
      await sql`UPDATE partidos SET ${sql(request,"acronimo","idemp","nombre")}  WHERE idpartido = ${req.params.idpartido
      }`;
      res.sendStatus(200);
    } catch (error) {
      next(error)
      console.log(error);
    }
  })

  return router;
};
