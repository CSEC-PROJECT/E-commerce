import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyC9mPt77_LosiNRcn7ohoZHu-tfpMiuDP4`);
    const data = await response.json();
    console.log(data.models.map(m => m.name).join("\n"));
  } catch (error) {
    console.error("List error:", error.message);
  }
}
listModels();
