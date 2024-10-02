const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Tentukan ID perusahaan yang sudah tetap
  const fixedCompanyId = "2f017862-0356-462f-8a62-d4cf69be9a34";

  // Buat perusahaan dengan ID tetap jika belum ada
  const company = await prisma.company.upsert({
    where: { id: fixedCompanyId },
    update: {}, // Jika perusahaan sudah ada, lakukan apa-apa
    create: {
      id: fixedCompanyId, // Gunakan ID tetap
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      logo: faker.image.avatar(),
    },
  });

  // Seed Companies with Employees
  for (let i = 0; i < 20; i++) {
    // Create a user
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      },
    });

    // Tentukan role secara acak antara "PROJECT_MANAGER" atau "EMPLOYEE"
    const role = faker.helpers.arrayElement(["PROJECT_MANAGER", "EMPLOYEE"]);

    // Buat karyawan yang terhubung ke perusahaan
    await prisma.employee.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: faker.internet.password(),
        role: role,
        companyId: company.id, // Link employees to the company
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
