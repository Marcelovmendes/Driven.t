import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import { createEnrollmentWithAddress, createHotels, createPayment, createRooms, createTicket, createTicketType, createTicketTypeInPerson, createTicketTypeRemote, createUser,createBooking } from '../factories';
import httpStatus from 'http-status';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);

describe('GET /bookings', () => {
  it('Shoud respond with status 401 if no token valid', async () => {
    const invalidToken = faker.lorem.word();
    const { status } =  await api.get('/bookings').set('Authorization', `Bearer ${invalidToken}`);
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('Should respond with status 401 if no token given ',async  () => {
    const { status } = await api.get('/bookings');
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  })
  it('Should respond with status 401 if there is no session associated with the provided token', async () => {
    const withoutSession = await createUser();
    const token = jwt.sign({ userId: withoutSession.id }, process.env.JWT_SECRET);
   
    const { status } = await api.get('/bookings').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('Should respond with status 404 if user has no reservation', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType=  await createTicketTypeInPerson();
    const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);
    await createHotels()
 
    const {status} = await api.get('/bookings').set('Authorization', `Bearer ${token}`);
     expect(status).toBe(httpStatus.NOT_FOUND);
  });
  it('Should respond with status 200 and booking data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType=  await createTicketTypeInPerson();
    const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
    await createPayment(ticket.id, ticketType.price);
   const hotel= await createHotels()
    const room = await createRooms( hotel.id,1);
    const booking = await createBooking(user.id, room.id);
    const {status,body} = await api.get('/bookings').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual(expect.objectContaining({
        id:booking.id,
        Room:{
          id:room.id,
          name:room.name,
          capacity:room.capacity,
          hotelId:room.hotelId,
          createdAt:room.createdAt.toISOString(),
          updatedAt:room.updatedAt.toISOString(),
        }
    }))
  })
});

describe('POST /bookings', () => {
    it('Should respond with status 401 if no token given ', async () => {
        const {status} = await api.post('/bookings');
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    })
    it('Should respond with status 401 if there is no session associated with the provided token', async () => {
        const withoutSession = await createUser();
        const token = jwt.sign({ userId: withoutSession.id }, process.env.JWT_SECRET);
        const {status} = await api.post('/bookings').set('Authorization', `Bearer ${token}`);
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    })
    it('Should respond with status 401 if no token valid ',async  () => {
        const invalidToken = faker.lorem.word();
        const { status } =  await api.get('/bookings').set('Authorization', `Bearer ${invalidToken}`);
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    })
    it('Should respond with status 403 when ticket not paid', async () => {

    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType=  await createTicketTypeInPerson();
 await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
    const {status} = await api.post('/bookings').set('Authorization', `Bearer ${token}`).send({
      roomId: 1,
    })
    expect(status).toBe(httpStatus.FORBIDDEN);
    })
    it('Should responde with status 404 if room doesnt exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType=  await createTicketTypeInPerson();
        const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
        await createPayment(ticket.id, ticketType.price);
        await createHotels()
        const {status }= await api.post('/bookings').set('Authorization', `Bearer ${token}`).send({
            roomId: 1,
        })
          expect(status).toBe(httpStatus.NOT_FOUND);
    })
    it('Should respond with status 403 when ticket doesnt include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType=  await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
        await createPayment(ticket.id, ticketType.price);
        await createHotels()
        const {status }= await api.post('/bookings').set('Authorization', `Bearer ${token}`).send({
            roomId: 1,
        })
          expect(status).toBe(httpStatus.FORBIDDEN);
    })
    it('Should respond with status 403 when room is full', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType=  await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
        await createPayment(ticket.id, ticketType.price);
        const hotel=await createHotels()
        const room = await createRooms(hotel.id,0);
        await createBooking(user.id, room.id);
        const {status }= await api.post('/bookings').set('Authorization', `Bearer ${token}`).send({
            roomId: 1,
        })
          expect(status).toBe(httpStatus.FORBIDDEN);
    })
    it("Should repond with status 200 and return bookingId", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType=  await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
        await createPayment(ticket.id, ticketType.price);
        const hotel=await createHotels()
        const room = await createRooms(hotel.id,1);
        const booking = await createBooking(user.id, room.id);
        const {status,body} = await api.post('/bookings').set('Authorization', `Bearer ${token}`).send({
            roomId: 1,
        })
        expect(status).toBe(httpStatus.OK);
        expect(body).toEqual(expect.objectContaining({
            id:booking.id,
        }))
    })
})
describe('PUT /bookings/:bookingId', () => {
    it('should respond with status 401 it no token is given', async () => {
         const  {status} = await api.put('/bookings/1');
         expect(status).toBe(httpStatus.UNAUTHORIZED);
    })
    it('Should with status 401 when token is invalid', async () => {
        const invalidToken = faker.lorem.word();
        const {status} = await api.put('/bookings/1').set('Authorization', `Bearer ${invalidToken}`);
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    })
    it('Should respond with status 401 if there is no session associated with the provided token', async () => {      
        const withoutSession = await createUser();
        const token = jwt.sign({ userId: withoutSession.id }, process.env.JWT_SECRET);
        const {status} = await api.put('/bookings/1').set('Authorization', `Bearer ${token}`);
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    })
    it('Should respond with status 404 when booking doesnt exist', async () => {
      const token = await generateValidToken();
      const {status} = await api.put('/bookings/1').set('Authorization', `Bearer ${token}`).send({
          roomId: 1,
      });
      expect(status).toBe(httpStatus.NOT_FOUND);
  })
    it('should respond with status 403 when  user doesnt have a booking', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType=  await createTicketTypeInPerson();
        const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
        await createPayment(ticket.id, ticketType.price);
       const hotel  = await createHotels()
       const room = await createRooms(hotel.id,1);
       const booking = await createBooking(user.id, room.id);
       const {status} = await api.put(`/bookings/${booking.id}`).set('Authorization', `Bearer ${token}`);
   
       expect(status).toBe(httpStatus.FORBIDDEN);
   }) 
     it('Should respond with status 403 room is full', async () => {
         const user = await createUser();
         const token = await generateValidToken(user);
         const enrollment = await createEnrollmentWithAddress(user);
         const ticketType=  await createTicketTypeInPerson();
         const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
         await createPayment(ticket.id, ticketType.price);
         const hotel  = await createHotels()
         const room = await createRooms(hotel.id,1);
         const secondRoom = await createRooms(hotel.id,0);
         const booking = await createBooking(user.id, room.id);
         const {status} = await api.put(`/bookings/${booking.id}`).set('Authorization', `Bearer ${token}`).set({roomId:secondRoom.id});
         expect(status).toBe(httpStatus.FORBIDDEN);
     })
     it('Should respond with status 200 and return bookingId', async () => { 
         const user = await createUser();
         const token = await generateValidToken(user);
         const enrollment = await createEnrollmentWithAddress(user);
         const ticketType=  await createTicketTypeInPerson();
         const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);
         await createPayment(ticket.id, ticketType.price);
         const hotel  = await createHotels()
         const room = await createRooms(hotel.id,1);
         const booking = await createBooking(user.id, room.id);
         const {status,body} = await api.put(`/bookings/${booking.id}`).set('Authorization', `Bearer ${token}`).set({roomId:room.id});
         expect(status).toBe(httpStatus.OK);
         expect(body).toEqual(expect.objectContaining({
             id:booking.id,
         }))
     })
})
