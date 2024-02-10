import User from '../models/userModel';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Image from '../models/imageModel';
import { randomUUID } from 'crypto';
import { Transaction } from 'objection';
import Role from '../models/roleModel';

const jwtSecret: string = '357638792F423F4428472B4B6250655368566D597133743677397A2443264629';
const decodedSecretBuffer: Buffer = Buffer.from(jwtSecret, 'base64');

interface UserWithRole extends User {
  role?: Role;
}

function createToken(user: UserWithRole) {
  const payload = {
    sub: user.email_address,
    role: user.role?.role_name,
    userId: user.user_id
  };

  const expiresIn = 3600000;
  return {
    token: jwt.sign(payload, decodedSecretBuffer, { algorithm: 'HS256', expiresIn }),
    roles: user?.role?.role_name
  };
}

class GoogleOAuthService {
  constructor() {}

  async handleOAuth(options: any) {
    let transaction: Transaction | undefined = undefined;

    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', options);
      const { email, name, picture } = response.data;

      let user = await this.findUserByEmail(email);
      if (!user) {
        transaction = await User.startTransaction();
        const profileImage = await this.createProfileImage(transaction, name, picture);
        await this.createUser(transaction, email, name, profileImage);
        await transaction.commit();
        user = await this.findUserByEmail(email);
      }

      const accessToken = createToken(user!);
      return accessToken;
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error('Error during OAuth handling:', error);
      throw error;
    }
  }

  private async findUserByEmail(email: string) {
    try {
      return await User.query().findOne({ email_address: email }).withGraphFetched('role');
    } catch (error) {
      console.error('Error while finding user by email:', error);
      throw error;
    }
  }

  private async createProfileImage(transaction: Transaction, name: string, picture: string) {
    try {
      return await Image.query(transaction).insert({
        image_id: randomUUID(),
        name_image: name,
        url_image: picture
      });
    } catch (error) {
      console.error('Error while creating profile image:', error);
      throw error;
    }
  }

  private async createUser(
    transaction: Transaction,
    email: string,
    name: string,
    profileImage: any
  ) {
    try {
      const role = await Role.query(transaction).findOne({ role_name: 'USER' });
      return await User.query(transaction).insert({
        user_id: randomUUID(),
        email_address: email,
        fullname: name,
        image_id: profileImage.image_id,
        role_id: role?.role_id
      });
    } catch (error) {
      console.error('Error while creating user:', error);
      throw error;
    }
  }
}

export default new GoogleOAuthService();
