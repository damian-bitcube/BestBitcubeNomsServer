// const express = require('express');
// const app = express();
import { createServer } from "http";
import { createApplication } from "./app";
import { InMemoryOrderRepository } from "./order-management/order.repository";
// var cors = require('cors');
// // app.use(cors());
// app.use(cors({
//     'allowedHeaders': ['*'],
//     // 'exposedHeaders': ['sessionId'],
//     'origin': '*',
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     // 'preflightContinue': false
//   }));


// app.use( (req: any, res: any, next: () => void) =>{

//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // res.setHeader('Access-Control-Allow-Methods', '*');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', '*');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   // res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

// const httpServer = createServer(app);
const httpServer = createServer();

console.log('started')
createApplication(
  httpServer,
  {
    orderRepository: new InMemoryOrderRepository(),
  },
  {
    cors: {
      origin: '*'
    }
  }
);

httpServer.listen(3000);
