import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Regions and districts of Uzbekistan
  const regionsWithDistricts = [
    {
      name: 'Tashkent',
      districts: [
        { name: 'Yunusabad' },
        { name: 'Chilanzar' },
        { name: 'Bektemir' },
        // Add other districts here
      ],
    },
    {
      name: 'Samarkand',
      districts: [
        { name: 'Samarkand City' },
        { name: 'Pastdargom' },
        { name: 'Urgut' },
        // Add other districts here
      ],
    },
    {
      name: 'Andijan',
      districts: [
        { name: 'Andijan City' },
        { name: 'Asaka' },
        { name: 'Buloqboshi' },
        // Add other districts here
      ],
    },
    // Add other regions with their districts
  ];

  const breedWithParents = [
    {
      name: 'Мясные',
      children: [
        'Черно-пёстрая',
        'Холмогорская',
        'Ярославская',
        'Красно-степная',
        'Бушуевская',
        'Симентальская',
        'Казахстанская белоголовая',
        'Жанта-Гертруда',
        'Герефорд',
      ],
    },
    {
      name: 'Молочные',
      children: [
        'Красно-пёстрая голштинская',
        'Голштино-фризская',
        'Красно-степная',
        'Бушуевская',
        'Красно-пёстрая голштинская',
      ],
    },
  ];

  // Insert regions and districts
  for (const region of regionsWithDistricts) {
    const createdRegion = await prisma.region.upsert({
      where: { name: region.name },
      update: {},
      create: {
        name: region.name,
        districts: {
          create: region.districts,
        },
      },
    });

    console.log(`Region created/updated: ${createdRegion.name}`);
  }

  // Create an admin user
  const user1 = await prisma.user.upsert({
    where: { phone: '+998679050005' },
    update: {},
    create: {
      phone: '+998679050005',
      password: await bcrypt.hash('123qazwsx', 10),
      firstName: 'John',
      lastName: 'Doe',
      address: 'Дагбитская улица, 168а',
      district: { connect: { id: 1 } }, // Example district ID, adjust as needed
      role: 'ADMIN',
    },
  });

  for (const breed of breedWithParents) {
    // Создаем родительскую породу
    const parentBreed = await prisma.breed.create({
      data: { name: breed.name },
    });

    // Создаем дочерние породы, привязывая их к родителю
    for (const childName of breed.children) {
      await prisma.breed.create({
        data: {
          name: childName,
          parentId: parentBreed.id, // Указываем ID родительской породы
        },
      });
    }

    console.log(`Created breed: ${breed.name} with children.`);
  }

  console.log({ user1 });
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma Client at the end
    await prisma.$disconnect();
  });
