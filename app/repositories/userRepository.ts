import User from '../models/userModel';

class UserRepository {
  create(createArgs: any) {
    return User.query().insert(createArgs);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await User.query().findOne({ email_address: email }).select('*');
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return undefined;
    }
  }

  async getTotalUser() {
    return await User.query().resultSize();
  }
}

export default new UserRepository();