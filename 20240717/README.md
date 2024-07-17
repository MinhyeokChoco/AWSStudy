# AWS
## 포트 포워딩
## 프록시 설정 nginx
## CI/CD githubActions

## aws EC2 프로젝트 업로드
<!-- mkdir myapp-->
<!-- cd myapp -->
> git init 초기화 하고
> git remote add origin [주소]
> git pull origin master
> 유저 권한 인증
> 유저 이름 : 깃허브 이름
> 유저 비밀번호 : 깃허브 프로필 -> settings(설정) -> Developer settings(개발자 설정) -> 토큰을 발급 받아야 함 ->
                ->  클래식 토큰 생성 (Tokens(classic)) -> generic new token -> New personal access token (classic)

## nodejs를 가상 서버에 설치
> sudo apt-get update
> sudo apt-get install -y build-essential (기본 프로그램 설치)
> sudo apt-get install curl
`노드의 설치 파일을 요청 보내서 설치`
> curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash --
`노드를 설치`
> sudo apt-get install -y nodejs
> node -v
> npm -v


### 포트 포워딩 (Port-Forwarding)
> 네트워크에서 외부의 포트로 요청을 보내면 재 매핑해서 다른 포트로 요청을 받을 수 있도록
> 공유기나 가상 서버에 적용을 할 수 있다.
> ex = 80번 포트로 요청을 보냈지만 3000 포트로 재 매핑해서 응답을 주는 것.

```sh
sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 3000;
# --dport 80 : 80번 포트가 요청을 받고
# -j REDIRECT -- to-port 3000; 3000번 포트로 패킷을 리다이렉트
# 포트포워딩 잘 되었는지 확인
sudo iptables -t nat -L --line-numbers

sudo apt-get install iptables-persistent
sudo netfilter-persistent save
sudo systemctl restart netfilter-persistent
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000; # 포트 번호 설정
sudo iptables -t nat -L --line-numbers; # 포트 번호 설정 리스트 보기
sudo iptables -t nat -D PREROUTING '지우고 싶은 번호(num)'; # 포트 번호 설정 지우기

# PM2 설치
sudo npm i -g pm2
# nodejs 어플리케이션을 운영할 때 사용하는 프로세스 매니저
# 백그라운드에서 실행을 하고 모니터링을 할 수 있다.

# "scripts": {
#    "test": "echo \"Error: no test specified\" && exit 1",
#    "start": "pm2 start app.js"
#  }, => 출처 미상 ..

# PM2 시작
npm start

# 리스트 확인
pm2 list

# 종료는
pm2 kill
```

### 프록시 설정 nginx
> 포트 포워딩은 네트워크 장비 방화벽 특정 포트에서 들어오는 트래픽을 다른 포트나 호스트로 리다이렉트 해주는 것.
> 프록시 : 클라이언트와 서버 사이에 트래픽 중계 서버가 하나 있는 것.

### nginx를 사용해서 프록시 설정
> 통신을 할 때 중간에서 대신 통신을 해주는 역할을 한다.
> 중계 역할을 해주는 것이 프록시 서버
> 클라이언트와 서버 사이의 중계 서버
> 클라이언트는 프록시 서버를 백엔드 서버로 알고, 백엔드 서버는 프록시 서버가 클라이언트 인 줄 안다.

### 프록시 서버
1. 포워드 프록시 서버 : 클라이언트와 인터넷 접속 제어
2. 리버스 프록시 서버 : api 제어

> 리버스 프록시 서버의 응답을 받아서 처리를 해준다(서버를 감출 수 있다.)

```sh
sudo apt-get install nginx;

sudo service nginx start;
sudo service nginx status;
sudo service nginx stop;

# 설정 파일을 수정해야 함
/etc/nginx/sites-enabled
# 기본 설정 파일이 들어 있음
default 파일은 가상 호스트 설정 파일
sudo vi default;
# 수정
쉘에서 주석 처리는 #을 이용한다.

# 이 부분 수정 해야 함
# 루트 요청이 들어오면
    location / {
            # First attempt to serve request as file, then
            # as directory, then fall back to displaying a 404.
            # try_files $uri $uri/ =404;

            proxy_set_header HOST $host;
            proxy_pass http://127.0.0.1:3000;
            proxy_redirect off;
    }
# $host 브라우저에서 요청받은 헤더의 내용
# proxy_set_header 클라이언트가 브라우저에서 요청을 보낸 헤더의 내용을 넘겨주겠다.
# proxy_pass 요청받은 내용을 로컬환경에 대기상태인 백엔드 서버로 요청을 보내고 응답을 받겠다.
# proxy_redirect : off; => 이 친구는 SPA redirect를 없애겠다.

# 수정하고 문법 에러가 있는지 확인
sudo nginx -t

# nginx 설정 파일을 수정하면 당연히 재실행
sudo service nginx restart;
```

## 도메인
> 특정 IP 주소에 접근할 수 있는 검색어 (문자형 주소)

## AWS Route 53
> EC2 안 쓰고 AWS Route 53 사용
> 도메인 등록, DNS 라우팅 기능을 제공한다.
> Domain Name System, 도메인 관리 시스템을 제공한다.

## 레코드
> DNS 레코드 : 도메인의 이름과 관련된 정보를 나타내는 데이터
> NS (Name Server, 네임 서버) : 인터넷에서 도메인을 IP 주소로 변환하는 역할을 담당하는 서버


### 탄력적 IP는 고정 IP를 할당해준다.
> 비용이 많이 듬
> 1개는 무료로 해주는걸로 알고 있음.
> 인스턴스에 적용을 해놔야 하고
> 인스턴스 지우면 탄력적 아이피 사용 안하는게 남는데 비용 발생

### SSL 인증서 발급 해서 HTTPS 붙이기
> 검증된 사이트 라는 것
> https 요청을 할 때 인증서를 발급 받아서 인증 요청을 보내고
> 지금은 돈이 들지 않는 certbot을 사용해서 인증서를 발급 받고 인증까지.
> 인증서 3개월마다 재발급 해야 하며, 재발급 하면 이메일로 알려준다.

> certbot nginx와 호환이 좋다.

> core : 핵심 런타임 환경을 제공해주는 패키지

```sh
# snap 패키지 설치를 위한 패키지 포맷
# core 런타임 환경 제공
sudo snap install core;
sudo snap refresh core;

sudo snap install --classic certbot;

# certbot 실행파일에 링크 설정
sudo ln -s /snap/bin/certbot /usr/bin/certbot;

# certbot 설치 확인 및 버전 확인
certbot --help 혹은
certbot --version;

# nginx certbot 실행
sudo certbot --nginx;

# certbot 3개월 마다 갱신
sudo certbot renew;

# 인증서 발급 테스트
sudo certbot renew --dry-run;
```