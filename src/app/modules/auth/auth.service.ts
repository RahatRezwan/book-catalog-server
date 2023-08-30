import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
   const { email, password } = payload;

   const isUserExists = await User.isUserExists(email);

   if (!isUserExists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
   }

   //check if password is correct
   if (isUserExists.password && !(await User.isPasswordMatch(password, isUserExists?.password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password !');
   }

   const { email: userEmail } = isUserExists;
   //create access token
   const accessToken = jwtHelpers.createToken(
      {
         email: userEmail,
      },
      config.jwt.secret as Secret,
      config.jwt.access_expires_in as string,
   );

   //create refresh token
   const refreshToken = jwtHelpers.createToken(
      {
         email: userEmail,
      },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string,
   );

   return {
      accessToken,
      refreshToken,
   };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
   //verify token
   let verifiedToken = null;
   try {
      verifiedToken = jwtHelpers.verifyToken(token, config.jwt.refresh_secret as Secret);
   } catch (err) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token !');
   }

   const { email } = verifiedToken;

   //checking deleted user's refresh token
   const isUserExists = await User.isUserExists(email);
   if (!isUserExists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
   }

   //create access token
   const newAccessToken = jwtHelpers.createToken(
      {
         email: isUserExists.email,
      },
      config.jwt.secret as Secret,
      config.jwt.access_expires_in as string,
   );

   return {
      accessToken: newAccessToken,
   };
};

export const AuthService = { loginUser, refreshToken };
