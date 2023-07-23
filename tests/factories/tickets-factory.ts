import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
<<<<<<< HEAD
=======

>>>>>>> f8c586e3fadf17ae867e2af5f394f75c7ace48e2
export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}
<<<<<<< HEAD
export async function createTicketTypeInPerson() {
=======

export async function createTicketTypeWithHotel() {
>>>>>>> f8c586e3fadf17ae867e2af5f394f75c7ace48e2
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> f8c586e3fadf17ae867e2af5f394f75c7ace48e2
