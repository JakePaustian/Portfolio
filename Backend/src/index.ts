import express, { Express } from "express";
import dotenv from "dotenv";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import bodyParser from 'body-parser';
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {chat} from "./chat";

dotenv.config();
const embeddings = new OpenAIEmbeddings();

export const app: Express = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

const port = process.env.PORT;

export let history: any[] = [];
export let vectorstore: MemoryVectorStore;

app.post("/chat", async (req, res) => {
    await chat(req, res);
});

// Ran on start up
app.listen(port,async () => {
    const loader = new CheerioWebBaseLoader(
        "https://www.linkedin.com/in/jake-paustian/"
    );

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