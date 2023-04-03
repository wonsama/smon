import { exist, readJson, writeJson } from './file.js';
import { getBlock, getHeadBlockNumber } from './api.js';

import debug from 'debug';
import dotenv from 'dotenv';
import moment from 'moment-timezone';

dotenv.config();

const trace = debug('app:trace:monitor');
const log = debug('app:log:monitor');
const info = debug('app:info:monitor');
const err = debug('app:err:monitor');

const READ_BLOCK_SIZE = parseInt(process.env.READ_BLOCK_SIZE || '100');

const TIME_ZONE = process.env.TIME_ZONE || 'Asia/Seoul';
const TIME_FORMAT = process.env.TIME_FORMAT || 'YYYY-MM-DD HH:mm:ss';
const TIME_SLEEP = parseInt(process.env.TIME_SLEEP || '3000');
const TIME_CHECK = parseInt(process.env.TIME_CHECK || '100');
const FILE_PATH_BLOCK = process.env.FILE_PATH_BLOCK || './data/block.json';
const FILE_PATH_BLOCKS = process.env.FILE_PATH_BLOCKS || './data/blocks';
const FILE_WRITE_BLOCK_YN = process.env.FILE_WRITE_BLOCK_YN || 'N';

/**
 * 모니터링을 수행한다
 */
export default class Monitor {
  // private 변수
  #commands = [];
  #isRunning = false;
  #initialized = false;
  #filePath = null;

  /**
   * 생성자
   * @param {string} filePath 현재 블록 정보를 저장할 파일 경로
   */
  constructor(filePath = FILE_PATH_BLOCK) {
    this.#filePath = filePath;

    // 생성자에서 처리 할 일, 현재는 그냥 private 함수 테스트 때문에 만들어 놓음
    this.#init();
  }

  /**
   * 모니터링을 추가한다
   * @param {string} command 명령어
   * @param {Function} callback 콜백함수
   */
  add(command, callback) {
    const index = this.#commands.findIndex((item) => item[0] === command);
    if (index == -1) {
      log(`command "${command}" added`);
      this.#commands.push([command, callback]);
    } else {
      log(`command "${command}" already exist`);
    }
  }

  /**
   * 모니터링을 제거한다
   * @param {string} command 명령어
   */
  remove(command) {
    const index = this.#commands.findIndex((item) => item[0] === command);
    if (index != -1) {
      this.#commands.splice(index, 1);
      log(`command "${command}" removed`);
    } else {
      err(`command "${command}" not exist`);
    }
  }

  /**
   * 모니터링 목록을 반환한다
   * @returns {Array} 모니터링 목록
   */
  list() {
    return this.#commands;
  }

