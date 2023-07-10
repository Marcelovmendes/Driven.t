
import { TicketStatus } from "@prisma/client";
import { prisma } from "../../config";
import { cardData } from "../../protocols";


async function getPaymentByTicketId(ticketId: number) {
    return await prisma.payment.findFirst({
        where: {
            ticketId,
        },
    });
}   

async function createPayment(cardData: cardData) {
    return await prisma.payment.create({ 
         data: cardData
         });
        
}


export function updatePaid ( userId:number) {
    return prisma.ticket.updateMany({
        where: {
            enrollmentId: userId
        },
        data: {
            status: TicketStatus.PAID
        }
    })
}
const paymentRepository = {
    getPaymentByTicketId,
    createPayment,
    updatePaid
}

export default paymentRepository;