import debug from "debug";
import fs from "fs";
const DEFAULT_ENCODING = "utf8";

const trace = debug("app:trace:file");
const log = debug("app:log:file");
const info = debug("app:info:file");
const err = debug("app:err:file");

/**
 * 해당 경로에 파일이 존재하는지 확인한다.
 * @param {string} path 파일 경로
 * @returns {boolean} 파일 존재 여부
 */
export function exist(path) {
  return fs.existsSync(path);
}

/**
 * 파일에서 JSON을 읽어온다.
 * @param {string} path 파일 읽기 경로
 * @param {JSON} defaults  기본 json 값 // default: {}
 * @returns {JSON} 파일에서 읽어 온 parse된 json
 */
export function readJson(path, defaults = undefined) {
  if (fs.existsSync(path)) {
    try {
      return JSON.parse(fs.readFileSync(path, DEFAULT_ENCODING));
    } catch (e) {
      err(`occured error : ${path}`, e);
      return defaults;
    }
  } else {
    err(`${path} not exist`);
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
    if (fs.existsSync(path)) {
      trace(`file updated : ${path}`);
    } else {
      info(`file created : ${path}`);
    }
    fs.writeFileSync(path, JSON.stringify(json, null, 2), DEFAULT_ENCODING);
  } catch (e) {
    err(`occured error : ${path}`, e);
  }
}
