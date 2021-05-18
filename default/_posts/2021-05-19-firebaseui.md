---
title: FirebaseUIで日本語にしてAuthDomainを設定したい
layout: blog_posts
tags: Google Firebase
relPath: /2021/05/firebaseui
last_modified_at: 2020-05-19
a_few_word: なんだかんだで初のプログラミング系記事やな...
---

とある用でFirebase Authenticationを使っていて、FirebaseUIをログイン画面に実装していました。

[FirebaseUI でウェブアプリに簡単にログイン機能を追加する](https://firebase.google.com/docs/auth/web/firebaseui?hl=ja)

上のリンクを見てもらえればわかるように、FirebaseUIでは以下の画像のように、ただコンテナを作れば、勝手にログイン画面を作ってくれます。
![FirebaseUI](/img/blog/2021/05/firebaseui/01.png)

最終的にここまでたどり着くまでに、いろいろ躓いたので、備忘録的な？

## Point1
まず、Googleのガイドにはいくつかの方法が載っていました。<br>
自分はESM（ES Modules）で、Webpackを使って1ファイルにまとめていたので、ガイド通り `npm install firebaseui --save` を実行して、プロジェクトに組み込みました。

この際用いたコードは、途中省きますが以下の通りです。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <script src="./bundle.js"></script>
    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.6.1/firebase-ui-auth.css" />
  </head>
  <body>
    <div id="firebaseui-auth-container"></div>
  </body>
</html>
```

```typescript
//----- ログイン処理 -----//
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import firebase from 'firebase/app'
import { firebaseConfig } from './firebaseConfig'

// Firebaseを初期化
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
auth.languageCode = 'ja'

if (location.pathname === '/login') {
  const ui = new firebaseui.auth.AuthUI(firebase.auth())
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return true
      },
    },
    signInSuccessUrl: '/',
    privacyPolicyUrl: '/policy',
  })
}
```

これを開いてみると、以下のような表示になりました。

![英語じゃない...](/img/blog/2021/05/firebaseui/02.png)

## Point2
「でも、やっぱりユーザーのことを考えたら日本語がいいな...」ということで、もう一つの方法「CDNを使う」を試すべく、先ほどの TypeScriptファイルを消して、HTMLファイルを変更。`<head>`タグが終わる前に、これを追記しました。

```html
<script src="/__/firebase/7.23.0/firebase-app.js"></script>
<script src="/__/firebase/7.23.0/firebase-analytics.js"></script>
<script src="/__/firebase/7.23.0/firebase-auth.js"></script>
<script src="/__/firebase/init.js"></script>
<script src="https://www.gstatic.com/firebasejs/ui/4.7.1/firebase-ui-auth__ja.js"></script>
<script>
  const ui = new firebaseui.auth.AuthUI(firebase.auth())
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return true
      },
    },
    signInSuccessUrl: '/',
    privacyPolicyUrl: '/policy',
  })
</script>
```

![日本語になった！](/img/blog/2021/05/firebaseui/01.png)

しかし、ここでも問題が。
例えば今 `hogehoge.com` にいても、ログインボタンを押したら `<project-id>.firebaseapp.com` に飛ばされてから、OAuth画面へ飛びます。<br>
つまり、例えばGoogleでのアカウント選択画面では、「（サイト名）に移動」と表示されますが、このドメインが独自ドメインじゃないという...。

これについては、Firebaseの設定の `authDomain` というKeyで設定できますが、そもそもCDNでは設定ファイルを埋め込めない...。

## 解決策
ドキュメントを見てみると、FirebaseUIのソースコードから自分でビルドすれば解決するのでは？と考え、試してみました。結果成功しました。

[GitHub: firebase/firebaseui-web](https://github.com/firebase/firebaseui-web)

参考： [firebaseui-web/README.md at master · firebase/firebaseui-web](https://github.com/firebase/firebaseui-web/blob/master/README.md#building-firebaseui)

### Step1
まず、ビルドのために必要となる開発環境をインストールします。

 - Node.js
 - npm
 - Java SE Runtime Environment 8

### Step2
ソースコードをCloneします。

```bash
git clone https://github.com/firebase/firebaseui-web.git
cd firebaseui-web
npm install
```

### Step3
ESM用の日本語版ファイルをビルドします。

```bash
npm run build build-esm-ja
```

`dist` フォルダ 内にある `esm__ja.js` が出力されたファイルになります。

### Step4
読み込みます。TypeScriptを用いているので、 `index.d.ts` もコピーしました。

```typescript
import './firebaseui/@types/index'
import { auth } from './firebaseui/esm__ja'

// ～ Firebaseの設定は略 ～ //

window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname === '/login') {
    const ui = new auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          return true
        },
        signInFailure: (err) => {
          console.error(err)
        },
        uiShown: () => {},
      },
      signInSuccessUrl: '/',
      privacyPolicyUrl: '/policy',
    })
  }
})
```

### Step5
Step4のままだと、まだ `<projectid>.firebaseapp.com` に飛ばされます。<br>
そこで、Firebaseの設定ファイルを変更します。

```typescript
{
  apiKey: '...',
  // authDomain: '<projectid>.firebaseapp.com',
  authDomain: 'hogehoge.com',
  databaseURL: '...',
  // 以下略
}
```

これで、Webpackでビルドすると、きちんと日本語になり、 `hogehoge.com` に飛ばされました！
