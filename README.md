#토픽 리스트 보여주기

프로젝트 진행 순서 정리

1. CRA (TypeScript) 프로젝트 생성
2. REST API 서버 구축을 위한 json-server 설치 및 topic.json 파일을 루트 디렉토리에 생성
   > npm install -g json-server
   > json-server --version
3. topic.json 기반 로컬 서버 실행 (4000번 포트 지정), http://localhost:4000/topics 경로에 로컬 서버 생성, idx를 통한 데이터 업데이트를 위해 routes.json 파일에서 엔드포인트 설정
   > json-server --watch topic.json --routes routes.json --id idx --port 4000
4. API 요청을 위한 axios 설치
   > npm install axios
5. axios를 이용하여 HTTP 메소드 중 하나인 get으로 토픽 리스트를 가져와 보여주도록 구현
6. 정규표현식을 이용한 Topic title 검색 기능 구현
7. filter 메서드를 사용하여 주어진 토픽 리스트를 grade 카테고리 별로 필터링하는 기능 구현
8. 좋아요 상태 업데이트 기능 구현(HTTP 메소드 중 하나인 patch를 통해 isLiked 데이터 업데이트, 새로고침 후에도 좋아요 상태 유지)
