# Pentaben
タブレットとPC間でWebSocket通信して，タブレットをペンタブにする．
```
<---Tablet-->  WebSocket   <--------PC-------->
    browser      --->       server  --->  mouse
```

![humanity](https://user-images.githubusercontent.com/26299162/59980156-d3580800-962c-11e9-9aed-76bd6b83f34a.gif)

0. タブレットとPCをLANに接続する．
1. タブレット側でタップした座標を取得し，WebSocket通信でPC側に送る．
2. PC側では受信した文字列をパースし，取得した座標位置にWindowsAPIによりマウスを動かす．

## Usage
+ `右クリック`: 2連続タップ
+ `左クリック`: タップ

## Libraries & API
#### PC
+ Tornado
+ python win32con module(for WindowsAPI)

#### Tablet
+ Hummer.js
+ WebSocket
+ WebAudio

## Requirements
+ タブレット側のブラウザは`FireFox`のみ対応．
+ PC側は`Windows`のみ対応．
+ PC側のLAN IPアドレスを予め`ws://192.168.xxx.xxx:8000`に固定しておき，そのIPアドレスにアクセスする．
   + IPアドレスはstatic/main.js内にハードコード．

## Problems
+ ガバガバなセキュリティ．
+ singletapのチャタリング問題．
+ 左クリックのUXに改善の余地あり．
