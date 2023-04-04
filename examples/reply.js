// src/util/reply.js
//
// 예시) 스팀잇 댓글 봇
// 댓글을 생성 해준다

import debug from 'debug';
import { reply } from '../src/util/steemapi.js';

const log = debug('app:log');
const err = debug('app:err');

reply('wonsama', 'gptbot', 'gptbot', 'test')
  .then((result) => {
    log('result', result);
  })
  .catch((error) => {
    log('error', error);
  });
