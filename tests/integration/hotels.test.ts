import * as jwt from 'jsonwebtoken';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import app,{init} from '@/app';
import { prisma } from '@/config'
import { cleanDb, generateValidToken } from '../helpers';
import {
    createUser,

 } from '../factories';

 beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
  
  const api = supertest(app);
  
  describe("GET /hotels" , () => {
      it("Should respond with a 401 status code if no token is provided.", async () => {
          const res = await api.get("/hotels");
          expect(res.status).toBe(httpStatus.UNAUTHORIZED);
      })
      it("Should respond with a 401 status code if the provided token is invalid.", async () => {
          const token = faker.lorem.word();
          const res = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
          expect(res.status).toBe(httpStatus.UNAUTHORIZED);
      })
      it("Should respond with a 401 status code if there is no session associated with the provided token.", async () => {
          const withoutSession = await createUser()
          const token = jwt.sign({ userId: withoutSession.id }, process.env.JWT_SECRET);
          const res = await api.get("hotels").set("Authorization", `Bearer ${token}`);
          expect(res.status).toBe(httpStatus.UNAUTHORIZED); 
      })
  })
  describe("when token is valid",()=>{
      it("Should respond with a 404 status code when the user does not have an enrollment yet.",async ()=>{
        const token = await generateValidToken();
        const res = await api.get("/hotels").set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(httpStatus.NOT_FOUND);
      })
  })