import "dotenv/config";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const app = Fastify({
    logger: true
});

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get("/", async (request, reply) => {
    return { hello: "world" };
});

app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    schema: {
        description: "Hello world",
        tags: ["hello"],
        response: {
            200: z.object({
                message: z.string()
            })
        }
    },
    handler: async () => {
        return { message: 'Hellow World' }
    }
})

try{
    const port = Number(process.env.PORT) || 8081;
    app.listen({ port }, () => {
        console.log(`Server running on port ${port}`);
    });
}catch(err){
    app.log.error(err);
    process.exit(1);
}
