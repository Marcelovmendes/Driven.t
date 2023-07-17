import {faker} from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotels() {
  const roomsData = [
    {
      name: faker.random.word(),
      capacity: faker.datatype.number({ min: 1, max: 4 }),
    },
    {
      name: faker.random.word(),
      capacity: faker.datatype.number({ min: 1, max: 4 }),
    },
    {
      name: faker.random.word(),
      capacity: faker.datatype.number({ min: 1, max: 4 }),
    },
    {
      name: faker.random.word(),
      capacity: faker.datatype.number({ min: 1, max: 4 }),
    }
  ];
  const hotelName = faker.company.companyName();
  const hotelImage = faker.image.business();
  try {
    const createdHotel = await prisma.hotel.create({
      data: {
        name: hotelName,
        image: hotelImage,
        Rooms: {
          createMany: {
            data: roomsData,
          },
        },
      },
      include: {
        Rooms: true,
      },
    });

    return createdHotel;
  } catch (error) {
    throw new Error('Failed to create hotels factury.');
  }
}
