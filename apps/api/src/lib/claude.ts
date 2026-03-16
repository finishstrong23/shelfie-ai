import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn('ANTHROPIC_API_KEY not set — AI features will not work');
}

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});
