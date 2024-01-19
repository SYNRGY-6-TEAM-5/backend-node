import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { type IUser } from '../interfaces/IAuth';

const JWT_KEY = 'test_private_key';

class AuthService {
  constructor() {}

  generateToken(user: IUser) {
    const token = jwt.sign({ ...user }, JWT_KEY);
    return token;
  }

  async validateToken(token: string) {
    const decoded = jwt.verify(token, JWT_KEY);
    return decoded as IUser;
  }

  async validateRole(user: IUser, role: string) {
    return user.role === role;
  }
}

export default new AuthService();
