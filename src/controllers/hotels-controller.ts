import { Response,Request } from "express";
import { AuthenticatedRequest } from "../middlewares";
import httpStatus from "http-status";
import hotelsService from "../services/hotels-service";



 async function getHotels (req: AuthenticatedRequest, res: Response) {
    try {
      const{ userId } = req;
      const hotels = await hotelsService.getAllHotels(userId);
        return res.status(httpStatus.OK).send(hotels);
    } catch (e) {
      if(e.name === 'NotFoundError')return res.sendStatus(httpStatus.NOT_FOUND);
      if(e.name === 'UnauthorizedError')return res.sendStatus(httpStatus.UNAUTHORIZED);
      if(e.name === 'PaymentRequiredError')return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
      
    }
}

 async function getRooms (req: AuthenticatedRequest, res: Response) {

    const { userId } = req;
    const hotelId = parseInt(req.params.hotelId);
    try {
        const rooms = await hotelsService.getRoomsByHotel(hotelId,userId);
        return res.status(httpStatus.OK).send(rooms);
    } catch (e) {
        console.log(e, "erro")
      if(e.name === 'NotFoundError')return res.sendStatus(httpStatus.NOT_FOUND);
      if(e.name === 'UnauthorizedError')return res.sendStatus(httpStatus.UNAUTHORIZED);
      if(e.name === 'PaymentRequiredError')return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
      
    }

 }

const hotelsController ={
    getHotels,
    getRooms
    
}
export default hotelsController