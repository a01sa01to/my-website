---
title: GASでライブラリを使わずにTwitterクライアントを作成する
layout: blog_posts
tags: Computer Google GAS
relPath: /2021/06/gas-twitter
last_modified_at: 2021-06-25
a_few_word: 実はこれコロナ対策サイトの自動化の一環だったりします
---

GAS (Google Apps Script) から Twitter に投稿したいけど、検索してみるとライブラリを使うものだらけで、しかも同じライブラリ...。<br>
でもそれだと自分のやりたいことは達成できない...ということでいろいろ試行錯誤した結果を書きます。

## やりたいこと

- Access Token と Secret はもう既に持っているので、認証画面を通さずに投稿したい
- ライブラリは使いたくない（というか上の条件を満たせるものがない...？）

この 2 つです。<br>
調べて出てくるものでは、API Key と API Secret を設定しておいて、認証画面に飛ばす、という処理がありました。<br>
しかしもうすでに認証で得られる Access Token と Access Token Secret は取得していたため、この処理が必要なかったのです。<br>
（詳しく見ていなかったのでわかりませんが、この処理は 1 回限りなのかもしれません...）

## 実装

主に、[Twitter REST API の使い方](https://syncer.jp/Web/API/Twitter/REST_API/#section-5) と [POST statuses/update \| Docs \| Twitter Developer Platform](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update) を参考に実装しました。

```js
function createParams(obj,separator){
  let params = "";
  for(const key in obj){
    if(Object.prototype.hasOwnProperty.call(obj,key)){
      // "&key=value" を params に追加
      params += separator + encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    }
  }
  // 先頭の "&" が不要なので、取り除いたものを返す
  return params.substring(1);
}

function tweet(status){
  // ----- 設定 ----- //
  const apiKey = "API Key"
  const apiSec = "API Secret"
  const accessToken = "Access Token"
  const accessSecret = "Access Token Secret"
  const reqUrl = "https://api.twitter.com/1.1/statuses/update.json";  // APIのリソースURL

  // 現在の時刻を取得
  const now = new Date();

  const param = {
    oauth_consumer_key: apiKey,
    oauth_token: accessToken,
    status: status
    oauth_nonce: Math.random().toString(32).substring(2),  // ランダムな文字列を得る
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(now.getTime() / 1000).toString(),  // エポック秒
    oauth_version: "1.0",
  }


  // HMAC-SHA1方式のハッシュ値に変換
  const hash = Utilities.computeHmacSignature(
    Utilities.MacAlgorithm.HMAC_SHA_1,
    encodeURIComponent('POST')+"&"+encodeURIComponent(reqUrl)+"&"+encodeURIComponent(createParams(param,"&")),
    encodeURIComponent(apiSec)+"&"+encodeURIComponent(accessSecret)
  )

  // ハッシュをbase64エンコードすると署名になる
  const sign = Utilities.base64Encode(hash)
  param["oauth_signature"] = sign


  const header = {
    authorization: `OAuth ${createParams(param,",")}`
  }

  const option = {
    method: "POST",
    headers: header,
    payload: {status: status},
    muteHttpExceptions: true
  }

  // APIを叩く
  const res = UrlFetchApp.fetch(reqUrl, option)

  // 結果を出力する
  Logger.log(res.getResponseCode())
  Logger.log(res.getAllHeaders())
  Logger.log(res.getContentText())
}
```

もっときれいに処理ができたり、セキュリティ的に危ないところもあったりするかもしれないので、コピペの際は自己責任でお願いします...。

これで、どこかの処理で `tweet("hogehoge")` と呼び出せば `hogehoge` とツイートされるかと思います。以上。
