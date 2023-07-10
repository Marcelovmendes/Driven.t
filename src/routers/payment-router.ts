import {Router} from  'express'
import { authenticateToken } from '../middlewares'
import paymentController from '../controllers/payment-controller'




const paymentRouter = Router()
 .use(authenticateToken)
paymentRouter.get('/',paymentController.getPayment)
paymentRouter.post('/process',paymentController.createPayment)


export {paymentRouter};