# README

> 스팀 블록체인 모니터링 템플릿 프로그램

## 시작하기

### 프로젝트 복제하기

```sh
npx degit https://github.com/wonsama/smon smon
cd smon
npm install
```

이후 `exsamples` 폴더의 예시를 참조하여 프로젝트를 구성한다.

## TODO

DockerFile 를 사용하여 빌드
docker-compose 를 사용하여 실행 ( app.js 를 사용자가 구현하여 entry point 로 사용 하도록 유도 )

## 참조링크

- [github-steemv2](https://github.com/wonsama/steemv2/blob/main/util/monitors/core/core_steem.js)
- [steem-apidefinitions](https://developers.steem.io/apidefinitions)

## 라이브러리

로깅 : debug, winston, loglevel 중 debug 선택

- [debug](https://www.npmjs.com/package/debug)
