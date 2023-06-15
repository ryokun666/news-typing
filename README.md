# インストール方法
プロジェクトのインストール方法を記載してください。これには依存関係のインストール、環境変数の設定、データベースの設定などが含まれる可能性があります。
```
git clone https://github.com/ryokun666/news-typing-frontend.git
cd news-typing-frontend
npm install
```

# 使用方法
```
npm run start
```

## APIキーの取得
- [News API](https://newsapi.org/)
- [gooラボAPI](https://labs.goo.ne.jp/apiusage/)

# 概要
News APIとgooのかな変換APIを用いてユーザがプレイする度に最新ニュースを取得し、その記事内容をタイピングゲームとして遊ぶことができる。

# 機能
- 簡易ユーザ登録
- リアルタイムニュースタイピング
- 難易度選択
- ニュースカテゴリ選択
- 時間設定

# 実装予定機能
- トップページで簡単なユーザ登録を行い、好成績を残せたらランキングに残せるようにする。
→バックエンド側でDB接続の実装からをおこなう。
- 適切なエラーハンドリングを行う

# 課題
- ニュース記事に数字が入っていた場合かな変換APIによる変換対象から除去するように設定したが、そうすることによって日付など（例：12月（変換前））などのかな変換が不自然になる(例：12つき（変換後）) 。

# 技術
## 言語
JavaScript
└将来的にTypeScriptに移管したい

## フレームワーク
フロントエンド：Next.js
[バックエンド](https://github.com/ryokun666/news-typing-backend)：Node.js

## デプロイ
Vercel

# デザイン案
## ロゴ（仮）
![速打！](https://github.com/ryokun666/news-typing-frontend/assets/113868184/ca825307-12ea-4fca-bf72-8b15808b3b84)

![messageImage_1686579409374](https://github.com/ryokun666/news-typing-frontend/assets/113868184/722b1b6d-e6cf-4e26-b0e9-2a3e30fabee8)

## デモ動画（2023/6/13時点）
https://github.com/ryokun666/news-typing-frontend/assets/113868184/4c94de0f-6ead-4ce7-8ba8-6c7d48345dad

