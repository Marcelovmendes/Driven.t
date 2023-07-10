import { prisma } from "../../config";


async function getPaymentByTicketId(ticketId: number) {
    return await prisma.payment.findFirst({
        where: {
            ticketId,
        },
    });
}


const paymentRepository = {
    getPaymentByTicketId,
    
}