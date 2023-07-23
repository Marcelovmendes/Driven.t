import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: userId,
    },
    include: {
      Room: true,
    },
  });
  return booking;
}

async function createBooking(userId: number, roomId: number) {
  return  prisma.booking.create({
    data: {
      User: {
        connect: {
          id: userId,
        },
      },
      Room: {
        connect: {
          id: roomId,
        },
      },
    },
    include: {
      Room: true,
    },
  });
}
function findRoom(id:number){
  return prisma.room.findFirst({
    where: {
      id,
    },
    include: {
      Booking: true,
    }
  });
}

async function putBooking( id: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      roomId,
    },
  });
}
async function existingBooking(roomId:number){
  return prisma.booking.count({
    where: {
      roomId,
    },
  })
}
const bookingsRepository ={
  findBookingByUserId,
  createBooking,
  findRoom,
  putBooking,
  existingBooking
    
}


export default bookingsRepository