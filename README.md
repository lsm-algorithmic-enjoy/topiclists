#토픽 리스트 보여주기

프로젝트 진행 순서 정리

1. CRA (TypeScript) 프로젝트 생성
2. REST API 서버 구축을 위한 json-server 설치 및 topic.json 파일을 루트 디렉토리에 생성
   > npm install -g json-server
   > json-server --version
3. topic.json 기반 로컬 서버 실행 (4000번 포트 지정), http://localhost:4000/topics 경로에 로컬 서버 생성
   > json-server -p 4000 topic.json
4. API 요청을 위한 axios 설치
   > npm install axios
5. 정규표현식을 이용한 Topic title 검색기능 구현
