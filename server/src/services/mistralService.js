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
exports.analyzeCode = void 0;
const mistralai_1 = require("@mistralai/mistralai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mistral = new mistralai_1.Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});
const analyzeCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = `
You are a professional smart contract auditor.
Analyze the following Solidity code for:

1. Security vulnerabilities
2. Gas inefficiencies
3. Best practice violations
4. Logical errors

Return your response in structured JSON format with keys:
"security", "gas", "bestPractices", and "suggestions".

Solidity Code:
${code}
`;
    const completion = yield mistral.chat.complete({
        model: "mistral-large-latest", // or mistral-small-latest depending on your plan
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
    });
    let response = (_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : "";
    if (typeof response !== "string") {
        throw new Error("Invalid response format from Mistral.");
    }
    const cleaned = cleanJsonString(response);
    try {
        return JSON.parse(cleaned);
    }
    catch (err) {
        console.warn("❗ Failed to parse JSON. Sending raw string.");
        return { raw: cleaned };
    }
});
exports.analyzeCode = analyzeCode;
const cleanJsonString = (raw) => {
    return raw
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();
};
