import { prisma } from "../../config";
import { Ticket, TicketStatus, TicketType } from "@prisma/client";


 async function getTicketTypesByRepository(){
    return await prisma.ticketType.findMany(); 
 }

 async function getTicketsByUser(userId: number ){
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
 async function getTicketById(id: number){
    return await prisma.ticket.findFirst({
        where:{
            id
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
async function updateTicket (tickedId:number,status:TicketStatus){

  return await prisma.ticket.updateMany({
    where: {
      id:tickedId
    },
    data: {
      status
    }

  })

}

  const ticketRepository = {
      
    getTicketTypesByRepository,
    getTicketsByUser,
    createTicketByRepository,
    getTicketById,
    updateTicket
  };
  
  export default ticketRepository;