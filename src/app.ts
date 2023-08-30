import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
const app: Application = express();

//import router
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import httpStatus from 'http-status';

//middleware
app.use(cors());
/* parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
   res.send(
      `
    <html>
      <head>
        <style>
          .center-div {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 20vh;
            weight: 30%;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        </style>
      </head>
      <body>
        <div class="center-div">
          <h1>Welcome to the Cow Hut</h1>
        </div>
      </body>
    </html>
  `,
   );
});

//global error handler
app.use(globalErrorHandler);

//handle not found routes
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Route not found',
      errorMessages: [
         {
            path: req.originalUrl,
            message: 'Route not found',
         },
      ],
   });
   next();
});

export default app;
