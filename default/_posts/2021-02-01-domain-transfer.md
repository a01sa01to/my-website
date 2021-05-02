---
title: ドメインを移管しました
layout: blog_posts
tags: Domain Website
relPath: /2021/02/domain-transfer
last_modified_at: 2021-05-02
a_few_word: Googleのヘビーユーザーになってしまう...
---

この記事、今更感がすごい

## 移管した理由
最初にドメインを登録したのが2019年4月1日。<br>
だから1年と7ヶ月くらい？ <a href="https://px.a8.net/svt/ejp?a8mat=3H5C5X+FQ79UI+50+2HHVNM" rel="nofollow" target="_blank">お名前.com</a>
<img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=3H5C5X+FQ79UI+50+2HHVNM" alt="" class="a8">を使っていたんですよね。

サイトを再構築するときに考えていたのは

<div class="card">
  <div class="card-body">
    Git と 連携 させたい ... ！！
  </div>
</div>

Google App Engine ならGitHubにソース上げればデプロイしてくれるからベストだと思い、
いっそのことGoogleサービスにまとめちゃえ！！っていうだけ。
（GitHub Actions使えばFTPで上げられたりするんですけどね）

## タイムライン
 - 2020.11.29 19:50 ドメイン移管手続き開始
 - 2020.11.29 19:57 支払い
 - 2020.11.29 20:27 拒否られた
 - 2020.11.30 18:43 リベンジ
 - 2020.11.30 19:38 確認メールが来た
 - 2020.11.30 22:15 メールに気づき、承認
 - 2020.11.30 22:27 移管完了


## Step by Step
今回は「お名前.com（以下「移管元」）」から「Google Domains（以下「移管先」）」に移管しました。

### Step1 - 入力
移管先のサイトを開き、「移管する」ページを開きます。
移管したいドメインを入力します。
![移管するドメインをテキストボックスに入力](/img/blog/2021/02/domain-transfer/01.png)

### Step2 - AuthCode
移管元から、AuthCodeを取得します。移管先に入力します。
![移管元から取得して...](/img/blog/2021/02/domain-transfer/02.png)
![移管先に貼り付け](/img/blog/2021/02/domain-transfer/03.png)

### Step3 - Whois代行公開を一時無効化
Whois公開代行を一時的に無効化しないと、移管できないようです（お名前.comの場合は）。<br>
私は無効化していなかったので、拒否されました。
![拒否された！？](/img/blog/2021/02/domain-transfer/10.png)
![Whois公開代行されているとダメらしい](/img/blog/2021/02/domain-transfer/11.png)

なので、忘れずに無効化しておきましょう。

### Step4 - 設定確認
設定を確認します。<br>
~~DNS設定は引き継がれるらしい。まあ引き継がれなかったら困る。~~<br>
一部引き継がれてなかった。一応移管後に確認しておいたほうがよさそうです。

![](/img/blog/2021/02/domain-transfer/04.png)

なお、この時支払うのは、1年間分の料金である￥1,400です。
![](/img/blog/2021/02/domain-transfer/05.png)

### Step5 - 支払い
![JCBで払おうとすると...？](/img/blog/2021/02/domain-transfer/06.png)

いつも使っているJCB（LINE Pay）でやろうとしたところ、何度やってもダメでした。
![なんでや！](/img/blog/2021/02/domain-transfer/07.png)

そこでVisaを使ってみると、支払い完了しました。
![](/img/blog/2021/02/domain-transfer/08.png)

![支払いが完了するとステータスが表示される](/img/blog/2021/02/domain-transfer/09.png)

### Step6 - 移管承認
支払い後、移管元からメールが届きます。<br>
このメールから承認しないと、移管できないので、承認します。
![確認メールが届くので](/img/blog/2021/02/domain-transfer/12.png)
![承認](/img/blog/2021/02/domain-transfer/13.png)

### Step7 - 移管完了
しばらくすると、移管が完了し、移管先からメールが届きました。
![！！！](/img/blog/2021/02/domain-transfer/14.png)

DNSはいくつか引き継がれていませんでした。
![DNS一覧](/img/blog/2021/02/domain-transfer/15.png)
