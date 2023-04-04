// src/util/transalte.js
//
// 예시) 구글 API를 사용하여 번역을 수행한다.
// 프로젝트 등록이 되어야 되며, 인증정보인 key 파일이(json) 필요하다.
// 키 파일은 환경 변수에 ( GOOGLE_APPLICATION_CREDENTIALS ) 파일 위치 정보가 기록되어야 한다

import debug from "debug";
import dotenv from "dotenv";
import { translate } from "../src/util/translate.js";

const log = debug("app:log:translate");
const err = debug("app:err:translate");

dotenv.config();

let message = "만나서 반갑습니다.";
let targetLanguageCode = "ko";
const TRANSLATE_PARENT = process.env.TRANSLATE_PARENT;

async function init() {
  log("start");
  let res = await translate(message, targetLanguageCode, TRANSLATE_PARENT);
  log(res);
}
init();
