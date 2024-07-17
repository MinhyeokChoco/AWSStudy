# CI/CD
> Continuous Integration, Continuous Deployment
> 우리가 코드를 깃에 푸쉬, 풀 받아서 서버 대기 상태
> 쉽게 말해서 테스트(Test), 통합(Merge), 배포(Deploy)를 자동화

## CI/CD 과정
작업자 > 커밋, 푸쉬 > 빌드 테스트 > 배포

> 작업자가 커밋, 푸쉬 하면
> 푸쉬 이벤트 발생을 확인하고 테스트 후 빌드 만들어서 서버에 배포, 운영, 관리 진행

## 서비스를 운영
> 서비스를 운영, 배포 하다 보면 기능이 번번히 새로운 기능이 추가되는데 혹은 업데이트가 되는데
> 우리가 새로 작성하는 코드를 커밋 푸쉬, 풀 / 브런치에서 병합을 하고 AWS 가상 서버에 코드 내용을 받고 쉘로 다시 실행하고 하면 번거롭고 귀찮다.

> 그래서 번거로운 업무를 자동화 시키고 개발에만 집중 하자 라는 취지로

## 자동화
> 위의 과정이 너무 번거롭기 때문에 이런 반복되는 과정을 자동화 시킨 것.

## github-Actions
> 우리는 CI/CD 환경 구축을 빌드 서버도 제공해주고 무료인 github-actions
- 장점
    1. 빌드용 서버가 따로 필요 없음(빌드 서버 세팅으로 시간과 돈을 쓸 필요가 없다.) 우분투 환경을 제공해준다. 인스턴스에서 빌드를 할 때 메모리가 부족한 문제도 빌드를 해서 빌드 파일을 올리게 되면 메모리를 절약할 수 있다. 즉 돈을 절약할 수 있다.
    2. github와 통일된 환경에서 CI가 수행이 가능하다.
    3. Yaml 파일을 이용해서 간단하게 로직을 작성할 수 있다. runner 가상 머신
    4. Yaml 파일로 간단한 파이프 라인 구성
    > `파이프 라인` : 작업들을 순차적으로 수행하는 것.
    > 소프트웨어 개발에서 코드를 빌드하고 테스트하고 배포 하는 단계를 자동화한 흐름

CI/CD의 파이프 라인은 작업을 자동화하고 개발의 속도 증진 및 품질이 좋다.

1. 코드 커밋, 푸쉬
2. 푸쉬 이벤트를 보고 CI 서버 트리거 호출
3. 코드 빌드
4. 자동화 테스트 실행
5. 배포 준비
6. 배포
7. 모니터링

## github Action의 가상 머신 구조
> 코드 커밋, 푸쉬 -> 푸쉬 이벤트를 github actions가 감지하고 CI/CD 로직 실행 -> 배포(AWS)

> 이런 빌드 테스트 배포 작업을 github actions는 러너 라고 부르는 가상머신이 컨테이너에서 실행된다.
> github actions의 러너는 별도의 서버 없이 자동화 작업을 제공한다.
> 러너는 사용자가 원하는 운영체제를 제공한다. ex = 윈도우, 맥 OS, 리눅스, 우분투 등
> `자동 스케일링` 으로 리소스를 효율적으로 사용할 수 있다.
> NodeJS, Python, Java 등의 런타임 환경이 설치되어 있다, 빠르게 빌드 테스트가 가능하다.

`자동 스케일링`은 클라우드 컴퓨팅 환경에서 사용되는 기술, 컴퓨팅 자원의 양을 자동으로 조정할 수 있다는 것을 의미한다.

## 폴더 구조
> 깃의 원격 커밋과 푸쉬를 할 때
.github
- workflows
-- yml 파일을 하나 만들어야 한다.

## github Action 사용
```yml
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
```

## aws EC2에 쉘 스크립트를 실행
> EC2에 ssh 커넥션을 맺고 쉘 스크립트 실행

```yml
name : CI/CD 구축

on :
    push :
        branches :
            - main

jobs :
    deploy :
        runs-on : ubuntu-latest

    steps :
        - name : checkout
          uses : actions/checkout@v4 # uses 사용할 라이브러리

        - name : ssh key
          uses : webfactory/ssh-agent@v0.5.3
          with : # 작성할 속성을 정의한다.
            ssh-private-key: ${{ secrets.AWS_SECRET_KEY }} # 이것은 정해져 있는 키값임, ssh 연결 하기 위해 가져올 키 값

        - name : ssh EC2 접속
          uses : appleboy/ssh-action@v1.0.3
          with :
            host : ${{ secrets.HOST }}
            username : ${{ secrets.USERNAME }}
            key : ${{ secrets.AWS_SECRET_KEY }}
            port : ${{ secrets.PORT }}
            script : | # 실행할 스크립트 / | => 줄 내림 기호
                cd /home/ubuntu
                npm start
```

