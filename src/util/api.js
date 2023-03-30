import * as dotenv from "dotenv";

import axios from "axios";
import { condenser_api as c } from "./methods.js";
import { rpc20 } from "./rpc20.js";

dotenv.config();

const API_URL = process.env.API_URL;
const MAX_RETRY = process.env.MAX_RETRY || 5;

/**
 * rpc20 호출을 위한 함수
 * @param {string} method 메소드
 * @param {array} params 파라미터
 * @param {number} retry 오류 발생 시 재시도 횟수
 * @returns 응답 결과 json
 */
function _post(method, params, retry = 0) {
  try {
    const data = rpc20(method, params);
    return axios.post(API_URL, data);
  } catch (e) {
    if (retry >= MAX_RETRY) {
      // 더 이상 처리 불가할 때에는 오류를 발생 시키도록 한다
      throw e;
    } else {
      return _post(method, params, retry + 1);
    }
  }
}

/**
 * 현재 블록 번호를 가져온다
 * @returns {number} 현재 블록 번호
 */
export async function getHeadBlockNumber() {
  let res = await _post(c.get_dynamic_global_properties);
  return res.data.result.head_block_number;
}
