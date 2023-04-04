// src/util/stemapi.js
//
// 스팀 관련 API 모듈
// 모니터링을 위한 최소한의 기능만을 추가 해 놓았다.
// 확장의 가능성이 농후함.
// [유의] comment 시 id 만 반환되고 block_num, trx_num, op_in_trx 등의 정보는 반환되지 않는다.

import debug from 'debug';
import dotenv from 'dotenv';
import dsteem from '@upvu/dsteem';

dotenv.config();

const log = debug('app:log:steemapi');
const err = debug('app:err:steemapi');

const client = new dsteem.Client(process.env.STEEM_API_URL);

/**
 * 사용자의 키를 가져온다
 * 계정명_KEY_타입 형태로 환경변수를 설정해야 한다
 * @param {string} author 사용자
 * @param {'posting'|'active'} type 타입
 * @returns {dsteem.PrivateKey} 키
 */
function getKey(author, type) {
  return dsteem.PrivateKey.from(
    process.env[`${author.toUpperCase()}_KEY_${type.toUpperCase()}`],
  );
}

/**
 * 글 정보를 가져온다
 * @param {string} author 글쓴이
 * @param {string} permlink 영구링크
 * @returns 글 정보
 */
export async function getContent(author, permlink) {
  return client.call('condenser_api', 'get_content', [author, permlink]);
}

/**
 * markdown 코드 블럭 제거
 * @param {string} source 입력 문자열
 * @returns 코드 블럭이 제거된 문자열
 */
export function removeCodeBlock(source) {
  let result = source;
  let start = 0;
  let end = 0;
  while (true) {
    start = result.indexOf('```', start);
    if (start == -1) {
      break;
    }
    end = result.indexOf('```', start + 3);
    if (end == -1) {
      break;
    }
    result = result.substring(0, start) + result.substring(end + 3);
  }
  return result;
}

/**
 * 댓글을 남긴다
 * @param {string} parent_author - 부모 글의 작성자
 * @param {string} parent_permlink - 부모 글의 permlink
 * @param {string} author - 댓글을 남길 사용자
 * @param {string} body - 댓글 내용
 * @returns 생성된 transaction_id
 */
export async function reply(parent_author, parent_permlink, author, body) {
  const postingKey = getKey(author, 'posting');

  let res = await getContent(parent_author, parent_permlink);

  const reply = {
    parent_author,
    parent_permlink,
    author,
    permlink: `${parent_permlink}-reply-${new Date().getTime()}`,
    title: '',
    body,
    json_metadata: res.json_metadata,
  };

  return client.broadcast.comment(reply, postingKey);
}
