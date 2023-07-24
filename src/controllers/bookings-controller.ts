import { AuthenticatedRequest } from '../middlewares';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import bookingsService from '../services/bookings-service';

async function getBooking(req: AuthenticatedRequest,res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingsService.findBooking(userId);

    res.status(httpStatus.OK).send(booking);
  } catch (err) {
    console.log(err,'err');
    if( err.name === 'NotFoundError')return res.sendStatus(httpStatus.NOT_FOUND);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}

async function postBooking(req: AuthenticatedRequest,res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  try {
    if(!roomId) return res.sendStatus(httpStatus.NOT_FOUND);
    const booking = await bookingsService.createBooking(userId, roomId);
    console.log(booking,'bookingController');
    res.status(httpStatus.OK).send({bookingId:booking.id});
  } catch (err) {
    console.log(err,'errPost')
    if( err.name === 'NotFoundError')return res.sendStatus(httpStatus.NOT_FOUND);
   if( err.name === 'ForbiddenError')return res.sendStatus(httpStatus.FORBIDDEN);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);  
  }
}

async function putBooking(req: AuthenticatedRequest,res: Response) {
  const { bookingId } = req.params;
  const { roomId } = req.body as Record<string, number>;
  const { userId } = req;

  try {
    
    const booking = await bookingsService.updateBooking(Number(bookingId), roomId, userId);

    res.status(httpStatus.OK).send(booking);
  } catch (err) {
    if( err.name === 'NotFoundError')return res.sendStatus(httpStatus.NOT_FOUND);
    if( err.name === 'ForbiddenError')return res.sendStatus(httpStatus.FORBIDDEN);
     res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err); 
  } 
}
const bookingsController = {
  getBooking,
  postBooking,
  putBooking,
};

export default bookingsController;
