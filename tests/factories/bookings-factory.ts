import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
   const booking = prisma.booking.create({
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
    return booking;
  }

  export async function putBooking( id: number, roomId: number) {
    return prisma.booking.update({
      where: {
        id,
      },
      data: {
        roomId,
      },
    });
  }