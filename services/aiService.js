// services/aiService.js
const AWS = require("aws-sdk");
const Department = require("../models/Department");
const { json } = require("body-parser");

const bedrock = new AWS.BedrockRuntime({
  region: process.env.AWS_REGION,
});

class AIService {
  static async classifyIssue(text) {
    // fetch department list for prompt
    const depts = await Department.getAll();
    const options = depts.map((d) => `${d.name}`).join("\n");
    const systemPrompt = `
You are a hospital triage assistant.  
Here are our departments:
${options}

A few examples:
  - Issue: "I have a headache"
    = {"Department":"Neurology","explanation":"Headaches are best evaluated by neurology specialists"}
  - Issue: "Shortness of breath"
    = {"Department":"Pulmonology","explanation":"Respiratory symptoms go to pulmonology"}

Now, for this issue:
"${text}"

Return ONLY the JSON object, no extra text:
{"Department":"<department name>","explanation":"<short reason>"}
`.trim();

    const params = {
      modelId: process.env.BEDROCK_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: systemPrompt,
        textGenerationConfig: {
          temperature: 0.0,
          topP: 1.0,
        },
      }),
    };

    let resp = await bedrock.invokeModel(params).promise();

    if (!resp.body) {
      throw new Error("Response body is undefined");
    }

    const body = JSON.parse(resp.body.toString());
    const picked = body.results?.[0]?.outputText?.trim();

    // Remove backticks and any markdown formatting
    const cleanedResponse = picked.replace(/```json|```/g, "").trim();

    console.log(`Picked response: ${cleanedResponse}`);

    const parsedResult = JSON.parse(cleanedResponse);

    console.log(parsedResult);

    // Find the department by name to get its ID
    const department = await Department.getByName(parsedResult.Department);
    if (!department) {
      throw new Error(`Department "${parsedResult.Department}" not found`);
    }

    // Return the UUID and explanation
    return {
      UUID: department.id,
      explanation: parsedResult.explanation,
    };
  }
}

module.exports = AIService;
