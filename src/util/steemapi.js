import debug from "debug";
import dotenv from "dotenv";
import dsteem from "@upvu/dsteem";

dotenv.config();

const log = debug("app:log:rpc20");
const err = debug("app:err:rpc20");

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
    process.env[`${author.toUpperCase()}_KEY_${type.toUpperCase()}`]
  );
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
  const postingKey = getKey(author, "posting");

  let res = await client.call("condenser_api", "get_content", [
    parent_author,
    parent_permlink,
  ]);

  const reply = {
    parent_author,
    parent_permlink,
    author,
    permlink: `${parent_permlink}-reply-${new Date().getTime()}`,
    title: "",
    body,
    json_metadata: res.json_metadata,
  };

  return client.broadcast.comment(reply, postingKey);
}
