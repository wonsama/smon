// src/util/openai.js
//
// open ai 사의 chat gpt 를 사용하기 위함.
// 비용 절감을 위해 gpt-3.5-turbo 모델을 사용한다.

import { Configuration, OpenAIApi } from 'openai';

import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (prompts) {
  let messages = [];
  // { role: 'user', content: 'summarize the sentence below' }
  // { role: 'user', content: '아래 결과를 한국어로 요약해줘' }
  messages.push(...prompts);

  const response = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo', // 사용할 모델
    messages: messages, // 채팅의 이전 메시지
    max_tokens: 1000, // 생성할 토큰의 개수
    temperature: 0.7, // 0.0 ~ 1.0
    top_p: 1, // 0.0 ~ 1.0
    n: 100, // 생성할 문장의 개수
  });

  return response.data.choices[0]['message']['content'];
}
