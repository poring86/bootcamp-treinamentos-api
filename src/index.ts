import "dotenv/config";

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import Fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const app = Fastify({
    logger: true
});

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

await app.register(fastifySwagger, {
   openApi: {
    info: {
        title: "Bootcamp Treinamentos API",
        description: "API de treinamentos",
        version: "1.0.0"
    }
   },
   servers: [
    {
         description: "Local",
        url: "http://localhost:8081",
       
    }
   ]
})

await app.register(fastifySwaggerUI, {
    routePrefix: '/docs'
})

app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
        description: "Hello world",
        tags: ["hello"],
        response: {
            200: z.object({
                message: z.string()
            })
        },
        servers: []
    },
    transform: jsonSchemaTransform
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
