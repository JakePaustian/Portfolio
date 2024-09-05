import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import {createHistoryAwareRetriever} from "langchain/chains/history_aware_retriever";
import {createStuffDocumentsChain} from "langchain/chains/combine_documents";
import {createRetrievalChain} from "langchain/chains/retrieval";
import {AIMessage, HumanMessage} from "@langchain/core/messages";
import {vectorstore, history} from "./index";
import WebSocket from 'ws';

export async function chat(message: string, ws: WebSocket) {

    const chat = new ChatOpenAI({
        openAIApiKey: process.env.OPEN_AI_API_KEY,
        modelName: "gpt-3.5-turbo",
        temperature: 0.2,
        cache: true,
    });

    const retriever = vectorstore.asRetriever();
    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
        [
            "user",
            "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation." +
            "If the user does not ask questions related to Jake Paustian, please do not entertain their conversation, but instead politely" +
            "tell them they need to ask question only related to Jake Paustian.",
        ],
    ]);

    const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You're name is JakeGPT. You are speaking to an employer who is looking at Jake Paustian, a Software Engineer, and his online resume." +
            "You need to speak to the employer and sell Jake Paustian as a fantastic engineer." +
            "Answer the user's questions based on the below context:\n\n{context}",
        ],
        new MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
        llm: chat,
        retriever,
        rephrasePrompt: historyAwarePrompt
    });

    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
        llm: chat,
        prompt: historyAwareRetrievalPrompt,
    });

    const conversationalRetrievalChain = await createRetrievalChain({
        retriever: historyAwareRetrieverChain,
        combineDocsChain: historyAwareCombineDocsChain,
    });

    const response = await conversationalRetrievalChain.stream({
        chat_history: history,
        input: message,
    });

    history.push(new HumanMessage(message));

    let responseString = "";
    for await (const chunk of response) {
        if (chunk != undefined && chunk.answer != undefined) {
            responseString += chunk.answer;
            process.stdout.write(chunk.answer);
            ws.send(JSON.stringify({
                status: 200,
                message: chunk.answer
            }));
        }
    }
    console.log("\n\n");
    ws.close(1000); // 200, but for WebSockets
    history.push(new AIMessage(responseString));
}