import ContactDetails from "../models/contactModel";

export interface IParams {
  passenger_id?: number;
  booking_id?: number;
  NIK?: string;
  name?: string;
  date_of_birth?: Date;
  vaccinated?: boolean;
  created_at?: number;
  updated_at?: number;
}

class ContactDetailsRepository {
  create(createArgs: any) {
    console.log(createArgs);
    return ContactDetails.query().insert(createArgs);
  }


  delete(contact_id: number) {
    return ContactDetails.query().deleteById(contact_id);
  }
}

export default new ContactDetailsRepository();