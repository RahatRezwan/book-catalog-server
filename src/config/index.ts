import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
   path: path.resolve(process.cwd(), '.env'),
});

export default {
   env: process.env.NODE_ENV,
   port: process.env.PORT,
   database_url: process.env.DATABASE_URL,
   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
   jwt: {
      secret: process.env.JWT_SECRET,
      refresh_secret: process.env.JWT_REFRESH_SECRET,
      access_expires_in: process.env.JWT_ACCESS_EXPIRATION,
      refresh_expires_in: process.env.JWT_REFRESH_EXPIRATION,
   },
};
