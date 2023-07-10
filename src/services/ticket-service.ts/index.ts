import { notFoundError } from "../../errors";
import enrollmentRepository from "../../repositories/enrollment-repository";
import ticketRepository from "../../repositories/ticket-repository";
async function getTicketsType(){
 const result = await ticketRepository.getTicketTypesByRepository();
 if(!result)  throw notFoundError();
 
 return result;
}

async function getTicketUser( userId: number){  

const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
if (!enrollment) {
  throw notFoundError();
}
 const result = await ticketRepository.getTicketsByUser(enrollment.id);
 console.log(result)
 if(!result || result.length === 0) {
  throw notFoundError();
 }
 return result[0];
}


async function createTicket (ticketTypeId: number, userId: number){
const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
if (!enrollment) {
  throw notFoundError();
}
 const result = await ticketRepository.createTicketByRepository(ticketTypeId, enrollment.id);
 return result;
}
const ticketService = {
  getTicketsType,
  getTicketUser,
  createTicket,

}

export default ticketService