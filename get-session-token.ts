import "dotenv/config";
import { prisma } from "./src/lib/db.js";

const session = await prisma.session.findFirst({ include: { user: true } });
if (session) {
  console.log("Session token:", session.token);
  console.log("User:", session.user.name);
} else {
  console.log("No sessions found");
}
await prisma.$disconnect();
