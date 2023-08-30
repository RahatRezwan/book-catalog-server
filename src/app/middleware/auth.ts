import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

const auth =
   (...requireRoles: string[]) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         //get authorization token from header
         const token = req.headers.authorization;
         // const token = req.headers.authorization?.split(' ')[1];
         if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
         }

         //verify token
         let verifiedUser = null;

         verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

         req.user = verifiedUser; //role, id

         //check if user has required role
         if (requireRoles.length > 0 && !requireRoles.includes(verifiedUser.role)) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
         }

         return next();
      } catch (error) {
         next(error);
      }
   };

export default auth;
