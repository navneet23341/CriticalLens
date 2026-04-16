import axios from "axios";

async function testAI() {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-3.5-turbo", // SAFE working model
      messages: [
        { role: "user", content: "Say hello like an interviewer" }
      ]
    },
    {
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      }
    }
  );

  console.log(response.data.choices[0].message.content);
}

testAI();