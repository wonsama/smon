// src/util/cleanup.js
//
// 프로세스 종료 시 정리 함수를 호출한다.
// Object to capture process exits and call app specific cleanup function

function noOp() {}

/**
 * exit 시그널을 수신하면 cleanup 함수를 호출한다
 * @param {Function} callback 정리 함수
 */
export default function (callback) {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  callback = callback || noOp;
  process.on('cleanup', callback);

  // do app specific cleaning before exiting
  process.on('exit', function () {
    process.emit('cleanup');
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    console.log('Ctrl-C...');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function (e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
  });
}
