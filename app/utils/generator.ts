interface InputData {
    user_id: string;
    email: string;
    phone: string;
    user_name: string;
    booking_id: string;
}

export function generateBookingCode(input: InputData): string {
    const { user_id, booking_id } = input;
    const prefix = "AERSWFT";
    const userIdPrefix = user_id.substr(0, 5).toUpperCase();
    const bookingId = booking_id.toUpperCase();
    return `${prefix}${bookingId}${userIdPrefix}`;
}