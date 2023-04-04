// src/util/mixin.js
//
// 예시) 번역, 요약 등의 기능을 모아서 사용한다.

import { getContent, removeCodeBlock } from '../src/util/steemapi.js';

import debug from 'debug';
import dotenv from 'dotenv';
import openai from '../src/util/openai.js';
import removeMd from 'remove-markdown';
import { translate } from '../src/util/translate.js';

dotenv.config();

const log = debug('app:log:test');
const info = debug('app:info:test');

async function init() {
  // 설정 정보
  const TRANSLATE_PARENT = process.env.TRANSLATE_PARENT;

  // 기본 정보
  // https://steemit.com/hive-129948/@rme/4s2gma
  let author = 'rme';
  let permlink = '4s2gma';

  // 요약 글 정보 가져오기
  info(`get content - author : ${author}, permlink : ${permlink}`);
  let cont = await getContent(author, permlink);
  let rcode = removeCodeBlock(cont.body);
  let ori = removeMd(rcode).replace(/(\r\n|\n|\r)/gm, '');
  log(ori);
  info('====================================');

  // 영문 변환
  info(`translate -> en`);
  let eng = await translate(ori, 'en', TRANSLATE_PARENT);
  log(eng);
  info('====================================');

  // GPT 요약
  info(`gpt summarize to english`);
  let prompts = [
    { role: 'user', content: 'summarize the sentence below' },
    { role: 'user', content: eng },
  ];
  let gpt = await openai(prompts);
  log(gpt);
  info('====================================');

  // 한글 변환
  info(`translate - en -> ko`);
  let kor = await translate(gpt, 'ko', TRANSLATE_PARENT);
  log(kor);
  info('====================================');
}
init();
