
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
    const { ticketId, value, cardIssuer, cardLastDigits } = cardData;  
    
    return await prisma.payment.create({
        data: {
          Ticket: { connect: { id: ticketId } },
          value,
          cardIssuer,
          cardLastDigits,
        },
      });
}

async function updatePaid(id: number) {
    return prisma.ticket.update({
      where: { id },
      data: { status: TicketStatus.PAID },
    });
  }


const paymentRepository = {
    getPaymentByTicketId,
    createPayment,
    updatePaid
}

export default paymentRepository;