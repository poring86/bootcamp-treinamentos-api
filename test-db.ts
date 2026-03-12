import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import pg from "pg";
import { PrismaClient } from "./src/generated/prisma/index.js";

async function test() {
  try {
    console.log("Testing pg connection...");
    const connectionString = process.env.DATABASE_URL;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
    await prisma.$connect();
    console.log("Prisma connected successfully!");
    
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Query successful, user count:", users.length);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

test();
