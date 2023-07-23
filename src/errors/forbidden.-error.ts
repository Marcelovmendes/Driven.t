import { ApplicationError } from '@/protocols';

export function bookingDeniedError(): ApplicationError {
  return {
    name: 'BookingDeniedError',
    message:'Only users with on-site, inclusive hotel, and paid tickets can make bookings.',
  };
}
