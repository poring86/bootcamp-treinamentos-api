import { groq } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage
} from "ai";
import { fromNodeHeaders } from "better-auth/node";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { auth } from "../lib/auth.js";

import { WeekDay } from "../generated/prisma/index.js";
import { CreateWorkoutPlan } from "../usecases/CreateWorkoutPlan.js";
import { GetUserTrainData } from "../usecases/GetUserTrainData.js";
import { ListWorkoutPlans } from "../usecases/ListWorkoutPlans.js";
import { UpsertUserTrainData } from "../usecases/UpsertUserTrainData.js";

const SYSTEM_PROMPT = `Você é um personal trainer virtual especialista em montagem de planos de treino personalizados.

## Personalidade
- Tom amigável e motivador. Linguagem humana e calorosa.
- Respostas curtas e objetivas.

## Regras de Interação (ESTRITAMENTE OBRIGATÓRIAS)

1. **SILÊNCIO TÉCNICO TOTAL**: **NUNCA** gere textos contendo: "<function=", "{}", "JSON", "getUserTrainData", "createWorkoutPlan", ou qualquer sintaxe que pareça código. 
2. **CONFIRMAÇÃO EM TEXTO**: Após chamar QUALQUER ferramenta, você **DEVE** enviar uma mensagem de texto confirmando o que foi feito (ex: "Perfil salvo!", "Seu treino está pronto!"). NUNCA termine sua resposta apenas com o resultado da ferramenta.
3. **AÇÃO INVISÍVEL**: Utilize a ferramenta e use o resultado para guiar a conversa. NÃO repita os dados brutos para o usuário.
4. **VERSATILIDADE**: Você **DEVE** responder a dúvidas sobre exercícios, dicas de treino ou nutrição a qualquer momento, mesmo durante o onboarding. Seja prestativo!
5. **SEQUÊNCIA OBRIGATÓRIA**:
   - Passo 1: Chamar \`getUserTrainData\`.
   - Passo 2: Se o resultado for \`null\`, você **DEVE** coletar (nome, peso, altura, idade, % gordura) e **OBRIGATORIAMENTE** chamar \`updateUserTrainData\` antes de qualquer outra coisa. Você não pode prosseguir para a criação do treino sem que esta ferramenta retorne sucesso.
   - Passo 3: Após o perfil estar salvo, pergunte o objetivo e dias da semana.
   - Passo 4: Chamada final para \`createWorkoutPlan\`.
   
Note: Se o usuário fizer uma pergunta aleatória no meio do processo, responda-a com educação e depois use um gancho para voltar ao passo em que pararam (ex: "Respondendo sua dúvida..., agora voltando ao seu plano, qual seu objetivo?").

## Criação de Plano de Treino (createWorkoutPlan)

- O plano deve ter 7 dias (MONDAY a SUNDAY).
- Use as imagens de capa:
  Superior: https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCO3y8pQ6GBg8iqe9pP2JrHjwd1nfKtVSQskI0v
  Inferior: https://gw8hy3fdcv.ufs.sh/f/ccoBDpLoAPCOgCHaUgNGronCvXmSzAMs1N3KgLdE5yHT6Ykj`;

