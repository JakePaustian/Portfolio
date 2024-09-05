import express, { Express } from "express";
import dotenv from "dotenv";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import bodyParser from 'body-parser';
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {chat} from "./chat";
import fs from "fs/promises";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import cors from 'cors';
import WebSocket from 'ws';
import * as fs2 from 'fs';
import * as https from "https";

dotenv.config();
const embeddings = new OpenAIEmbeddings();

export const app: Express = express();
app.use(cors()); // This will add CORS headers to the responses from your server

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

const port = process.env.PORT;

export let history: any[] = [];
export let vectorstore: MemoryVectorStore;

const server = https.createServer({
    cert: fs2.readFileSync('cert.pem'),
    key: fs2.readFileSync('key.pem')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', async message => {
        const request = JSON.parse(message.toString());
        if (!request || !request.message) {
            ws.send(JSON.stringify({
                status: 400,
                message: request ? "Missing message in request." : "Missing body in request"
            }));
            return;
        }
        console.log(request.message + "\n");

        await chat(request.message, ws);
    });
});

server.listen(8080);

// Ran on start up
app.listen(port,async () => {
    const resume = "JakePaustian_resume_2024.pdf";

    // Read the file as a buffer
    const buffer = await fs.readFile(resume);

    // Create a Blob from the buffer
    const resumeBlob = new Blob([buffer], { type: "application/pdf" });

    const loader = new WebPDFLoader(resumeBlob, {});

    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter();

    const splitDocs = await splitter.splitDocuments(docs);
    vectorstore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings
    );
    console.log(splitDocs.length);
    console.log(splitDocs[0].pageContent.length);
});