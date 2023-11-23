# Summary

技術検証に使いたい&自己発信の練習としてブログサイト作りました。

https://blog-nextjs-isr.vercel.app/

## Environment

```
Node.js 18.17.1
```

## Environment Variable

ルート直下に`.env`ファイルを作成し、下記の情報を入力してください。

```
MICROCMS_API_KEY=xxxxxxxxxx
MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx
MICROCMS_WEBHOOK_SIGNATURE=xxxxxx  ★ISR用APIルートでの検証に使用
BASE_URL=xxxxxxxxxx
```

`MICROCMS_API_KEY`  
microCMS 管理画面の「サービス設定 > API キー」から確認

`MICROCMS_SERVICE_DOMAIN`  
microCMS 管理画面の URL（https://xxxxxxxx.microcms.io）の xxxxxxxx の部分

`BASE_URL`
デプロイ先の URL です。プロトコルから記載

例）  
開発環境 → http://localhost:3000  
本番環境 → https://xxxxxxxx.vercel.app/ など

## Set up local environment

1. パッケージのインストール

```zsh
npm install
```

2. 開発環境の起動

```bash
npm run dev
```

3. 開発環境へのアクセス  
   [http://localhost:3000](http://localhost:3000)にアクセス
