import { prisma } from "../../config";
import { notFoundError } from "../../errors";

async function  getHotels () {

    return await prisma.hotel.findMany();
}

async function getRooms(hotelId: number) {
    const hotelWithRooms= await prisma.hotel.findFirst({
        where: {
          id: hotelId,
        },
        include: {
          Rooms: true,
        },
      });
      if(!hotelWithRooms || hotelWithRooms.Rooms.length === 0) { 
        throw notFoundError();
      }
      return {
        id: hotelWithRooms.id,
        name: hotelWithRooms.name,
        image: hotelWithRooms.image,
        createdAt: hotelWithRooms.createdAt.toISOString(),
        updatedAt: hotelWithRooms.updatedAt.toISOString(),
        Rooms: hotelWithRooms.Rooms.map((room) => ({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        })),
      };
    
    }
    


const  hotelsRepository ={
    getHotels,
    getRooms

}

export default hotelsRepository