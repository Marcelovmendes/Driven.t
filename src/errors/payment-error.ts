import { ApplicationError } from '@/protocols';

export function paymentRequiredError(): ApplicationError {
  return {
    name: 'PaymentRequiredError',
    message: 'The user has not included the hotel or has not paid for it yet.',
  };
}