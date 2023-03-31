import debug from 'debug';
import fs from 'fs';
const DEFAULT_ENCODING = 'utf8';

const log = debug('app:log:file');
const err = debug('app:err:file');

/**
 * 파일에서 JSON을 읽어온다.
 * @param {string} path 파일 읽기 경로
 * @param {JSON} defaults  기본 json 값 // default: {}
 * @returns {JSON} 파일에서 읽어 온 parse된 json
 */
export function readJson(path, defaults = {}) {
  if (fs.existsSync(path)) {
    try {
      return JSON.parse(fs.readFileSync(path, DEFAULT_ENCODING));
    } catch (e) {
      err(`occured error : ${path}`, e);
      return defaults;
    }
  } else {
    err(`${path} not found`, e);
    return defaults;
  }
}

/**
 * 파일에 JSON을 기록한다.
 * @param {string} path 파일 저장 경로
 * @param {JSON} json 기록할 json
 */
export function writeJson(path, json) {
  try {
    fs.writeFileSync(path, JSON.stringify(json, null, 2), DEFAULT_ENCODING);
    log(`file created : ${path}`);
  } catch (e) {
    err(`occured error : ${path}`, e);
  }
}
