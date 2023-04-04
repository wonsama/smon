// src/util/transalte.js
//
// 구글 Translate API를 사용하기 위한 모듈
// 공짜 모듈은 번역 시 단문은 상관 없으나 5000자 초과 하는 장문 등에서는 사용할 수 없음에 유의해야 한다.
// 또한 연속적으로 호출 시 해당 IP 대역이 BLOCK 되니 이에 유의해야 됨

import gtranslate from 'google-translate-api-x';
import { v3beta1 } from '@google-cloud/translate/build/src/index.js';

// 구글 번역을 사용하기 위해서는 프로젝트를 생성하고, 프로젝트 ID를 얻어야 한다.
// 유료 결제 설정 필요
// https://cloud.google.com/translate/docs/basic/setup-basic?hl=ko
// GOOGLE_APPLICATION_CREDENTIALS 환경 변수 설정을 통해 해당 key 정보를 지정해야 된다

/**
 * 구글 번역을 수행한다
 * @param {Array} contents 내용목록 ex) ['만나서 반갑습니다.']
 * @param {string} targetLanguageCode 언어코드 ex) 'en';
 * @param {string} parent  프로젝트 정보 ex) 'projects/project-id-or-number';
 * @returns
 */
export default function (contents, targetLanguageCode, parent) {
  const translationClient = new v3beta1.TranslationServiceClient();

  // request
  const request = {
    contents,
    targetLanguageCode,
    parent,
  };

  // response
  /*
      [
        { translations: [ [Object] ], glossaryTranslations: [] },
        null,
        null
      ]

      [Object]
      {
        translatedText: 'nice to meet you',
        model: '',
        glossaryConfig: null,
        detectedLanguageCode: 'ko'
      }
  */

  // async
  return translationClient.translateText(request);
}

/**
 * 입력받은 메시지를 번역한다
 * @param {string} message 입력 메시지
 * @param {string} targetLanguageCode 언어코드 ex) 'en';
 * @param {string} parent  프로젝트 정보 ex) 'projects/project-id-or-number';
 * @returns 번역 결과
 */
export async function translate(message, targetLanguageCode, parent) {
  const translationClient = new v3beta1.TranslationServiceClient();
  let contents = [message];
  const request = {
    contents,
    targetLanguageCode, // https://cloud.google.com/translate/docs/languages?hl=ko
    parent,
  };

  let res = await translationClient.translateText(request);
  return res[0].translations[0].translatedText;
}

/**
 * 입력받은 메시지를 번역한다(무료)
 * 짧은 글 정도만 동작함. 오류 존재
 * @param {string} message
 * @param {string} targetLanguageCode
 * @returns 번역 결과
 */
export async function freeTranslate(message, targetLanguageCode) {
  const res = await gtranslate(message, { to: targetLanguageCode });

  return res.text;
}
