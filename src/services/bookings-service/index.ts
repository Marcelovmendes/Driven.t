import { notFoundError } from '../../errors';
import { forbiddenError } from '../../errors';
import bookingsRepository from '../../repositories/bookings-repository';
import enrollmentRepository from '../../repositories/enrollment-repository';
import hotelsRepository from '../../repositories/hotels-repository';
import ticketRepository from '../../repositories/ticket-repository';

async function findBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const booking = await bookingsRepository.findBookingByUserId(userId);
  console.log(booking, 'bookingget');
  if (!booking ) throw notFoundError();

  return booking;

}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.getTicketsByUser(enrollment.id);
  if (!ticket || !ticket.length) throw notFoundError();


  const hasReservedTicket = ticket.some((ticket) => ticket.status === 'RESERVED');
  const hasRemoteTicket = ticket.some((ticket) => ticket.TicketType.isRemote);
  const includesHotelTicket = ticket.some((ticket) => ticket.TicketType.includesHotel);
 console.log(ticket,hasReservedTicket,includesHotelTicket,hasRemoteTicket,'check');
  if (hasReservedTicket || hasRemoteTicket || !includesHotelTicket) {
    throw forbiddenError();
  }

  const room = await hotelsRepository.getRooms(roomId);

  if (!room) throw notFoundError();

  const existingBooking = await bookingsRepository.existingBooking(roomId);
  console.log(room.Rooms[0].capacity,'capacity',existingBooking,'booking');
  if (room.Rooms[0].capacity <= existingBooking) throw forbiddenError();
  const booking = await bookingsRepository.createBooking(userId, roomId);
  console.log(booking, 'bookingService');
   return booking ;
}
async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const booking = await bookingsRepository.findBookingByUserId(userId);
  //console.log(booking, 'bookingput');
  if(!booking) throw notFoundError();
  if (booking.id !== bookingId) throw forbiddenError();
  const room = await hotelsRepository.getRooms(roomId); 
 
  if (!room) throw notFoundError();

  const existingBooking = await bookingsRepository.existingBooking(roomId);
  if (room.Rooms[0].capacity <= existingBooking) throw forbiddenError();

  const updateBooking = await bookingsRepository.putBooking(roomId, bookingId);
  if(!updateBooking) throw forbiddenError();
}
const bookingsService = {
  findBooking,
  createBooking,
  updateBooking,
};

export default bookingsService;
