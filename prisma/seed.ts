import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

import { PrismaClient, WeekDay } from "../src/generated/prisma/index.js";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface ExerciseInput {
  name: string;
  order: number;
  sets: number;
  reps: number;
  restTimeInSeconds: number;
}

interface WorkoutDayInput {
  name: string;
  weekDay: WeekDay;
  isRest: boolean;
  estimatedDurationInSeconds: number;
  exercises: ExerciseInput[];
}

const workoutDays: WorkoutDayInput[] = [
  {
    name: "Peito + Tríceps",
    weekDay: "MONDAY",
    isRest: false,
    estimatedDurationInSeconds: 3600, // 60 min
    coverImageUrl: "http://localhost:8081/public/workouts/chest.png",
    exercises: [
      { name: "Supino Reto com Barra", order: 0, sets: 4, reps: 10, restTimeInSeconds: 90 },
      { name: "Supino Inclinado com Halteres", order: 1, sets: 4, reps: 10, restTimeInSeconds: 90 },
      { name: "Crucifixo na Máquina (Peck Deck)", order: 2, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Crossover no Cabo", order: 3, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Tríceps Corda na Polia", order: 4, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Tríceps Francês com Halteres", order: 5, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Mergulho no Banco (Dips)", order: 6, sets: 3, reps: 12, restTimeInSeconds: 60 },
    ],
  },
  {
    name: "Costas + Bíceps",
    weekDay: "TUESDAY",
    isRest: false,
    estimatedDurationInSeconds: 3600,
    coverImageUrl: "http://localhost:8081/public/workouts/back.png",
    exercises: [
      { name: "Puxada Frontal Aberta", order: 0, sets: 4, reps: 10, restTimeInSeconds: 90 },
      { name: "Remada Curvada com Barra", order: 1, sets: 4, reps: 10, restTimeInSeconds: 90 },
      { name: "Remada Unilateral com Halter", order: 2, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Pulley Frente (Pegada Fechada)", order: 3, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Rosca Direta com Barra", order: 4, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Rosca Martelo com Halteres", order: 5, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Rosca Concentrada", order: 6, sets: 3, reps: 10, restTimeInSeconds: 60 },
    ],
  },
  {
    name: "Pernas + Glúteos",
    weekDay: "WEDNESDAY",
    isRest: false,
    estimatedDurationInSeconds: 4200, // 70 min
    coverImageUrl: "http://localhost:8081/public/workouts/legs.png",
    exercises: [
      { name: "Agachamento Livre com Barra", order: 0, sets: 4, reps: 10, restTimeInSeconds: 120 },
      { name: "Leg Press 45°", order: 1, sets: 4, reps: 12, restTimeInSeconds: 90 },
      { name: "Cadeira Extensora", order: 2, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Mesa Flexora", order: 3, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Avanço (Passada) com Halteres", order: 4, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Stiff com Barra", order: 5, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Panturrilha no Leg Press", order: 6, sets: 4, reps: 15, restTimeInSeconds: 45 },
      { name: "Panturrilha em Pé na Máquina", order: 7, sets: 4, reps: 15, restTimeInSeconds: 45 },
    ],
  },
  {
    name: "Ombros + Trapézio",
    weekDay: "THURSDAY",
    isRest: false,
    estimatedDurationInSeconds: 3300, // 55 min
    coverImageUrl: "http://localhost:8081/public/workouts/shoulders.png",
    exercises: [
      { name: "Desenvolvimento com Halteres", order: 0, sets: 4, reps: 10, restTimeInSeconds: 90 },
      { name: "Elevação Lateral com Halteres", order: 1, sets: 4, reps: 12, restTimeInSeconds: 60 },
      { name: "Elevação Frontal com Halter", order: 2, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Crucifixo Inverso na Máquina", order: 3, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Encolhimento com Halteres", order: 4, sets: 4, reps: 12, restTimeInSeconds: 60 },
      { name: "Remada Alta com Barra", order: 5, sets: 3, reps: 12, restTimeInSeconds: 60 },
    ],
  },
  {
    name: "Braços (Bíceps + Tríceps)",
    weekDay: "FRIDAY",
    isRest: false,
    estimatedDurationInSeconds: 3000, // 50 min
    coverImageUrl: "http://localhost:8081/public/workouts/arms.png",
    exercises: [
      { name: "Rosca Direta com Barra W", order: 0, sets: 4, reps: 10, restTimeInSeconds: 60 },
      { name: "Rosca Martelo com Halteres", order: 1, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Rosca Scott na Máquina", order: 2, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Tríceps Corda na Polia", order: 3, sets: 4, reps: 10, restTimeInSeconds: 60 },
      { name: "Tríceps Testa com Barra W", order: 4, sets: 3, reps: 12, restTimeInSeconds: 60 },
      { name: "Tríceps Mergulho entre Bancos", order: 5, sets: 3, reps: 12, restTimeInSeconds: 60 },
    ],
  },
  {
    name: "Descanso",
    weekDay: "SATURDAY",
    isRest: true,
    estimatedDurationInSeconds: 0,
    exercises: [],
  },
  {
    name: "Descanso",
    weekDay: "SUNDAY",
    isRest: true,
    estimatedDurationInSeconds: 0,
    exercises: [],
  },
];

async function main() {
  console.log("🌱 Iniciando seed...");

  // Find the first existing user
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error("❌ Nenhum usuário encontrado. Faça login primeiro e rode o seed novamente.");
    process.exit(1);
  }

  console.log(`👤 Usuário encontrado: ${user.name} (${user.email})`);

  // Delete existing workout plans for this user to avoid duplicates
  await prisma.workoutPlan.deleteMany({
    where: { userId: user.id },
  });

  console.log("🗑️  Planos anteriores removidos.");

  // Create the workout plan
  const workoutPlan = await prisma.workoutPlan.create({
    data: {
      name: "Plano ABCDE - Hipertrofia",
      userId: user.id,
      isActive: true,
      workoutDays: {
        create: workoutDays.map((day) => ({
          name: day.name,
          weekDay: day.weekDay,
          isRest: day.isRest,
          estimatedDurationInSeconds: day.estimatedDurationInSeconds,
          coverImageUrl: day.coverImageUrl,
          exercises: {
            create: day.exercises,
          },
        })),
      },
    },
    include: {
      workoutDays: {
        include: {
          exercises: true,
        },
      },
    },
  });

  console.log(`\n✅ Plano de treino criado: "${workoutPlan.name}"`);
  console.log(`📋 ID: ${workoutPlan.id}\n`);

  for (const day of workoutPlan.workoutDays) {
    const duration = day.estimatedDurationInSeconds > 0
      ? `${Math.round(day.estimatedDurationInSeconds / 60)} min`
      : "—";
    console.log(`  📅 ${day.weekDay.padEnd(9)} | ${day.name.padEnd(25)} | ${day.isRest ? "🛌 Descanso" : `💪 ${day.exercises.length} exercícios | ⏱️  ${duration}`}`);
  }

  console.log("\n🎉 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
