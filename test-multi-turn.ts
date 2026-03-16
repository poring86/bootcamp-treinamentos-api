
import "dotenv/config";

const token = "GaBWqf5evcuSdJR59mY0p5qKec7bbZeH";
const url = "http://localhost:8080/ai";

async function testMultiTurn() {
  console.log("--- Turn 1 ---");
  const response1 = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `better-auth.session_token=${token}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      "Origin": "http://localhost:3000",
      "Referer": "http://localhost:3000/"
    },
    body: JSON.stringify({
      messages: [
        { id: "1", role: "user", parts: [{ type: "text", text: "Oi, meu nome é Matheus. Como voce pode me ajudar hoje?" }] }
      ]
    })
  });

  console.log(`Status Turn 1: ${response1.status}`);
  await response1.text();
  console.log("Turn 1 complete.");

  console.log("\n--- Turn 2 ---");
  const response2 = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `better-auth.session_token=${token}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      "Origin": "http://localhost:3000",
      "Referer": "http://localhost:3000/"
    },
    body: JSON.stringify({
      messages: [
        { id: "1", role: "user", parts: [{ type: "text", text: "Oi, meu nome é Matheus. Como voce pode me ajudar hoje?" }] },
        { id: "2", role: "assistant", parts: [{ type: "text", text: "Olá Matheus! Posso te ajudar a montar um treino. Qual seu objetivo?" }] },
        { id: "3", role: "user", parts: [{ type: "text", text: "Quero ganhar massa muscular" }] }
      ]
    })
  });

  console.log(`Status Turn 2: ${response2.status}`);
  await response2.text();
  console.log("Turn 2 complete.");

  console.log("\n--- Turn 3 ---");
  const response3 = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `better-auth.session_token=${token}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      "Origin": "http://localhost:3000",
      "Referer": "http://localhost:3000/"
    },
    body: JSON.stringify({
      messages: [
        { id: "1", role: "user", parts: [{ type: "text", text: "Oi, meu nome é Matheus. Como voce pode me ajudar hoje?" }] },
        { id: "2", role: "assistant", parts: [{ type: "text", text: "Olá Matheus! Posso te ajudar a montar um treino. Qual seu objetivo?" }] },
        { id: "3", role: "user", parts: [{ type: "text", text: "Quero ganhar massa muscular" }] },
        { id: "4", role: "assistant", parts: [{ type: "text", text: "Entendido! Hipertrofia. Em quantos dias por semana você pode treinar?" }] },
        { id: "5", role: "user", parts: [{ type: "text", text: "Posso treinar 4 dias" }] }
      ]
    })
  });

  console.log(`Status Turn 3: ${response3.status}`);
  const finalResponse = await response3.text();
  console.log("Turn 3 response length:", finalResponse.length);
  if (finalResponse.includes("error")) {
    console.log("Error in Turn 3:", finalResponse);
  } else {
    console.log("Turn 3 success!");
  }
}

testMultiTurn();