  /**
   * 모니터링을 시작한다
   */
  async start() {
    while (!this.#initialized) {
      await new Promise((resolve) => setTimeout(resolve, TIME_CHECK));
    }
    if (!this.#isRunning) {
      // 시작
      log('started');
      this.#isRunning = true;

      // 반복 작업을 수행한다
      while (this.#isRunning) {
        // 최신 블록 정보를 읽어들인다
        // 이후 읽어들일 시작~종료 블록 정보를 설정한다
        let headBlockNumber = await getHeadBlockNumber();
        let block = readJson(this.#filePath);
        let startBlock = block.currentBlockNumber + 1;
        if (startBlock > headBlockNumber) {
          log(`skipped : already read blocks : ${headBlockNumber}`);
          // TIME_SLEEP 만큼 대기한다
          await new Promise((resolve) => setTimeout(resolve, TIME_SLEEP));
          continue;
        }
        let endBlock =
          headBlockNumber - startBlock < READ_BLOCK_SIZE - 1
            ? headBlockNumber
            : startBlock + READ_BLOCK_SIZE - 1;
        log(
          `headBlockNumber : ${headBlockNumber}, startBlock : ${startBlock}, endBlock : ${endBlock}, count : ${
            endBlock - startBlock + 1
          }`,
        );

        // 블록 정보를 읽어들인다
        let blockList = [];
        for (let i = startBlock; i <= endBlock; i++) {
          blockList.push(getBlock(i));
        }
        await Promise.all(blockList).then((res) => {
          // 블록 정보를 파일에 저장한다 - Y로 설정한 경우에만
          if (FILE_WRITE_BLOCK_YN.toUpperCase() === 'Y') {
            for (let i = 0; i < res.length; i++) {
              writeJson(`${FILE_PATH_BLOCKS}/${res[i].block_id}.json`, res[i]);
            }
          }
          // 블록 정보 내 오퍼레이션 목록 정보를 반환한다
          let opList = this.#getOperations(res);
          // 오퍼레이션 정보 확인 후 콜백 전달
          this.#commands.forEach(([operation, callback]) => {
            opList.forEach((op) => {
              if (op.operation === operation) {
                callback(op);
              }
            });
          });
        });

        // 파일에 최근 읽어들인 블록 정보를 업데이트 한다
        writeJson(this.#filePath, {
          currentBlockNumber: endBlock,
          headBlockNumber,
          timestamp: new Date().getTime(),
          timekr: moment().tz(TIME_ZONE).format(TIME_FORMAT),
        });

        // TIME_SLEEP 만큼 대기한다
        await new Promise((resolve) => setTimeout(resolve, TIME_SLEEP));
      }
    }
  }

  /**
   * 블록 정보 내 오퍼레이션 목록 정보를 반환한다
   * @param {Array} res
   * @returns 오퍼레이션 목록 정보
   */
  #getOperations(res) {
    let opList = [];
    for (let i = 0; i < res.length; i++) {
      let block = res[i];
      if (!block.block_id) {
        continue;
      }
      let block_id = block.block_id;
      let timestamp = block.timestamp;

      for (let j = 0; j < block.transactions.length; j++) {
        let transaction = block.transactions[j];

        let transaction_id = transaction.transaction_id;
        let transaction_num = transaction.transaction_num;

        for (let k = 0; k < transaction.operations.length; k++) {
          let [operation, data] = transaction.operations[k];

          opList.push({
            block_id,
            timestamp,
            transaction_id,
            transaction_num,
            operation,
            data,
          });
        }
      }
    }

    // 오퍼레이션 목록 정보 카운트
    let counts = {};
    for (let o of opList) {
      if (counts[o.operation]) {
        counts[o.operation]++;
      } else {
        counts[o.operation] = 1;
      }
    }
    log(`operations : ${JSON.stringify(counts)}`);

    return opList;
  }

  /**
   * 모니터링을 중지한다
   */
  async stop() {
    log('stopped');
    this.#isRunning = false;
    while (!this.#isRunning) {
      await new Promise((resolve) => setTimeout(resolve, TIME_SLEEP));
    }
  }

  /**
   * 모니터링을 종료한다
   */
  exit() {
    info('exited');
    process.exit(0);
  }

  /**
   * 모니터링을 초기화한다
   */
  async #init() {
    // 파일이 존재하는지 확인하고, 없는 경우 기본 파일을 생성한다
    await this.#createBlockInfo();

    // 초기화 완료
    this.#initialized = true;
    log(`monitor initialized`);
  }

  /**
   * 파일이 존재하는지 확인하고, 없는 경우 기본 파일을 생성한다
   */
  async #createBlockInfo() {
    // 최신 블록 정보를 읽어들인다
    let headBlockNumber = await getHeadBlockNumber();
    log(`headBlockNumber : ${headBlockNumber}`);

    // 파일 존재 여부를 파악 후, 없는 경우 기본 파일을 생성한다
    if (!exist(this.#filePath)) {
      writeJson(this.#filePath, {
        currentBlockNumber: headBlockNumber - READ_BLOCK_SIZE,
        headBlockNumber,
        timestamp: new Date().getTime(),
        timekr: moment().tz(TIME_ZONE).format(TIME_FORMAT),
      });
    }
  }
}
