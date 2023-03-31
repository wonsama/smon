import axios from 'axios';
import debug from 'debug';

const API_URL = process.env.API_URL || 'https://api.steemit.com';
const MAX_RETRY = parseInt(process.env.MAX_RETRY || '5');

const log = debug('app:log:rpc20');
const err = debug('app:err:rpc20');

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
export function call(method, params, retry = 0) {
  try {
    const data = rpc20(method, params);
    let res = axios.post(API_URL, data);
    log(API_URL, data);
    return res;
  } catch (e) {
    if (retry >= MAX_RETRY) {
      // 더 이상 처리 불가할 때에는 오류를 발생 시키도록 한다
      err(e);
      throw e;
    } else {
      return call(method, params, retry + 1);
    }
  }
}
