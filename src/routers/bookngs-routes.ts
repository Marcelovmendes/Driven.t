import { Router } from "express";
import { authenticateToken } from "../middlewares";
import bookingsController from "../controllers/bookings-controller";




const bookingsRouter = Router()
.use(authenticateToken)
.get("/",authenticateToken,bookingsController.getBooking )
.post("/",authenticateToken,bookingsController.postBooking )
.put("/:bookingId",authenticateToken,bookingsController.putBooking )

export  {bookingsRouter}