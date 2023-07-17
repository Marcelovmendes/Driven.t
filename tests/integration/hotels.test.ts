import * as jwt from 'jsonwebtoken';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import app,{init} from '@/app';
import { prisma } from '@/config'
import { cleanDb, generateValidToken } from '../helpers';
import {
    createEnrollmentWithAddress,
    createTicket,
    createTicketType,
    createTicketTypeInPerson,
    createTicketTypeRemote,
    createUser,

 } from '../factories';
import { TicketStatus } from '@prisma/client';
import { createHotels } from '../factories/hotels-factory';

 beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
  
  const api = supertest(app);
  
  describe("GET /hotels" , () => {
      it("Should respond with a 401 status code if no token is provided.", async () => {
          const {status}= await api.get("/hotels");
          expect(status).toBe(httpStatus.UNAUTHORIZED);
      })
    
    it("Should respond with a 401 status code if there is no session associated with the provided token.", async () => {
        const withoutSession = await createUser()
        const token = jwt.sign({ userId: withoutSession.id }, process.env.JWT_SECRET);
        const {status} = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
        expect(status).toEqual(httpStatus.UNAUTHORIZED); 
    })
      it("Should respond with a 401 status code if the provided token is invalid.", async () => {
          const token = faker.lorem.word();
          const {status} = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
          expect(status).toBe(httpStatus.UNAUTHORIZED);

  })
  describe("when token is valid",()=>{
      it("Should respond with a 404 status code when the user does not have an enrollment yet.",async ()=>{
        const token = await generateValidToken();
        const {status}= await api.get("/hotels").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.NOT_FOUND);
      })
      it("Should respond with a 404 status code when the user does not have an ticket yet.",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        const {status} = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.NOT_FOUND);
      })
      it("Should respond with a 404 status code when dont have available hotel.",async ()=>{
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketTypeInPerson= await createTicketTypeInPerson();
          const ticket = await createTicket(enrollment.id,ticketTypeInPerson.id,TicketStatus.PAID);
          const {status} = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
          expect(status).toEqual(httpStatus.NOT_FOUND);

      })
      it("Should respond with a 402 status code when the user does havent an ticket including hotel",async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment= await createEnrollmentWithAddress(user);
        const ticketTypeRemote = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id,ticketTypeRemote.id,TicketStatus.PAID); 
        const {status} = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
        expect(status).toEqual(httpStatus.PAYMENT_REQUIRED);  
      })
    it("Should respond  with a 200 status code with all hotels. ", async ()=>{
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketTypeInPerson();
          const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID,);
          const hotel = await createHotels();
          const {status, body} = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
          expect(status).toEqual(httpStatus.OK);
          console.log(body,'body');
          console.log(hotel,'hotel');
          expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id:hotel.id,
                name:hotel.name,
                image:hotel.image,
                createdAt:hotel.createdAt,
                updatedAt:hotel.updatedAt
            })
          ]),
          );
    
      })
      it("Should respond with a 402 status code when ticket not paid",async ()=>{
           const user = await createUser();
           const token = await generateValidToken(user);
           const enrollment = await createEnrollmentWithAddress(user);
           const ticketType = await createTicketTypeInPerson();
           await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED);

           const {status} = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
           expect(status).toEqual(httpStatus.PAYMENT_REQUIRED);
     })
  })
})
    describe("GET /hotels/:hotelId",()=>{
       it("Should respond with a 401 status code if no token is provided.", async()=>{
           const {status}= await api.get("/hotels/1");
           expect(status).toBe(httpStatus.UNAUTHORIZED);       
       })
       it("Should respond with a 401 status code if token provided not valid.", async()=>{
        const token = faker.lorem.word();
        const { status} = await api.get("/hotels/1").set("Authorization", `Bearer ${token}`);
        expect(status).toBe(httpStatus.UNAUTHORIZED);
       })
       it("Should responde with a 404 status code when given hotel doesnt exist.", async()=>{
       const user = await createUser();
       const token = await generateValidToken(user);
       const enrollment = await createEnrollmentWithAddress(user);
       const tiketType = await createTicketTypeInPerson();
       await createTicket(enrollment.id,tiketType.id,TicketStatus.PAID);
       const {status} = await api.get("/hotels/1").set("Authorization", `Bearer ${token}`);
       expect(status).toBe(httpStatus.NOT_FOUND);
    })
    it("Should responde with hotel data.", async ()=>{
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeInPerson();
        const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.PAID);
        const hotel = await createHotels();
        const {status, body} = await api.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
        expect(status).toEqual(httpStatus.OK);
        expect(body).toEqual({
            hotel
        })
    })
    })
