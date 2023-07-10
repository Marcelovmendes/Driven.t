import { notFoundError, unauthorizedError } from "../../errors"
import enrollmentRepository from "../../repositories/enrollment-repository"
import ticketRepository from "../../repositories/ticket-repository"


async function getPayment(ticketId:number, userId:number){
    const ticket = await ticketRepository.getTicketById(ticketId)
    if(!ticket) throw notFoundError()
    const enrollment= await enrollmentRepository.findWithAddressByUserId(userId)
    if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();
    return ticket
}


const paymentService = {
    getPayment
}
