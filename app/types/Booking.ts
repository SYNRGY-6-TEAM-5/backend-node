export interface IUser {
    user_id: string;
    fullName: string;
    email_address: string;
    password: string;
    roleName: string;
    imageUrl: string;
    dob: number;
    createdAt: number;
}

export interface IContactDetails {
    fullName: string;
    email: string;
    phone: string;
}

export interface IMealAddOns {
    meal_img: string;
    meal_name: string;
    meal_price: string;
}

export interface IBaggageAddOns {
    baggage_weight: string;
    baggage_price: string;
}

export interface ITravelDocs {
    doc_type: string;
    nationality: string;
    document_number: string;
    expire_date: Date;
    image_url: string;
}

export interface IAddOns {
    meals: IMealAddOns[];
    baggage: IBaggageAddOns;
}

export interface PassengerData {
    id: string;
    nik: string;
    fullName: string;
    dateOfBirth: Date | null;
    courtesy_title: string;
    vaccinated: string;
    travel_docs: ITravelDocs[];
}

export interface PassengerDetailsItem extends PassengerData {
    count: number;
}

export interface IPersonAddOns {
    passenger_name: string;
    departure: IAddOns;
    return: IAddOns;
}

export interface TripInsurance {
    full_insurance: {
        type: string;
        price: number;
    };
    baggage_insurance: {
        type: string;
        price: number;
    };
    flight_delay_insurance: {
        type: string;
        price: number;
    };
}


export interface ICompleteBooking {
    ticket_details: {
        booked_ticket: number[];
        total_ticket_price: number;
        expired_time: Date;
    };
    user_data?: IUser;
    contact_details: IContactDetails;
    passenger_details: PassengerDetailsItem[];
    passenger_addOns: IPersonAddOns[];
    trip_insurance: TripInsurance;
}