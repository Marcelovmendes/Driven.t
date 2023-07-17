import {Router} from  'express'
import { authenticateToken } from '../middlewares'
import hotelsController from '../controllers/hotels-controller'

const hotelsRouter = Router()
    .use(authenticateToken)
    .get('/', hotelsController.getHotels)
    .get('/:hotelId', hotelsController.getRooms)

    export {hotelsRouter};