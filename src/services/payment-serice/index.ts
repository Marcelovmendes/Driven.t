import { notFoundError, unauthorizedError } from "../../errors"
import enrollmentRepository from "../../repositories/enrollment-repository"
import paymentRepository from "../../repositories/payment-repository"
import ticketRepository from "../../repositories/ticket-repository"


async function getPayment(ticketId:number, userId:number){
    const ticket = await ticketRepository.getTicketById(ticketId)
    if(!ticket) throw notFoundError()
    const enrollment= await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment)  throw notFoundError();
    if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();
   const payment = await paymentRepository.getPaymentByTicketId(ticketId)

   return payment;
}

async function createPayment(body:{ticketId:number;cardIssuer:string;cardLastDigits:string}){

  const ticket = await ticketRepository.getTicketById(body.ticketId) 
  if(!ticket) throw notFoundError()
  const enrollment = await enrollmentRepository.findWithAddressByUserId(ticket.enrollmentId);
  console.log(enrollment,'enrollment')
  if (!enrollment )  throw notFoundError();
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();
  
  const payment = await paymentRepository.createPayment({...body,value:ticket.TicketType.price})
  console.log(payment,'payment');
return payment 
}
const paymentService = {
    getPayment,
    createPayment
}

export default paymentService;