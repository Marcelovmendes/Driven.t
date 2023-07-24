import Joi from 'joi';
import {InputTicketbody}from '@/protocols';


export const ticketsSchema = Joi.object<InputTicketbody>({
  ticketTypeId: Joi.number().required(),
});
