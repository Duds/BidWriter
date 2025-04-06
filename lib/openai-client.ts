   // lib/openai-client.ts
   import OpenAI from 'openai'

   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   })

   export async function generateResponse(prompt: string): Promise<string> {
     const response = await openai.chat.completions.create({
       model: 'gpt-4', // or 'gpt-3.5-turbo'
       messages: [{ role: 'user', content: prompt }],
     })

     const content = response.choices[0]?.message.content
     if (!content) {
       throw new Error('No content returned from OpenAI')
     }
     return content
   }