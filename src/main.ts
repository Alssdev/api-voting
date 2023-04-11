import { Express } from 'express';
import express from 'express';

// creating an express instance
const app: Express = express();
app.set('port', 4000);

// configs goes here

// middlewares goes here

// routes goes here

// start server
app.listen(4000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${app.get('port')}`);
});
