// services/aiService.js
const AWS = require('aws-sdk');
const Department = require('../models/Department');

const bedrock = new AWS.BedrockRuntime({
  region: process.env.AWS_REGION
});

class AIService {
  static async classifyIssue(text) {
    // fetch department list for prompt
    const depts = await Department.getAll();
    const options = depts.map(d => `${d.id}: ${d.name}`).join('\n');
    const systemPrompt = `
You are a medical triage assistant. Here are the possible departments:
${options}

User issue:
"${text}"

Respond with the single best department ID.`;

    const params = {
      ModelId: process.env.BEDROCK_MODEL_ID,
      ContentType: 'application/json',
      Accept: 'application/json',
      Body: JSON.stringify({ prompt: systemPrompt })
    };

    const resp = await bedrock.invokeModel(params).promise();
    const body = JSON.parse(resp.Body.toString());
    const picked = body.choices?.[0]?.text?.trim();
    return picked;
  }
}

module.exports = AIService;
