import { Request, Response } from "express";
import paymentService from "../services/payment-serice";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import paymentRepository from "../repositories/payment-repository";
import { notFoundError } from "../errors";


async function getPayment(req: AuthenticatedRequest,res:Response){
    const { userId } = req;
    const { ticketId } = req.query;

    if(!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);
     

    const ticketIdNum = Number(ticketId);
try{
  const result = await paymentService.getPayment( ticketIdNum, userId);
  return res.status(httpStatus.OK).send(result);
}catch(err){
 if(err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
 if(err.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);

  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}
}

async function createPayment(req: Request & { userId: number }, res: Response){
    const { userId } = req;
    const { ticketId, cardData } = req.body;
    if(!ticketId || !cardData ) return res.sendStatus(httpStatus.BAD_REQUEST);
  try{
    const payment = await paymentService.createPayment(userId,{
        ticketId,
        cardIssuer: cardData.issuer,
        cardLastDigits: cardData.number.slice(-4),
         
    });
 await paymentRepository.updatePaid(ticketId);
    res.status(httpStatus.OK).send(payment);
  }catch(err){ 
    console.log(err,'err');
     if(err.name ==='NotFoundError'){
       return res.sendStatus(httpStatus.NOT_FOUND);
  } if(err.name === 'UnauthorizedError'){
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

const paymentController = {
    getPayment,
    createPayment
}

export default paymentController