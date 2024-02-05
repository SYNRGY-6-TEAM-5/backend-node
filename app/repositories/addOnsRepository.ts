import PassengerAddon, { IPassengerAddon } from "../models/addOnsModel";

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class PassengerAddonRepository {
  create(createArgs: PassengerAddon) {
    return PassengerAddon.query().insert(createArgs);
  }

  async findAll(params?: IParams): Promise<Array<PassengerAddon>> {
    let passengerAddonsQuery = PassengerAddon.query();

    if (params?.search) {
        passengerAddonsQuery = passengerAddonsQuery
          .whereILike('meal_name', `%${params?.search}%`)
          .orWhereILike('baggage_weight', `%${params?.search}%`);
      }

    const passengerAddons = await passengerAddonsQuery.orderBy('created_at', 'desc');

    return passengerAddons as Array<PassengerAddon>;
  }

  find(addon_id: number) {
    return PassengerAddon.query().findById(addon_id);
  }

  update(addon_id: number, updateArgs: any) {
    return PassengerAddon.query().patchAndFetchById(addon_id, updateArgs);
  }

  delete(addon_id: number) {
    return PassengerAddon.query().deleteById(addon_id);
  }

  async count(params?: IParams) {
    let allPassengerAddons = PassengerAddon.query().count('addon_id');

    if (params?.search) {
        allPassengerAddons = allPassengerAddons
          .whereILike('meal_name', `%${params?.search}%`)
          .orWhereILike('baggage_weight', `%${params?.search}%`);
      }

    const countResult = await allPassengerAddons;
    const count = countResult.length;

    return count;
  }
}

export default new PassengerAddonRepository();
