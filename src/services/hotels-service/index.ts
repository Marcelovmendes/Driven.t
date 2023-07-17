import hotelsRepository from "../../repositories/hotels-repository";
import { notFoundError } from "../../errors";
import enrollmentRepository from "../../repositories/enrollment-repository";
import ticketRepository from "../../repositories/ticket-repository";
import { paymentRequiredError } from "../../errors/payment-error";



async function getAllHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketRepository.getTicketsByUser(enrollment.id);
    if(!ticket) throw notFoundError()

    const hasReservedTicket = ticket.some(ticket => ticket.status === 'RESERVED');
    const hasRemoteTicket = ticket.some(ticket => ticket.TicketType.isRemote);
    const includesHotelTicket = ticket.some(ticket => ticket.TicketType.includesHotel);

  if (hasReservedTicket || hasRemoteTicket || !includesHotelTicket) {
    throw paymentRequiredError();
  }
    const result =  await hotelsRepository.getHotels();
    return result;
}

async function getRoomsByHotel(hotelId: number,userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketRepository.getTicketsByUser(enrollment.id);
    if(!ticket) throw notFoundError()

    const hasReservedTicket = ticket.some(ticket => ticket.status === 'RESERVED');
    const hasRemoteTicket = ticket.some(ticket => ticket.TicketType.isRemote);
    const includesHotelTicket = ticket.some(ticket => ticket.TicketType.includesHotel);

  if (hasReservedTicket || hasRemoteTicket || !includesHotelTicket) {
    throw paymentRequiredError();
  }
    const result = await hotelsRepository.getRooms(hotelId);
    if(!result) throw notFoundError();
    return result
 

}
const hotelsService ={
    getAllHotels,
    getRoomsByHotel,
}

export default  hotelsService