import { ICar } from "../../models/carsModel";
import User from "../../models/userModel";

export const mockUserData = {
    user_id: 3,
    first_name: 'Admin',
    last_name: 'User',
    email: 'adminuser@gmail.com',
    password: '$2b$10$zCTtCcTmPKYYGDjA0SlSN.Y24o3JWZ7QxgseH4VSTtx89goEN6CRy',
    role: 'admin',
    created_at: '2023-12-09T09:05:20.986Z',
    updated_at: '2023-12-09T09:05:20.986Z'
}

export const mockLoginUserData = {
    first_name: 'Admin',
    last_name: 'User',
    email: 'adminuser@gmail.com',
    password: '$2b$10$zCTtCcTmPKYYGDjA0SlSN.Y24o3JWZ7QxgseH4VSTtx89goEN6CRy',
    role: 'admin',
    created_at: '2023-12-09T09:05:20.986Z',
    updated_at: '2023-12-09T09:05:20.986Z'
}

export const mockCarsData = [
    {
        available: true,
        availableAt: '2023-12-08T17:00:00.000Z',
        capacity: 4,
        car_id: 1,
        created_at: '2023-12-09T09:05:20.986Z',
        created_by: 2,
        description: 'Test Car',
        image:
            'https://res.cloudinary.com/ddpriosuk/image/upload/v1702112719/jlrvld42rjaoofkk4pia.png',
        manufacture: 'Test Car',
        model: 'Test Car',
        options: {
            optionsInputFields: [
                {
                    option: 'Test Car'
                }
            ]
        },
        plate: 'Test Car',
        rentPerDay: '10000000',
        specs: {
            specsInputFields: [
                {
                    spec: 'Test Car'
                }
            ]
        },
        transmission: 'Test Car',
        type: 'Test Car',
        updated_at: null,
        updated_by: 2,
        year: 2020
    },
    {
        available: true,
        availableAt: '2023-12-08T17:00:00.000Z',
        capacity: 4,
        car_id: 1,
        created_at: '2023-12-09T09:05:20.986Z',
        created_by: 2,
        description: 'Test Car',
        image:
            'https://res.cloudinary.com/ddpriosuk/image/upload/v1702112719/jlrvld42rjaoofkk4pia.png',
        manufacture: 'Test Car',
        model: 'Test Car',
        options: {
            optionsInputFields: [
                {
                    option: 'Test Car'
                }
            ]
        },
        plate: 'Test Car',
        rentPerDay: '10000000',
        specs: {
            specsInputFields: [
                {
                    spec: 'Test Car'
                }
            ]
        },
        transmission: 'Test Car',
        type: 'Test Car',
        updated_at: null,
        updated_by: 2,
        year: 2020
    },
    {
        available: true,
        availableAt: '2023-12-08T17:00:00.000Z',
        capacity: 4,
        car_id: 1,
        created_at: '2023-12-09T09:05:20.986Z',
        created_by: 2,
        description: 'Test Car',
        image:
            'https://res.cloudinary.com/ddpriosuk/image/upload/v1702112719/jlrvld42rjaoofkk4pia.png',
        manufacture: 'Test Car',
        model: 'Test Car',
        options: {
            optionsInputFields: [
                {
                    option: 'Test Car'
                }
            ]
        },
        plate: 'Test Car',
        rentPerDay: '10000000',
        specs: {
            specsInputFields: [
                {
                    spec: 'Test Car'
                }
            ]
        },
        transmission: 'Test Car',
        type: 'Test Car',
        updated_at: null,
        updated_by: 2,
        year: 2020
    }
];

export const mockCarData = {
    available: true,
    availableAt: '2023-12-08T17:00:00.000Z',
    capacity: 4,
    car_id: 1,
    created_at: '2023-12-09T09:05:20.986Z',
    created_by: 2,
    description: 'Test Car',
    image:
        'https://res.cloudinary.com/ddpriosuk/image/upload/v1702112719/jlrvld42rjaoofkk4pia.png',
    manufacture: 'Test Car',
    model: 'Test Car',
    options: {
        optionsInputFields: [
            {
                option: 'Test Car'
            }
        ]
    },
    plate: 'Test Car',
    rentPerDay: '10000000',
    specs: {
        specsInputFields: [
            {
                spec: 'Test Car'
            }
        ]
    },
    transmission: 'Test Car',
    type: 'Test Car',
    updated_at: null,
    updated_by: 2,
    year: 2020
}

export const mockCreateCarData: ICar = {
    available: true,
    availableAt: '2023-12-08T17:00:00.000Z',
    capacity: 4,
    car_id: 1,
    created_by: 2,
    description: 'Test Car',
    image:
        'https://res.cloudinary.com/ddpriosuk/image/upload/v1702112719/jlrvld42rjaoofkk4pia.png',
    manufacture: 'Test Car',
    model: 'Test Car',
    options: {
        optionsInputFields: [
            {
                option: 'Test Car'
            }
        ]
    },
    plate: 'Test Car',
    rentPerDay: '10000000',
    specs: {
        specsInputFields: [
            {
                spec: 'Test Car'
            }
        ]
    },
    transmission: 'Test Car',
    type: 'Test Car',
    updated_by: 2,
    year: 2020
};

export const mockUpdateCarData: ICar = {
    available: false,
    availableAt: '2023-12-08T17:00:00.000Z',
    capacity: 4,
    car_id: 1,
    created_by: 2,
    description: 'Test Car',
    image:
        'https://res.cloudinary.com/ddpriosuk/image/upload/v1702112719/jlrvld42rjaoofkk4pia.png',
    manufacture: 'Test Car',
    model: 'Test Car',
    options: {
        optionsInputFields: [
            {
                option: 'Test Car'
            }
        ]
    },
    plate: 'Test Car',
    rentPerDay: '10000000',
    specs: {
        specsInputFields: [
            {
                spec: 'Test Car'
            }
        ]
    },
    transmission: 'Test Car',
    type: 'Test Car',
    updated_by: 2,
    year: 2020
};

export const mockCount = 1;