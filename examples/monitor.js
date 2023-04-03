import Monitor from '../src/util/monitor.js';
import debug from 'debug';
// import dsteem from '@upvu/dsteem';

const log = debug('app:log');
const err = debug('app:err');

// 예제 comment, transfer 오퍼레이션을 모니터링
// 주의 ! 결과는 buffer 에 담아서 순차 적으로 처리 하는 것을 추천
// 실시간으로는 모니터링 해도 상관 없으나 작업 처리시에는 시간이 걸리기 때문
// STEEMIT 의 경우 글쓰기 10분, 댓글 3초 등의 제약 등이 있음.
// 또한 적절한 SP(steem power) 가 필요함
let mon = new Monitor('./data/block.json');
mon.add('comment', function (payload) {
  if (!payload.data.title && payload.data.body) {
    // reply
    // console.log('comment', payload.data);
  } else {
    // comment
    console.log('comment', payload.data);
  }
});
mon.add('transfer', function (payload) {
  // console.log('transfer', payload.data);
});
mon.start();
