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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const openai_1 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const combine_documents_1 = require("langchain/chains/combine_documents");
const retrieval_1 = require("langchain/chains/retrieval");
const messages_1 = require("@langchain/core/messages");
const index_1 = require("./index");
function chat(req, res) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body == undefined) {
            res.status(400).send("Missing body in request");
            return;
        }
        else if (req.body.message == undefined) {
            res.status(400).send("Missing message in request.");
            return;
        }
        console.log(req.body.message + "\n");
        const chat = new openai_1.ChatOpenAI({
            openAIApiKey: process.env.OPEN_AI_API_KEY,
            modelName: "gpt-3.5-turbo",
            temperature: 0.2,
            cache: true,
        });
        const retriever = index_1.vectorstore.asRetriever();
        const historyAwarePrompt = prompts_1.ChatPromptTemplate.fromMessages([
            new prompts_1.MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
            [
                "user",
                "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation." +
                    "If the user does not ask questions related to Jake Paustian, please do not entertain their conversation, but instead politely" +
                    "tell them they need to ask question only related to Jake Paustian.",
            ],
        ]);
        const historyAwareRetrievalPrompt = prompts_1.ChatPromptTemplate.fromMessages([
            [
                "system",
                "You are speaking to an employer who is looking at Jake Paustian, a Software Engineer, and his online resume." +
                    "You need to speak to the employer and sell Jake Paustian as a fantastic engineer." +
                    "Answer the user's questions based on the below context:\n\n{context}",
            ],
            new prompts_1.MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
        ]);
        const historyAwareRetrieverChain = yield (0, history_aware_retriever_1.createHistoryAwareRetriever)({
            llm: chat,
            retriever,
            rephrasePrompt: historyAwarePrompt
        });
        const historyAwareCombineDocsChain = yield (0, combine_documents_1.createStuffDocumentsChain)({
            llm: chat,
            prompt: historyAwareRetrievalPrompt,
        });
        const conversationalRetrievalChain = yield (0, retrieval_1.createRetrievalChain)({
            retriever: historyAwareRetrieverChain,
            combineDocsChain: historyAwareCombineDocsChain,
        });
        const response = yield conversationalRetrievalChain.stream({
            chat_history: index_1.history,
            input: req.body.message,
        });
        index_1.history.push(new messages_1.HumanMessage(req.body.message));
        let responseString = "";
        try {
            for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _d = true) {
                _c = response_1_1.value;
                _d = false;
                const chunk = _c;
                if (chunk != undefined && chunk.answer != undefined) {
                    responseString += chunk.answer;
                    process.stdout.write(chunk.answer);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = response_1.return)) yield _b.call(response_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log();
        index_1.history.push(new messages_1.AIMessage(responseString));
        res.status(200).send();
    });
}
exports.chat = chat;
