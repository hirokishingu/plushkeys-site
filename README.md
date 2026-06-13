# Plush Keys — 公式サイト (plushkeys.com)

子ども向けピアノアプリ **Plush Keys** の LP + 法務ページ + `app-ads.txt` を配信する静的サイト。
**公開リポジトリ**（GitHub Pages を無料で使うため）。アプリ本体ソースは別管理（非公開）で、ここには含まれない。

## 構成

| ファイル | 役割 |
|---|---|
| `index.html` | LP 本体 (ja/en トグル) |
| `privacy.html` | プライバシーポリシー (ja/en) |
| `app-ads.txt` | AdMob 検証用 (ドメイン直下で配信される) |

> 利用規約(EULA)は Apple 標準の Licensed Application EULA を採用するため自前ページは置かない
> (アカウント/UGC共有なし・課金は Apple 経由のため特約不要)。
| `styles.css` / `assets/` | スタイル / アイコン・スクショ |
| `.github/workflows/pages.yml` | push で GitHub Pages へ自動デプロイ |

## デプロイ

`main` に push すると GitHub Actions が `actions/deploy-pages` で公開する。
Pages の Source は **GitHub Actions**（Settings → Pages）。

- 暫定 URL: `https://hirokishingu.github.io/plushkeys-site/`

## 独自ドメイン plushkeys.com を有効化する手順 (DNS 設定後)

1. レジストラの DNS に GitHub Pages の Apex レコードを設定:
   - `A @ 185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`
   - (任意 IPv6) `AAAA @ 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153`
   - (www も使うなら) `CNAME www hirokishingu.github.io.`
2. `pages.yml` の「Ensure CNAME」ステップのコメントを外す（または直下に `CNAME` ファイル=`plushkeys.com` を commit）。
3. Settings → Pages → Custom domain に `plushkeys.com` を入力 → DNS 検証通過後 **Enforce HTTPS** を ON。
4. 確認:
   - `https://plushkeys.com/` が LP を返す
   - `https://plushkeys.com/app-ads.txt` が 200 + `text/plain`

## 更新フロー

LP の編集元は本リポジトリ（`main`）。編集して push すれば自動再デプロイ。
（アプリ本体リポジトリ `instrument-app/site/` 側にもスナップショットがあるが、配信されるのは本リポジトリ。）

連絡先: hiro.apps.shoten@gmail.com / AdMob publisher: pub-2624486245232885
