import debug from 'debug';
import dotenv from 'dotenv';
import dsteem from '@upvu/dsteem';

dotenv.config();

const log = debug('app:log:rpc20');
const err = debug('app:err:rpc20');

const client = new dsteem.Client(process.env.STEEM_API_URL);

log('process.env.STEEM_API_URL', process.env.STEEM_API_URL);

function getKey(author, type) {
  log('author', author);
  log('key', process.env[`${author.toUpperCase()}_KEY_${type.toUpperCase()}`]);

  const privatekey =
    process.env[`${author.toUpperCase()}_KEY_${type.toUpperCase()}`];

  return dsteem.PrivateKey.fromLogin(
    author.toLowerCase(),
    privatekey,
    type.toLowerCase(),
  );
}

export function getContent(author, permlink) {
  return client.call('condenser_api', 'get_content', [author, permlink]);
}

export async function reply(parent_author, parent_permlink, author, body) {
  const postingKey = getKey(author, 'posting');

  let res = await getContent(parent_author, parent_permlink);

  log('res.title', res.title);

  const reply = {
    parent_author,
    parent_permlink,
    author,
    permlink: `${parent_permlink}-reply`,
    title: '',
    body,
    json_metadata: res.json_metadata,
  };

  // parent_author: string;
  //       parent_permlink: string;
  //       author: string;
  //       permlink: string;
  //       title: string;
  //       body: string;
  //       json_metadata: string;

  log('postingKey', postingKey);
  log('reply', reply);

  return client.broadcast.comment(reply, postingKey);
}
