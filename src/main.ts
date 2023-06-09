import { Express} from 'express';
import express from 'express';
import Controllers from './controllers';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

// creating an express instance
const app: Express = express();
app.set('port', 4000);

// configs goes here


// middlewares goes here
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use('/logos', express.static(path.join(__dirname, './public')))

// routes goes here
Controllers(app);
// start server
app.listen(4000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${app.get('port')}`);
});