--------------------------------------------------------------------

```yml

# 기본 예시
name: GitHub Actions Demo
run-name: ${{ github.actor }} is testing out GitHub Actions 🚀
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
      - name: Check out repository code
        uses: actions/checkout@v4
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."

```

--------------------------------------------------------------------------------------


# 예시를 참고 후 직접 작성
```yml
name : CI/CD 구축

# 이벤트를 구독
on : 
  push : # push 이벤트가 발생하면 실행
    branches : # push가 발생한 브랜치가 뭐일 때 실행할 지 
      - main

jobs : # 작업의 단위
  myTest : # 식별자 이름(우리가 이름 정해도 됨)
    runs-on : ubuntu-latest # 사용할 운영체제, 'latest' = 최신버전이라는 뜻

    # 작업의 가장 작은 단위
    steps :
      - name : shell console test # 가장 작은 작업 단위의 이름
        run : echo 'my CI/CD' # 작업에서 실행할 쉘 스크립트 내용, console.log()와 동일 (출력 명령어)

      - name : mykey # 이름은 mykey
        run : echo ${{ secrets.HOST }}
```

---------------------------------------------------------------------

# 공부 내용
```yml
name : CI/CD 구축

on:
  push:
    branches:
      - main

jobs:
  deploy:
      runs-on: ubuntu-latest

      steps:
        - name: checkout
          uses: actions/checkout@v4 # uses 사용할 라이브러리

        - name: ssh ec2 접속
          uses: appleboy/ssh-action@v1.0.3
          with: 
            host: ${{ secrets.HOST }}
            username: ${{ secrets.USERNAME }}
            key: ${{ secrets.AWS_SECRET_KEY }}
            port: ${{ secrets.PORT }}
            script: | # 실행할 스크립트
                cd /home/ubuntu/myapp
                git pull origin main
                pm2 kill
                npm start
```

## 찐 최종 NestJs 빌드해서, 빌드 파일만 올리고 중단 하지 않고 배포
```yml
name : last nest deploy

on :
  push :
    branches :
      - main

jobs :
  build :
    runs-on : ubuntu-latest

    steps :
      - name : checkout
        uses : actions/checkout@v4

      - name : set up node
        uses : actions/setup-node@v4
        with :
          node-version : '20' # "node-version" 이게 있으면 "npm audit fix || true" 버전을 지정해줬기 때문에 의존성 유연하게 해주는 기능이 필요가 없음

      # - name : create .env
      #   run  : |
      #     "${{ secrets.MY_KEY }}" > .env

      - name : npm install # 의존성 설치 / "npm audit fix || true" : 보안 취약점을 자동으로 유연하게 수정해서 실패해도 일단 빌드 진행 하면서 의존성 유연하게 설치
        run  : |
          npm install

      - name : build NestJS
        run  : |
          npm run build

      - name : build output # 빌드가 잘 되었는지 모니터링 / "ls -la dist" : dist 폴더 안의 내용을 상세하게 출력, pwd 현재 작업 경로 출력
        run  : |
          ls -la dist
          pwd

      - name : Upload build artifacts # 빌드 준비 단계 업로드 하기 전 단계
        uses : actions/upload-artifact@v4
        with :
          name : build-artifacts
          path : dist/ # 경로

      - name : install ssh key
        run  : |
          mkdir -p ~/.ssh
          echo "${{ secrets.AWS_SECRET_KEY }}" > ~/.ssh/aws_key
          chmod 600 ~/.ssh/aws_key
          ssh-keyscan -H ${{ secrets.HOST }} >> ~/.ssh/known_hosts
          cat ~/.ssh/known_hosts

      - name : EC2 deploy
        uses : appleboy/ssh-action@v1.0.3
        with :
          host : ${{ secrets.HOST }}
          username : ${{ secrets.USERNAME }}
          key : ${{ secrets.AWS_SECRET_KEY }}
          port : ${{ secrets.PORT }}
          script : | # 실행할 스크립트 / | => 줄 내림 기호
            cd /home/ubuntu
            rm -rf dist
            mkdir dist

      - name : EC2에 아티팩트 내용 복사
        run  : |
          ls
          pwd
          scp -r -i ~/.ssh/aws_key ./dist/* ${{ secrets.USERNAME }}@${{ secrets.HOST }}:/home/ubuntu/dist/

      - name : deploy to EC2
        uses : appleboy/ssh-action@v1.0.3
        with :
          host : ${{ secrets.HOST }}
          username : ${{ secrets.USERNAME }}
          key : ${{ secrets.AWS_SECRET_KEY }}
          port : ${{ secrets.PORT }}
          script : |
            cd /home/ubuntu
            pm2 reload system.config.js --env production
```