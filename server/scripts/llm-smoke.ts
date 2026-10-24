// Quick manual check that the LLM wrapper works end to end: npm run llm:smoke -w server
import { callModel } from '../src/llm';

const result = await callModel({
  tag: 'smoke',
  system:
    'You are Thomas Hale, the night attendant on the Midnight Express, 1934. Answer in one or two sentences, in character.',
  messages: [{ role: 'user', content: 'Where were you at half past nine tonight?' }],
  temperature: 0.8,
});

console.log('\nReply:', result.text);
console.log('Usage:', result.usage, `| ${result.latencyMs}ms | attempts: ${result.attempts}`);
