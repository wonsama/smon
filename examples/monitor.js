// src/util/monitor.js
//
// 예시) 스팀 블록체인 모니터링

import Monitor from '../src/util/monitor.js';
import cleanup from '../src/util/cleanup.js';
import debug from 'debug';

// import dsteem from '@upvu/dsteem';

const log = debug('app:log:monitor');
const info = debug('app:info:monitor');
const err = debug('app:err:monitor');

const TIME_SLEEP = parseInt(process.env.TIME_SLEEP || '3000');

// 예제 comment, transfer 오퍼레이션을 모니터링
// 주의 ! 결과는 buffer 에 담아서 순차 적으로 처리 하는 것을 추천
// 실시간으로는 모니터링 해도 상관 없으나 작업 처리시에는 시간이 걸리기 때문
// STEEMIT 의 경우 글쓰기 10분, 댓글 3초 등의 제약 등이 있음.
// 또한 적절한 SP(steem power) 가 필요함
let PROGRAM_IS_EXIT = false;
let mon = new Monitor('./data/block.json');
let jobs = [];

// 1. 모니터링 대상 항목 지정
mon.add('comment', function (payload) {
  if (payload.data.title && !payload.data.parent_author) {
    // comment
    // log('comment', payload.data);
  } else {
    // reply
    jobs.push(['reply', payload.data]);
    info('=====> reply added', jobs.length, 'reply', payload.data.body);
  }
});
mon.add('transfer', function (payload) {
  // log('transfer', payload.data);
});
mon.start();

// 2. 종료 처리
cleanup(() => {
  // TODO : CLEANUP
  PROGRAM_IS_EXIT = true;
  info('program exited');
});

// 3. 작업 처리
while (!PROGRAM_IS_EXIT) {
  if (jobs.length > 0) {
    let job = jobs.shift();
    // TODO : job 을 가지고 작업 수행
    let command = job[0];
    let payload = job[1];
    if (command == 'reply') {
      info('<===== jobs removed', jobs.length, command, payload.parent_permlink);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, TIME_SLEEP));
}
