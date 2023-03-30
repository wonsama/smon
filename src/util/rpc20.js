/**
 *
 * @param {string} method // default: "" , ex) condenser_api.get_block
 * @param {array} params // default []
 * @param {number} id // default: 1
 * @returns
 */
export function rpc20(method = "", params = [], id = 1) {
  return { jsonrpc: "2.0", method, params, id };
}
