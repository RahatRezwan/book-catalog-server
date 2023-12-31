import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
   const { ...loginData } = req.body;
   const result = await AuthService.loginUser(loginData);

   const { refreshToken, ...others } = result;

   //set refresh token in cookie
   const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
   };
   res.cookie('refreshToken', refreshToken, cookieOptions);

   sendResponse<ILoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      success: true,
      data: others,
   });
});

//refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
   const { refreshToken } = req.cookies;
   const result = await AuthService.refreshToken(refreshToken);

   //set refresh token in cookie
   const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
   };
   res.cookie('refreshToken', refreshToken, cookieOptions);

   sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      success: true,
      data: result,
   });
});

export const AuthController = { loginUser, refreshToken };
