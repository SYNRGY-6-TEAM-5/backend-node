import User from '../models/userModel';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import Image from '../models/imageModel';
import { randomUUID } from 'crypto';
import { Transaction } from 'objection';

const { JWT_SECRET_KEY = 'Rahasia' } = process.env;

function createToken(user: any) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  return jwt.sign(payload, JWT_SECRET_KEY);
}

class GoogleOAuthService {
  constructor() {}

  async handleOAuth(options: any) {
    let transaction: Transaction | undefined = undefined;

    try {
      transaction = await User.startTransaction();

      console.log(options);
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', options);
      console.log(response.data);
      const { email, name, picture } = response.data;

      let user = await this.findUserByEmail(email);
      if (!user) {
        const profileImage = await this.createProfileImage(transaction, name, picture);
        user = await this.createUser(transaction, email, name, profileImage);
      }

      await transaction.commit();
      const accessToken = createToken(user);
      return accessToken;
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error('Error during OAuth handling:', error);
      throw error;
    }
  }

  private async findUserByEmail(email: string) {
    try {
      return await User.query().findOne({ email_address: email });
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
      return await User.query(transaction).insert({
        user_id: randomUUID(),
        // email_address: email,
        // fullname: name,
        image_id: profileImage.image_id
        // role_id: 'ffd22377-5df3-48de-a089-fa2d62808b52'
      });
    } catch (error) {
      console.error('Error while creating user:', error);
      throw error;
    }
  }
}

export default new GoogleOAuthService();
