import { Request,Response } from "express";
import httpStatus from "http-status";
import ticketService from "../services/ticket-service.ts";
import { AuthenticatedRequest } from "../middlewares";

async function getTicketsType(req: Request, res: Response) {
   try {
     const result = await ticketService.getTicketsType();

   res.status(httpStatus.OK).send(result);
  console.log(result )
   } catch (err) {
     return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
   }
 }
 


async function getTicket( req: AuthenticatedRequest, res: Response) {
   const { userId} = req;
    try{
      const result = await ticketService.getTicket(userId);   
      return res.status(httpStatus.OK).send(result);
   }catch(err){ 
   (err.name =='NotFoundError')? res.sendStatus(httpStatus.NOT_FOUND):res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
   }
}
async function createTicket (req:AuthenticatedRequest,res:Response){
     const {ticketTypeId} = req.body;
     const {userId} = req;
     if (!ticketTypeId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
     }
    try{
      const result = await ticketService.createTicket( ticketTypeId, userId);
      return res.status(httpStatus.CREATED).send(result);
    }catch(err){
   (err.name == 'RequestError')? res.sendStatus(httpStatus.BAD_REQUEST):res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
       
    }
}

const ticketController = {
    
    getTicketsType,
    getTicket,
    createTicket
}

export default ticketController;