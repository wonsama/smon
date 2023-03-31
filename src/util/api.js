import { condenser_api as c } from './methods.js';
import { call } from './rpc20.js';

/**
 * 현재 블록 번호를 가져온다
 * @returns {number} 현재 블록 번호
 */
export async function getHeadBlockNumber() {
  let res = await call(c.get_dynamic_global_properties);
  return res.data.result.head_block_number;
}
