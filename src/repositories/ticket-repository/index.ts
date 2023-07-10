import { prisma } from "../../config";
import { Ticket, TicketType } from "@prisma/client";


 async function getTicketTypesByRepository(): Promise<TicketType[]> {
    return await prisma.ticketType.findMany(); 
 }

 async function getTicketsByUser(userId: number ):Promise<Ticket[]>{
    return await prisma.ticket.findMany({
        where:{
            Enrollment:{
                userId
            }
        },
        include:{
            TicketType: true
        }
      }
    )
 }

 async function createTicketByRepository(ticketTypeId: number, enrollmentId: number): Promise<Ticket> {
    return await prisma.ticket.create({
      data: {
        status: "RESERVED",
        ticketTypeId,
        enrollmentId
       
      },
      include: {
        TicketType: true
      }
    });
  
  } 


  const ticketRepository = {
      
    getTicketTypesByRepository,
    getTicketsByUser,
    createTicketByRepository
  };
  
  export default ticketRepository;