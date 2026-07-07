# plushkeys-site

## メモリ由来の教訓（2026-07-08 移設）
- 正リポジトリは `~/program/plushkeys-site/`（単独repo・github.com/hirokishingu/plushkeys-site・branch main）。`instrument-app/site/` は別の古いコピーなので編集しない。
- vanilla HTML/CSS/JS のみ。ビルドなし・GitHub Pages（.nojekyll）・外部ライブラリ禁止。
- 3言語切替は `.lang-section`（lang-kanji/lang-kana/lang-en）を JS トグル＋localStorage で表示中だけ display:block にする方式（本文は3ブロック複製）。
- 数字概念は3つとも別物で混同しない: 「40人の作曲家」（曲の作曲家総数）／「作曲家ずかん17人」（図鑑収録）／「フェイスウォール38面」（Strauss I/II=1枚、賛美歌は顔なし）。
- 曲追加時の LP 更新手順: instrument-app の Songs+SongLibrary metadata からカタログを再生成 → `showcase.js` の `SONGS` 配列を差替えるだけ（件数・作曲家数・ピル件数は自動再計算）。
- 公開（push）は外向き＝hiron 確認後。アプリ未公開中はバッジ非機能（STORE_URL null）で「近日公開」運用。
- ffmpeg 罠: zsh は `$VAR[v]` を配列添字と解釈する → filter_complex の変数は `${VAR}` かインラインにする。`-t DUR` を2番目の `-i` の前に置くと入力オプション扱いで尺制限が効かない → 出力直前に置く。
- `say` コマンド罠: zsh で `LINES`/`STATUS` 等は予約変数 → Python でループ生成が安全。
- 画像内容は必ず実物を Read/目視して確認する（md5/pixel差だけでは内容を誤判定するリスクあり、実例あり）。
- 一部の顔画像PNGは0%透過（矩形）なので円クリップで再マスクする必要がある（直貼りすると角が四角に見える）。
