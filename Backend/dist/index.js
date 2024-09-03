"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorstore = exports.history = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const text_splitter_1 = require("langchain/text_splitter");
const body_parser_1 = __importDefault(require("body-parser"));
const openai_1 = require("@langchain/openai");
const memory_1 = require("langchain/vectorstores/memory");
const chat_1 = require("./chat");
const cheerio_1 = require("langchain/dist/document_loaders/web/cheerio");
dotenv_1.default.config();
const embeddings = new openai_1.OpenAIEmbeddings();
exports.app = (0, express_1.default)();
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use(body_parser_1.default.json());
const port = process.env.PORT;
exports.history = [];
exports.app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, chat_1.chat)(req, res);
}));
// Ran on start up
exports.app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    const loader = new cheerio_1.CheerioWebBaseLoader("https://www.linkedin.com/in/jake-paustian/");
    const docs = yield loader.load();
    const splitter = new text_splitter_1.RecursiveCharacterTextSplitter();
    const splitDocs = yield splitter.splitDocuments(docs);
    exports.vectorstore = yield memory_1.MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    console.log(splitDocs.length);
    console.log(splitDocs[0].pageContent.length);
}));
