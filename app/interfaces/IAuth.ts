import { type Request, type Response } from 'express';

export interface IAuthController {
  login: (req: Request, res: Response) => void;
  register: (req: Request, res: Response) => void;
}

export interface P_RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
}

export interface P_LoginPayload {
  email: string;
  password: string;
}

export interface IUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export interface IAuthModel<T, PR = P_RegisterPayload, PL = P_LoginPayload> {
  login: (payload: PL) => Promise<T>;
  register: (payload: PR) => Promise<T>;
}
