// pages/api/assistant.js
import { Configuration, OpenAI } from "openai";

const OPENAI_API_KEY='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';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      
      // keeps history and doesn't keep creating new assistants
      let assistant = await openai.beta.assistants.retrieve(
        "asst_9S3EXX6e5DOvmMruz24iDxta"
      );

      // create an assistant if needed
      if (!assistant) {
        assistant = await openai.beta.assistants.create({
          name: "Student Counselor Assistant",
          instructions: "You are a personal Purdue student counselor. Answer the users questions.",
          tools: [{ type: "retrieval"}],
          model: "gpt-3.5-turbo-1106",
        });
      } 

      // create a thread
      const thread = await openai.beta.threads.create();

      // get user input that will be sent as message in thread
      const {userInput} = req.body;
      console.log("User input sending in message: ", userInput)

      // add message to a thread
      const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: userInput
        }
      );

      // run the assistant
      const run = await openai.beta.threads.runs.create(
        thread.id,
        { 
          assistant_id: assistant.id,
        }
      );

      let runRetrieve = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log("FIRST RUN RETRIEVE: ", runRetrieve)
      
      // polling for completion
      while (runRetrieve.status !== 'completed' && runRetrieve.status !== 'failed') {
        // Wait for a bit before polling again
        await new Promise(resolve => setTimeout(resolve, 5000));
        runRetrieve = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        console.log("MORE RUN RETRIEVE: ", runRetrieve)
      }

      // retrieve the list of messages from the thread after the run is complete
      const messagesResponse = await openai.beta.threads.messages.list(thread.id);

      // find messages from assistant and extract content
      const assistantMessages = messagesResponse.data.filter(msg => msg.role === 'assistant');
      const assistantResponse = assistantMessages.map(msg => msg.content);

      console.log("RESPONSE FROM AI:", JSON.stringify(assistantResponse, null, 2));
      console.log("EXTRACTED RESPONSE: ", assistantResponse[0][0].text.value)

      // send the responses back to the client
      res.status(200).json({ message: assistantResponse[0][0].text.value });


    } catch (error) {
      console.error('Assistant API error:', error);
      res.status(500).json({ message: 'Assistant API error occurred.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
