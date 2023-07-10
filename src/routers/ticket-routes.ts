import {Router} from  'express'
import { authenticateToken } from '../middlewares'
import ticketController from '../controllers/ticket-controller'



const routerTicket = Router()
.all('/*', authenticateToken)
routerTicket.get('/',ticketController.getTicket)
routerTicket.get('/types',ticketController.getTicketsType)
routerTicket.post('/',ticketController.createTicket)

export {routerTicket};
