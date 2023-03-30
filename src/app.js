import { getHeadBlockNumber } from "./util/api.js";

async function init() {
  // TODO : 파일에 기록된 시작 블록 위치를 읽어 들인다.
  // TODO :   L 파일이 존재하지 않으면 최근 블록부터 시작한다
  // TODO : Loop
  // TODO :   L 최근 블록 정보를 읽어들인다
  // TODO :   L 블록 정보를 읽어 들인다
  // TODO :   __ L 최대 100(설정) 개 까지 읽어들이도록 한다
  // TODO :   __ L 최근 블록 정보를 초과할 수 없다.
  // TODO :   >>> 블록 분석 <<<
  // TODO :   __ L 읽어들인 블록 정보를 n개의 프로그램에서 분석 할 수 있도록 한다
  // TODO :   __ L 기존 impl 폴더를 활용하여 작업을 수행하도록 한다
  // TODO :   __ L 최근 블록부터해서 DB에 기록하는 것을 고려한다 ( postgreSql - 구글에서 지원하기 때문 )
  // TODO :   __ L AI 드로잉 : 한글->영문(구글 번역API) / SD -> AI 드로잉 / 파일 업로드 / markdown 작성 / steemit 배포
  // TODO :   L 파일에 최근 읽어들인 블록 정보를 기록한다
  // TODO :   __ L 최근 작업시간, 최근 블록 번호
  // TODO :   __ L (별도 쉘 프로그램) 최근 작업시간이 5분이상 차이나면 메일을 통해 오류 상황을 알려주도록 해야 된다.

  let headBlockNumber = await getHeadBlockNumber();
  console.log(headBlockNumber);
}
init();
