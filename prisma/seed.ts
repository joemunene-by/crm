import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sample user
  const user = await prisma.user.upsert({
    where: { email: "demo@crm.com" },
    update: {},
    create: {
      email: "demo@crm.com",
      name: "Demo User",
      password: "hashed_password", // In production, use bcrypt to hash
      role: "admin",
    },
  });

  // Create sample companies
  const company1 = await prisma.company.create({
    data: {
      name: "Acme Corp",
      industry: "Technology",
      website: "https://acme.com",
      phone: "123-456-7890",
      email: "contact@acme.com",
      userId: user.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: "Globex Inc",
      industry: "Finance",
      website: "https://globex.com",
      phone: "098-765-4321",
      email: "info@globex.com",
      userId: user.id,
    },
  });

  // Create sample contacts
  const contact1 = await prisma.contact.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john@acme.com",
      phone: "555-0100",
      company: "Acme Corp",
      position: "CEO",
      status: "customer",
      source: "Website",
      userId: user.id,
      companyId: company1.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@globex.com",
      phone: "555-0200",
      company: "Globex Inc",
      position: "CTO",
      status: "qualified",
      source: "Referral",
      userId: user.id,
      companyId: company2.id,
    },
  });

  // Create sample deals
  await prisma.deal.create({
    data: {
      title: "Acme Enterprise License",
      value: 50000,
      stage: "proposal",
      probability: 75,
      expectedCloseDate: new Date("2026-06-01"),
      status: "open",
      userId: user.id,
      contactId: contact1.id,
      companyId: company1.id,
    },
  });

  await prisma.deal.create({
    data: {
      title: "Globex Consulting Package",
      value: 25000,
      stage: "negotiation",
      probability: 60,
      expectedCloseDate: new Date("2026-05-15"),
      status: "open",
      userId: user.id,
      contactId: contact2.id,
      companyId: company2.id,
    },
  });

  // Create sample tasks
  await prisma.task.create({
    data: {
      title: "Follow up with John Doe",
      description: "Discuss enterprise license renewal",
      status: "pending",
      priority: "high",
      dueDate: new Date("2026-05-01"),
      userId: user.id,
      contactId: contact1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Send proposal to Globex",
      description: "Prepare and send consulting package proposal",
      status: "pending",
      priority: "medium",
      dueDate: new Date("2026-04-30"),
      userId: user.id,
      contactId: contact2.id,
    },
  });

  // Create sample activities
  await prisma.activity.create({
    data: {
      type: "call",
      description: "Initial discovery call with John Doe",
      contactId: contact1.id,
      userId: user.id,
    },
  });

  await prisma.activity.create({
    data: {
      type: "email",
      description: "Sent company overview to Jane Smith",
      contactId: contact2.id,
      userId: user.id,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
