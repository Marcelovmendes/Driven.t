import { AuthenticatedRequest } from "../middlewares";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bookingsService from "../services/bookings-service";

async function getBooking(res:Response,req:AuthenticatedRequest) {

    const { userId } = req;
    const booking = await bookingsService.findBooking(userId);

    res.status(httpStatus.OK).send(booking);
    
}

async function postBooking(res:Response,req:AuthenticatedRequest) {

    const { userId } = req;
    const { roomId } = req.body;
    const booking = await bookingsService.createBooking(userId,roomId);

    res.status(httpStatus.OK).send(booking);
}

async function putBooking(res:Response,req:AuthenticatedRequest) {

const { bookingId } = req.params;
const { roomId } =  req.body as Record<string, number>
const { userId } = req;

const booking = await bookingsService.updateBooking(Number(bookingId),roomId, userId);

res.status(httpStatus.OK).send(booking);
}
const bookingsController ={
    
    getBooking,
    postBooking,
    putBooking
}

export default bookingsController