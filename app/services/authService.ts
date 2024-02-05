import jwt from 'jsonwebtoken';

import { type IUserJwt } from '../interfaces/IAuth';

const jwtSecret: string = "357638792F423F4428472B4B6250655368566D597133743677397A2443264629"
const decodedSecretBuffer: Buffer = Buffer.from(jwtSecret, 'base64');

class AuthService {
  constructor() { }

  async validateToken(token: string) {
    if (!jwtSecret) {
      throw new Error('jwtSecret is not defined');
    }

    const decoded = jwt.verify(token, decodedSecretBuffer, { algorithms: ['HS256'] })
    // console.log(decoded);
    return decoded as IUserJwt;
  }

  async validateRole(user: IUserJwt, role: string) {
    // return user.role === role;
    return user.role === role;
  }
}

export default new AuthService();
