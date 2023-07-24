import faker from '@faker-js/faker';
import { cleanDb } from '../helpers';
import { forbiddenError, notFoundError } from '@/errors';
import app, { init } from '@/app';
import { Booking, Room, TicketStatus } from '@prisma/client';
import bookingsRepository from '@/repositories/bookings-repository';
import bookingsService from '@/services/bookings-service';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
beforeAll(async () => {
  await init();
  await cleanDb();
});
beforeEach(async () => {
  jest.clearAllMocks();
});
const mock: Booking & { Room: Room } = {
  id: 1,
  userId: 1,
  roomId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  Room: {
    id: 1,
    name: 'lala',
    capacity: 1,
    hotelId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
const mockEnrollment = {
  id: 1,
  name: faker.name.findName(),
  cpf: '12345678910',
  birthday: new Date(),
  phone: '123456789',
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  Address: [
    {
      id: 1,
      cep: '36020-410',
      street: 'Lauro de Freitas',
      city: 'Rio de Janeiro',
      state: ' Rio de Janeiro',
      number: '5555',
      neighborhood: ' centro',
      addressDetail: 'none',
      enrollmentId: 1,
      createdAt: new Date('2023-07-24T10:57:11.591'),
      updatedAt: new Date('2023-07-24T10:57:11.591'),
    },
  ],
};
const mockRemoteTicket = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  status: TicketStatus.PAID,
  TicketType: {
    id: 1,
    name: faker.company.companyName(),
    price: 12345,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRemote: true,
    includesHotel: false,
  },
};
const mockTicketNoIncludesHotel = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  status: TicketStatus.PAID,
  TicketType: {
    id: 1,
    name: faker.company.companyName(),
    price: 12345,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRemote: false,
    includesHotel: false,
  },
};
const mockTicketItsReserved = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  status: TicketStatus.RESERVED,
  TicketType: {
    id: 1,
    name: faker.company.companyName(),
    price: 12345,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRemote: false,
    includesHotel: true,
  },
};

describe('GET /bookings', () => {
  it('should not found error when booking not found',() => {
    jest.spyOn(bookingsRepository, 'findBookingByUserId').mockImplementationOnce(undefined);
    const res = bookingsService.findBooking(1);
    expect(res).rejects.toEqual(notFoundError());
  });
  it('Should return booking', async () => {
    jest.spyOn(bookingsRepository, 'findBookingByUserId').mockResolvedValueOnce(mock);

    const booking = bookingsService.findBooking(1);
    expect(booking).toEqual(
      expect.objectContaining({
        id: mock.id,
        Room: expect.objectContaining({
          id: mock.Room.id,
          name: mock.Room.name,
          capacity: mock.Room.capacity,
          hotelId: mock.Room.hotelId,
          createdAt: mock.Room.createdAt,
          updatedAt: mock.Room.updatedAt,
        }),
      }),
    );
  });
});

describe('POST /bookings', () => {
  it('should respond 403 error when ticket is remote', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketRepository, 'getTicketsByUser').mockResolvedValueOnce([mockRemoteTicket]);
    const res =  bookingsService.createBooking(1, 1);
    expect(res).rejects.toEqual(forbiddenError());
  });
  it('should respond 403 error when ticket doesnt include hotel', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketRepository, 'getTicketsByUser').mockResolvedValueOnce([mockTicketNoIncludesHotel]);
    const res =  bookingsService.createBooking(1, 1);
    expect(res).rejects.toEqual(forbiddenError());
  });
  it('should responde 403 error when ticket its reserved ', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketRepository, 'getTicketsByUser').mockResolvedValueOnce([mockTicketItsReserved]);
    const res =  bookingsService.createBooking(1, 1);
    expect(res).rejects.toEqual(forbiddenError());
  });
});
