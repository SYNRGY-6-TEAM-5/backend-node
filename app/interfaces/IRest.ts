import { type Request, type Response, type NextFunction } from 'express';

export interface IRestController {
  list: (req: Request, res: Response) => void;
  create: (req: Request, res: Response, next: NextFunction) => void;
  show: (req: Request, res: Response) => void;
  update: (req: Request, res: Response, next: NextFunction) => void;
  delete: (req: Request, res: Response) => void;
}

export interface TParams {
  search?: string;
  page?: number;
  size?: number;
}

export interface TPayload {
  title: string;
  author: string;
  isbn: string;
  published_year: number;
  genre: string;
  copies_available: number;
  total_copies: number;
  picture: string;
}

export interface IRestModel<T, P = TPayload> {
  list: (params?: TParams) => Promise<T[]>;
  create: (payload: P) => Promise<T>;
  show: (id: string) => Promise<T>;
  update: (id: string, payload: T) => Promise<T>;
  delete: (id: string) => Promise<T>;
}
