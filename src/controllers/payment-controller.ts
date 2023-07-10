import { Request, Response } from "express";
import paymentService from "../services/payment-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";


async function getPayment(req: AuthenticatedRequest,res:Response){
    const { userId } = req;
    const { ticketId } = req.query;
    const ticketIdNum = Number(ticketId);
try{
  const result = await paymentService.getPayment( ticketIdNum, userId);
  return res.status(httpStatus.OK).send(result);
}catch(err){
 
  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}
}

const paymentController = {
    getPayment
}

export default paymentController