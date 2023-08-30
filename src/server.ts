import app from './app';
import { Server } from 'http';
import mongoose from 'mongoose';
import config from './config';

process.on('uncaughtException', (error) => {
   console.error(error);
   process.exit(1);
});

let server: Server;

async function cowHutDatabase() {
   try {
      await mongoose.connect(`${config.database_url}`);
      console.log(`Database is connected successfully`);
      server = app.listen(config.port, () => {
         console.log(`Application listening on port ${config.port}`);
      });
   } catch (error) {
      console.error(`Failed to connect`, error);
   }

   process.on('unhandledRejection', (error) => {
      if (server) {
         server.close(() => {
            console.error(error);
            process.exit(1);
         });
      } else {
         process.exit(1);
      }
   });
}

cowHutDatabase();
