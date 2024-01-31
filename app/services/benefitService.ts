import BenefitRepository, { type IParams } from '../repositories/benefitRepository';

import { type IUser } from '../interfaces/IAuth';

class BenefitService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await BenefitRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async list(params?: IParams) {
    try {
      const data = await BenefitRepository.findAll(params);
      const count = await BenefitRepository.count(params);

      return {
        data,
        count
      };
    } catch (err) {
      throw err;
    }
  }

  async get(benefit_id: number) {
    try {
      if (!benefit_id) {
        throw new Error('Invalid benefit id');
      }
      return await BenefitRepository.find(benefit_id);
    } catch (err) {
      throw err;
    }
  }

  async update(benefit_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody,
        updated_by: this._user?.user_id
      };

      delete payload.userToken;

      console.log('Payload >>>', payload);

      return await BenefitRepository.update(benefit_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(benefit_id: number) {
    try {
      return await BenefitRepository.delete(benefit_id).returning("benefit_id");
    } catch (err) {
      throw err;
    }
  }

  set setUser(userData: IUser) {
    this._user = userData;
  }

  get getUser() {
    return this._user;
  }
}

export default new BenefitService();