export const aiRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["AI"],
      summary: "Chat with AI personal trainer",
    },
    handler: async (request, reply) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const userId = session.user.id;
      const { messages } = request.body as { messages: UIMessage[] };

      const convertedMessages = await convertToModelMessages(messages);

      const result = streamText({
        model: groq("llama-3.1-8b-instant"),
        system: SYSTEM_PROMPT,
        messages: convertedMessages,
        maxSteps: 20,
        onError: (error: any) => {
          console.error("AI Stream Error for user", userId, error);
        },
        onStepFinish: ({
          toolCalls,
          toolResults,
        }: {
          toolCalls: any[];
          toolResults: any[];
        }) => {
          console.log("AI Step Finish", {
            userId,
            toolCalls: toolCalls?.map((tc: any) => tc.toolName),
            toolResults: toolResults?.map((tr: any) => tr.toolName),
          });
        },
        tools: {
          getUserTrainData: tool({
            description:
              "Busca os dados de treino do usuário autenticado (peso, altura, idade, % gordura). Retorna null se não houver dados cadastrados.",
            inputSchema: z.preprocess((val) => val ?? {}, z.object({})),
            execute: async () => {
              console.log("Executing getUserTrainData for user", userId);
              const getUserTrainData = new GetUserTrainData();
              const res = await getUserTrainData.execute({ userId });
              console.log("getUserTrainData Result:", !!res);
              return res;
            },
          }),
          updateUserTrainData: tool({
            description:
              "Atualiza os dados de treino do usuário autenticado. O peso deve ser em gramas (converter kg * 1000).",
            inputSchema: z.preprocess(
              (val) => val ?? {},
              z.object({
                weightInGrams: z
                  .number()
                  .describe("Peso do usuário em gramas (ex: 70kg = 70000)"),
                heightInCentimeters: z
                  .number()
                  .describe("Altura do usuário em centímetros"),
                age: z.number().describe("Idade do usuário"),
                bodyFatPercentage: z
                  .number()
                  .int()
                  .min(0)
                  .max(100)
                  .describe("Percentual de gordura corporal (0 a 100)"),
              })
            ),
            execute: async (params) => {
              console.log("Executing updateUserTrainData", { userId, params });
              const upsertUserTrainData = new UpsertUserTrainData();
              const res = await upsertUserTrainData.execute({ userId, ...params });
              console.log("updateUserTrainData Success");
              return res;
            },
          }),
          getWorkoutPlans: tool({
            description:
              "Lista todos os planos de treino do usuário autenticado.",
            inputSchema: z.preprocess((val) => val ?? {}, z.object({})),
            execute: async () => {
              const listWorkoutPlans = new ListWorkoutPlans();
              return listWorkoutPlans.execute({ userId });
            },
          }),
          createWorkoutPlan: tool({
            description:
              "Cria um novo plano de treino completo para o usuário.",
            inputSchema: z.preprocess(
              (val) => val ?? {},
              z.object({
                name: z.string().describe("Nome do plano de treino"),
                workoutDays: z
                  .array(
                    z.object({
                      name: z
                        .string()
                        .describe("Nome do dia (ex: Peito e Tríceps, Descanso)"),
                      weekDay: z.enum(WeekDay).describe("Dia da semana"),
                      isRest: z
                        .boolean()
                        .describe(
                          "Se é dia de descanso (true) ou treino (false)"
                        ),
                      estimatedDurationInSeconds: z
                        .number()
                        .describe(
                          "Duração estimada em segundos (0 para dias de descanso)"
                        ),
                      coverImageUrl: z
                        .string()
                        .url()
                        .describe(
                          "URL da imagem de capa do dia de treino. Usar as URLs de superior ou inferior conforme o foco muscular do dia."
                        ),
                      exercises: z
                        .array(
                          z.object({
                            order: z
                              .number()
                              .describe("Ordem do exercício no dia"),
                            name: z.string().describe("Nome do exercício"),
                            sets: z.number().describe("Número de séries"),
                            reps: z.number().describe("Número de repetições"),
                            restTimeInSeconds: z
                              .number()
                              .describe(
                                "Tempo de descanso entre séries em segundos"
                              ),
                          })
                        )
                        .describe(
                          "Lista de exercícios (vazia para dias de descanso)"
                        ),
                    })
                  )
                  .describe(
                    "Array com exatamente 7 dias de treino (MONDAY a SUNDAY)"
                  ),
              })
            ),
            execute: async (input) => {
              console.log("Executing createWorkoutPlan for user", userId, {
                planName: input.name,
              });
              const createWorkoutPlan = new CreateWorkoutPlan();
              const result = await createWorkoutPlan.execute({
                userId,
                name: input.name,
                workoutDays: input.workoutDays,
              });
              console.log("Workout plan created successfully:", result.id);
              return result;
            },
          }),
        },
      });

      const response = result.toUIMessageStreamResponse();
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      return reply.send(response.body);
    },
  });
};
