import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

console.log("Connection established!");

export { prismaClient }