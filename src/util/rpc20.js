// src/util/rpc20.js
//
// rpc20 호출을 위한 함수들을 정의한다
// steemapi 가 존재하기는 하지만 모니터링시에는 좀더 디테일하게 조작하기위해 별도 모듈을 만들었다

import axios from 'axios';
import debug from 'debug';
import dotenv from 'dotenv';
dotenv.config();

const STEEM_API_URL = process.env.STEEM_API_URL || 'https://api.steemit.com';
const MAX_RETRY = parseInt(process.env.MAX_RETRY || '5');
const TIME_SLEEP = parseInt(process.env.TIME_SLEEP || '3000');

const trace = debug('app:trace:rpc20');
const log = debug('app:log:rpc20');
const err = debug('app:err:rpc20');

// 기본 timeout 설정 1000 = 1 sec
axios.defaults.timeout = parseInt(process.env.TIMEOUT_MIL || '10000');

/**
 * rpc20 호출을 위한 json 생성
 * @param {string} method // default: "" , ex) condenser_api.get_block
 * @param {array} params // default []
 * @param {number} id // default: 1
 * @returns
 */
export function rpc20(method = '', params = [], id = 1) {
  return { jsonrpc: '2.0', method, params, id };
}

/**
 * rpc20 호출을 위한 함수
 * @param {string} method 메소드
 * @param {array} params 파라미터
 * @param {number} retry 오류 발생 시 재시도 횟수
 * @returns 응답 결과 json
 */
export async function call(method, params, retry = 0) {
  try {
    const data = rpc20(method, params);
    let res = await axios.post(STEEM_API_URL, data);
    trace(STEEM_API_URL, data);
    return res;
  } catch (e) {
    if (retry >= MAX_RETRY) {
      // 더 이상 처리 불가할 때에는 오류를 발생 시키도록 한다
      err(`exited - [${method}]`);
      process.exit(-1);
    } else {
      // TIME_SLEEP 만큼 대기한다
      log(`retry [${retry}] - [${method}]`);
      await new Promise((resolve) => setTimeout(resolve, TIME_SLEEP));
      return call(method, params, retry + 1);
    }
  }
}

/**
 * 현재 블록 번호를 가져온다
 * @returns {number} 현재 블록 번호
 */
export async function getHeadBlockNumber() {
  let res = await call('condenser_api.get_dynamic_global_properties');
  return res.data.result.head_block_number;
}

/**
 * 대상 블록 정보를 가져온다
 * @param {number} blockNumber
 * @returns 블록 정보
 */
export async function getBlock(blockNumber) {
  let res = await call('condenser_api.get_block', [blockNumber]);
  return res.data.result;
}
