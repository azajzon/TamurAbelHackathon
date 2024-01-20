// pages/api/assistant.js
import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY='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';

const openai = new OpenAIApi(new Configuration({
  apiKey: OPENAI_API_KEY
}));

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Assuming you send the message text in the body of the POST request
      const { message } = req.body;

      // Create an Assistant and send a message
      const assistantResponse = await openai.beta.assistants.create({
        name: "Student Counselor Assistant",
        instructions: "You are a personal student counselor. Answer the users questions.",
        tools: [{ type: "retrieval"}],
        model: "gpt-3.5-turbo-1106",
      });

      // add a message to the Assistant's thread and get a response
      const response = await openai.beta.assistants.addMessage({
        assistant: assistant.data.id,
        message: {
          content: message
        }
      });

      res.status(200).json({ assistantResponse });
      
    } catch (error) {
      console.error('Assistant API error:', error);
      res.status(500).json({ message: 'Assistant API error occurred.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
