---
title: Cleaning Up My Computer
layout: blog_posts
tags: Computer
relPath: /2021/06/cleaning-up-my-computer
last_modified_at: 2021-06-24
a_few_word: 年末にOSごとクリーンアップするのもありかも...？
---

クリーンアップって大事ですよね......。

ただパソコンのクリーンアップをするだけの記事です。

## 使用容量を確認してみる

スクショ取り忘れました...。空き容量は 31.8GB です。ここからどのくらい減るか見ものです。

## 不要ファイルを削除していく

### 不要なプログラムを削除

はい、まず最初にやるべきことと言ったらこれです。不要なプログラムをアンインストールします。

「設定 > アプリ > アプリと機能 > （アプリ選択） > アンインストール」です。全く使っていないアプリ（1 桁台）をアンインストール。<br>
プログラムサイズが小さかったのか、消すプログラムが少なかったのか、3GB くらいしか増えず...。

### フォルダ整理

とりあえず、今後見やすくするために、空フォルダを削除していきます。

Powershell で削除したい親フォルダに移動した後、以下のコマンドを実行します。子孫フォルダが多いと、かなり時間がかかります。<br>
（※一応動作確認はしていますが、以下のコマンドを実行したことにより生じた損害については責任を負いかねます）

```powershell
Measure-Command{
  $dirs = Get-ChildItem -Directory -Recurse | Sort-Object -Descending
  foreach($dir in $dirs){
    $item = Get-ChildItem -Path $dir -Recurse
    if($item.Count -eq 0){
      Write-Host "Deleting $dir"
      Remove-Item $dir
    }
  }
}
```

`$dirs`に子孫フォルダを保存し、それぞれについて、ファイル数が 0 なら削除、といった流れです。`Measure-Command`で時間計測をしています。

`%UserProfile%`フォルダで試してみた結果、1464 フォルダが削除されました。実行時間は 13 分 11 秒でした。

### Windows のクリーンアップ機能を使う

Windows に標準搭載されている、クリーンアップツールを使います。<br>
エクスプローラーで、C ドライブなどを選択して、上の「管理・ドライブツール」にあるやつです。

![2GB増やせるみたい](/img/blog/2021/06/cleaning-up/01.png)

33.7GB まで空きました。

### %temp%フォルダを消す

一応、ある程度は上のツールで消えてくれるんですが、まだ割と残っているので、エクスプローラーから削除します。

```powershell
cd $ENV:temp
Measure-Command{
  $dirs = Get-ChildItem -Directory -Recurse | Sort-Object -Descending
  foreach($dir in $dirs){
    Write-Host "Deleting $dir"
    Remove-Item $dir -force -Recurse
  }
  $files = Get-ChildItem
  foreach($file in $files){
    Write-Host "Deleting $file"
    Remove-Item $file -force
  }
}
```

空き容量は 35.3GB です。そこまで期待はしていませんでした。

### CCleaner で消していく

クリーニングソフトでは有名な、[CCleaner](https://www.ccleaner.com/) を使って消していきます。

![Custom Cleanをしてみる](/img/blog/2021/06/cleaning-up/02.png)

スキャンしてみた結果、「約 4,687MB（=4.58GB）消せそう」と出ていましたが、実際に消してみると 5,139MB（=5.02GB）消せました。<br>空き容量は 39.8GB になりました。

ついでにレジストリも削除しました。

### 手作業で消していく

はい、結局これに尽きます。アンインストールしたソフトでも、完全にはファイルが消えているわけではないので。

以下のコードは、開いたフォルダ内のファイルのうち、最新の書き込み日時を取得して出力するコードです。

```powershell
Measure-Command{
  $dirs = Get-ChildItem -Recurse | Sort-Object -Descending
  [System.Datetime] $lastUpdate = "2000/01/01 00:00"
  foreach($dir in $dirs){
    if($dir.LastWriteTime -gt $lastUpdate){
      $lastUpdate = $dir.LastWriteTime
    }
  }
  Write-Host "Last Update: $lastUpdate"
}
```

要らなさそうなファイルを消した結果、47.6GB まで増えました。<br>
（アンインストールしたプログラムや、Cache フォルダ、最終更新から 1 年経っているフォルダなどを削除しました）

この後に念のため、CCleaner のレジストリクリーナーを走らせました。

### .git フォルダの軽量化

C ドライブの Documents フォルダ内に Git 管理のプログラムを大量においていたため、Git により容量が使われている可能性があったので、軽量化します。

なお、日をまたいでしまったので 45.0GB にリバウンドしました()。

さて、Git リポジトリで以下のコマンドを実行します。<br>
[Git - メンテナンスとデータリカバリ](https://git-scm.com/book/ja/v2/Git%E3%81%AE%E5%86%85%E5%81%B4-%E3%83%A1%E3%83%B3%E3%83%86%E3%83%8A%E3%83%B3%E3%82%B9%E3%81%A8%E3%83%87%E3%83%BC%E3%82%BF%E3%83%AA%E3%82%AB%E3%83%90%E3%83%AA)

```powershell
git gc
```

例えば、[a01sa01to/covid19-ibaraki](https://github.com/a01sa01to/covid19-ibaraki) における `.git` フォルダの容量は、4.72GB から 4.68GB に減りました。ほんとに誤差ですね...。ちなみに 12 分かかりました。

### node_modules フォルダの軽量化

node_modules フォルダによっても容量が使われている可能性があったので、軽量化します。

この手法は npm を利用している場合有効で、Yarn を利用している場合は必要ないようです。<br>
Yarn の場合 `yarn install` 時に[自動で軽量化される](https://classic.yarnpkg.com/en/docs/cli/prune/)らしいです。

```powershell
npm prune
```

えっと、npm を使っているプロジェクトがありませんでした...笑

次に、Yarn で不要なファイルを削除します。上の代替なのかもしれませんが。

注意（[yarn autoclean | Yarn](https://classic.yarnpkg.com/en/docs/cli/autoclean)より意訳）

> このコマンドは上級者向けと思っておいてください。`node_modules` 内に大量のファイルがあることで問題が生じているとき以外は、このコマンドは推奨されません。`node_modules`内のファイルを恒久的に削除するため、パッケージが停止する原因になり得ます。

はい、やっていきます。（なにか損害が生じても責任は負いかねますよ。）

```powershell
yarn autoclean --init
yarn autoclean --force
```

`yarn autoclean --init` で `.yarnclean` ファイルを作成します。このファイルが存在すると、`yarn install` や `yarn add` の際に自動的に不要ファイルが削除されるとのことです。<br>
でも、もうすでに `yarn install` はしてあるし、`yarn add` するパッケージもない...ということで、`yarn autoclean --force` で実行しています。

再び [a01sa01to/covid19-ibaraki](https://github.com/a01sa01to/covid19-ibaraki) で実験してみた結果、3,697 ファイルが削除され、14.23MB が空きました。ちなみに実行時間は 25.43 秒でした。十分高速。

## 結果は...？

前述したように、日をまたぐ前は ~~47.6GB~~ 47.8GB まで増えました。<br>
日をまたいだことにより 45.0GB までリバウンドしましたが、45.2GB まで増加。

![47.8GBまで増えた！](/img/blog/2021/06/cleaning-up/03.png)

内訳は上の画像の通り。システムは変更できないけど、「アプリと機能」も必要なものしか残っていないはず...です。たぶん。

上記以外にもいろいろな手法を試してみたいと思います。
