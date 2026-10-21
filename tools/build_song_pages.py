#!/usr/bin/env python3
"""曲ごとのページ (songs/*.html)、曲の一覧 (songs/index.html)、sitemap.xml を作る (2026-10-21)。

    python3 tools/build_song_pages.py

ねらい: 「曲名 ドレミ」「曲名 簡単」「楽譜なし」で調べた人に、最初のメロディのドレミと、
Plush Keys での弾き方を届ける。ドレミはアプリ (instrument-app) の曲データから出したもの
(Plush Keys の編曲の音。原曲から調を移した曲はそう書く)。
アプリに無い機能や、まだ公開していない版の機能は書かない。曲を足すときは SONGS に足して実行する。
"""
import html
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://hirokishingu.github.io/plushkeys-site/"
STORE = "https://apps.apple.com/jp/app/plush-keys/id6780288745"
TODAY = date.today().isoformat()
# アプリの曲数 (日本語の一覧)。アプリの版を上げて曲数が変わったら直す。
APP_SONG_COUNT = 193

# chunks: ドレミを何音ずつ改行するか。free: 無料で弾けるか (False = プレミアム)。
# long: ロング版があるか ("free" / "premium" / None)。transposed: アプリの編曲で調を移しているか。
SONGS = [
    {"slug": "fur-elise", "title": "エリーゼのために", "search": "エリーゼ", "composer": "ベートーヴェン",
     "image": "composer_beethoven.png", "free": True, "long": "premium", "transposed": False,
     "doremi": "ミ レ♯ ミ レ♯ ミ シ レ ド ラ ド ミ ラ シ ミ ソ♯ シ ド ミ ミ レ♯ ミ レ♯ ミ シ", "chunks": [9, 4, 4, 7],
     "about": ["ベートーヴェンが1810年ごろに書いたピアノの小品です（WoO 59）。ベートーヴェンの死後、1867年に出版されて知られるようになりました。",
               "題名の「エリーゼ」がだれなのかは、今もはっきりしていません。冒頭の「ミ レ♯ ミ レ♯」と行き来するメロディは、誰もが一度は聞いたことのあるフレーズです。"],
     "tip": "最初の「ミ レ♯ ミ レ♯ ミ」は、となりどうしの白鍵と黒鍵を行き来するだけ。ここを何度かくり返すと、すぐに指が覚えます。"},
    {"slug": "canon", "title": "カノン", "search": "カノン", "composer": "パッヘルベル",
     "image": "composer_pachelbel.png", "free": True, "long": "premium", "transposed": True,
     "doremi": "ミ レ ド シ ラ ソ ラ シ ド シ ラ ソ ファ ミ ファ レ", "chunks": [8, 8],
     "about": ["ドイツの作曲家パッヘルベル（1653〜1706年）の「カノンとジーグ」の前半です。同じメロディを少しずつ遅れて重ねていく「カノン」という書き方で作られています。",
               "原曲はニ長調。結婚式や卒業式でもよく使われる、ゆったりとした曲です。"],
     "tip": "Plush Keys ではハ長調に移しているので、白鍵だけで弾けます。「ミ レ ド シ ラ ソ ラ シ」と、階段を下りるように進むところから始めましょう。"},
    {"slug": "turkish-march", "title": "トルコ行進曲", "search": "トルコ", "composer": "モーツァルト",
     "image": "composer_mozart.png", "free": True, "long": "premium", "transposed": False,
     "doremi": "シ ラ ソ♯ ラ ド レ ド シ ド ミ ファ ミ レ♯ ミ シ ラ ソ♯ ラ シ ラ ソ♯ ラ ド ラ", "chunks": [5, 5, 8, 6],
     "about": ["モーツァルトのピアノソナタ第11番 イ長調 K.331 の第3楽章です。楽譜に「トルコ風に」と書かれていて、当時ヨーロッパで人気だったトルコの軍楽隊の響きをまねています。",
               "細かい音が続くので速く感じますが、最初は「シ ラ ソ♯ ラ ド」の5つの音のまとまりで覚えると弾きやすくなります。"],
     "tip": "「シ ラ ソ♯ ラ ド」「レ ド シ ド ミ」と、同じ形が少しずつ上がっていきます。まずはゆっくり、まとまりごとに。"},
    {"slug": "ode-to-joy", "title": "第九（喜びの歌）", "search": "第九", "composer": "ベートーヴェン",
     "image": "composer_beethoven.png", "free": True, "long": "premium", "transposed": True,
     "doremi": "ミ ミ ファ ソ ソ ファ ミ レ ド ド レ ミ ミ レ レ", "chunks": [4, 4, 4, 3],
     "about": ["ベートーヴェンの交響曲第9番 ニ短調 作品125（1824年初演）の第4楽章で歌われるメロディです。歌詞はシラーの詩「歓喜に寄す」から取られています。",
               "日本では年末の「第九」として親しまれています。となりの音へ一歩ずつ進むメロディなので、はじめての1曲にもぴったりです。"],
     "tip": "白鍵だけで弾けます。「ミ ミ ファ ソ」「ソ ファ ミ レ」と、上がって下がる形を4つの音ずつ。"},
    {"slug": "minuet-in-g", "title": "メヌエット ト長調", "search": "メヌエット", "composer": "ペツォールト（バッハの曲集より）",
     "image": "composer_bach.png", "free": True, "long": "premium", "transposed": False,
     "doremi": "レ ソ ラ シ ド レ ソ ソ ミ ド レ ミ ファ♯ ソ ソ ソ", "chunks": [8, 8],
     "about": ["「アンナ・マグダレーナ・バッハのための音楽帳」（1725年）に収められている曲です。長いあいだバッハの作品とされてきましたが、今はクリスティアン・ペツォールトの作とされています。",
               "ピアノの発表会でもよく弾かれる、3拍子のおどりの曲です。"],
     "tip": "黒鍵は「ファ♯」だけ。「レ ソラシド レ ソ ソ」のリズムを口ずさみながら弾くと覚えやすくなります。"},
    {"slug": "twinkle-twinkle", "title": "きらきら星", "search": "きらきらぼし", "composer": "フランスの歌",
     "image": None, "free": True, "long": None, "transposed": False,
     "doremi": "ド ド ソ ソ ラ ラ ソ ファ ファ ミ ミ レ レ ド", "chunks": [7, 7],
     "about": ["18世紀のフランスの歌「ああ、お母さん聞いて（Ah! vous dirai-je, maman）」のメロディです。モーツァルトはこのメロディで変奏曲（K.265）を書きました。",
               "英語の歌詞「Twinkle, Twinkle, Little Star」で世界中に広まり、日本でも「きらきら星」として歌われています。"],
     "tip": "白鍵だけ、同じ音を2回ずつ。はじめてピアノにさわる人にいちばんおすすめの曲です。"},
    {"slug": "jingle-bells", "title": "ジングルベル", "search": "ジングルベル", "composer": "ピアポント",
     "image": None, "free": True, "long": "free", "transposed": False,
     "doremi": "ミ ミ ミ ミ ミ ミ ミ ソ ド レ ミ ファ ファ ファ ファ ファ ミ ミ ミ ミ ミ レ レ ミ", "chunks": [3, 3, 5, 5, 8],
     "about": ["アメリカのジェームズ・ロード・ピアポントが作った歌で、1857年に「One Horse Open Sleigh」という題で出版されました。",
               "今ではクリスマスの定番の曲です。「ミ ミ ミ」のくり返しから始まるので、すぐに弾けるようになります。"],
     "tip": "「ミ ミ ミ」「ミ ミ ミ」のあとに「ミ ソ ド レ ミ」。リズムよく、鈴を鳴らすつもりで。"},
    {"slug": "neko-funjatta", "title": "ねこふんじゃった", "search": "ねこふんじゃった", "composer": "作曲者不明",
     "image": None, "free": True, "long": None, "transposed": False,
     "doremi": "レ♯ ド♯ ファ♯ ファ♯ ファ♯ レ♯ ド♯ ファ♯ ファ♯ ファ♯ レ♯ ド♯ ファ♯ ファ♯ レ♯ ファ♯", "chunks": [5, 5, 6],
     "about": ["だれが作ったのかわからない曲ですが、世界中で弾かれています。国によって名前が違い、ドイツでは「ノミのワルツ」、ロシアでは「犬のワルツ」などと呼ばれています。",
               "ほとんど黒鍵だけで弾けるので、ピアノを習いはじめたころに覚える人が多い曲です。"],
     "tip": "黒鍵の「レ♯ ド♯ ファ♯」の3つの場所を覚えれば、あとはくり返し。色をたどれば、黒鍵も迷わず押せます。"},
    {"slug": "clair-de-lune", "title": "月の光", "search": "月の光", "composer": "ドビュッシー",
     "image": "composer_debussy.png", "free": False, "long": "premium", "transposed": True,
     "doremi": "ソ ミ レ ミ レ ド レ ド ミ ド シ ド シ ファ ラ シ", "chunks": [8, 8],
     "about": ["ドビュッシーのピアノ曲集「ベルガマスク組曲」の第3曲です（1890年ごろに書かれ、1905年に出版）。題名はヴェルレーヌの詩に由来するといわれています。",
               "原曲は変ニ長調で黒鍵の多い曲ですが、Plush Keys の編曲は白鍵だけで弾けるように調を移しています。"],
     "tip": "ゆっくりした曲なので、音の長さを感じながら。最初は「やさしい」で流れをつかみましょう。"},
    {"slug": "minute-waltz", "title": "子犬のワルツ", "search": "子犬のワルツ", "composer": "ショパン",
     "image": "composer_chopin.png", "free": False, "long": "premium", "transposed": False,
     "doremi": "ラ♭ ソ ラ♭ ド シ♭ ソ ラ♭ シ♭ ラ♭ ド シ♭ ソ ラ♭ ド シ♭ ソ", "chunks": [8, 8],
     "about": ["ショパンのワルツ 変ニ長調 作品64-1（1847年）です。自分のしっぽを追いかけてくるくる回る子犬のようすを表したといわれています。",
               "英語では「Minute Waltz（小さなワルツ）」と呼ばれます。"],
     "tip": "「ラ♭ ソ ラ♭ ド シ♭ ソ」と、くるくる回るような音型が続きます。最初はゆっくり、形を指に覚えさせて。"},
    {"slug": "la-campanella", "title": "ラ・カンパネラ", "search": "カンパネラ", "composer": "リスト",
     "image": "composer_liszt.png", "free": False, "long": None, "transposed": False,
     "doremi": "ド♯ レ♯ シ シ レ♯ シ レ♯ ラ♯ レ♯ ソ♯ レ♯ ソ レ♯ ソ♯ レ♯ ソ", "chunks": [8, 8],
     "about": ["リストの「パガニーニによる大練習曲」の第3番です（今よく弾かれるのは1851年の版）。パガニーニのヴァイオリン協奏曲第2番のメロディをもとにしています。",
               "「カンパネラ」はイタリア語で「鐘」。高い「レ♯」が鐘のように何度も鳴ります。"],
     "tip": "黒鍵がたくさん出てきますが、色をたどれば大丈夫。高い「レ♯」の鐘の音を合図に進みます。"},
    {"slug": "moonlight-sonata", "title": "月光ソナタ 第1楽章", "search": "月光", "composer": "ベートーヴェン",
     "image": "composer_beethoven.png", "free": False, "long": "premium", "transposed": True,
     "doremi": "ミ ミ ミ ミ ミ ミ ファ ミ レ ソ ド", "chunks": [3, 3, 5],
     "about": ["ベートーヴェンのピアノソナタ第14番 嬰ハ短調 作品27-2（1801年）の第1楽章です。「月光」という呼び名は、詩人レルシュタープが湖に映る月の光にたとえたことから広まったといわれています。",
               "原曲は嬰ハ短調。Plush Keys の編曲は白鍵だけで弾けるように調を移しています。"],
     "tip": "同じ音をそっとくり返すメロディです。伴奏はアプリがいっしょに弾いてくれるので、メロディだけに集中できます。"},
    {"slug": "jesu-joy", "title": "主よ人の望みの喜びよ", "search": "主よ人の望みの喜びよ", "composer": "バッハ",
     "image": "composer_bach.png", "free": False, "long": "premium", "transposed": False,
     "doremi": "ソ ラ シ レ ド ド ミ レ レ ソ ファ♯ ソ レ シ ソ ラ シ ド", "chunks": [6, 6, 6],
     "about": ["バッハのカンタータ第147番「心と口と行いと生活で」（1723年）の中で歌われるコラールのメロディです。",
               "3つずつの音がなめらかに流れるのが特徴で、結婚式やお祝いの場でもよく演奏されます。"],
     "tip": "「ソ ラ シ」「レ ド ド」と3つずつのまとまりで。流れるように、ゆっくりから。"},
    {"slug": "gymnopedie", "title": "ジムノペディ 第1番", "search": "ジムノペディ", "composer": "サティ",
     "image": "composer_satie.png", "free": False, "long": None, "transposed": True,
     "doremi": "ミ ソ ファ ミ シ ラ シ ド ソ ミ ミ ソ ファ ミ シ ラ", "chunks": [10, 6],
     "about": ["フランスの作曲家エリック・サティが1888年に書いたピアノ曲です。ゆったりした3拍子と、静かで不思議な響きが特徴です。",
               "原曲はニ長調。Plush Keys の編曲は白鍵だけで弾けるように調を移しています。"],
     "tip": "とてもゆっくりした曲です。1つ1つの音を長めに、静かに押してみましょう。"},
]


def esc(s):
    return html.escape(s, quote=True)


def doremi_lines(song):
    notes = song["doremi"].split()
    lines, i = [], 0
    for n in song["chunks"]:
        if i >= len(notes):
            break
        lines.append(" ".join(notes[i:i + n])); i += n
    if i < len(notes):
        lines.append(" ".join(notes[i:]))
    return lines


def accidental_note(song):
    notes = song["doremi"]
    if "♯" in notes and "♭" in notes:
        return "♯ はすぐ右の黒鍵、♭ はすぐ左の黒鍵です。"
    if "♯" in notes:
        return "♯ のついた音は、すぐ右の黒鍵です。"
    if "♭" in notes:
        return "♭ のついた音は、すぐ左の黒鍵です。"
    return "白鍵だけで弾けます。"


def page_title(song):
    return f"{song['title']}をドレミで｜楽譜なしで弾く方法 - Plush Keys"


def page_desc(song):
    status = "無料で弾けます" if song["free"] else "プレミアムの曲です（3日間の無料お試しあり）"
    first = " ".join(song["doremi"].split()[:6])
    return (f"「{song['title']}」（{song['composer']}）の最初のメロディをドレミで紹介。「{first}…」。"
            f"楽譜が読めなくても、Plush Keys なら落ちてくる色と同じ色の鍵盤を押すだけ。{status}。")


def faq(song):
    play = ("はい。「" + song["title"] + "」は無料の曲です。ダウンロードしてすぐに弾けます。") if song["free"] else \
           ("「" + song["title"] + "」はプレミアム（買い切り ¥300）の曲です。3日間の無料お試しでも弾けます。毎日1曲プレミアムの曲が無料になる「今日の1曲」に選ばれる日もあります。")
    if song["long"] == "premium":
        play += " もっと長く弾けるロング版はプレミアムです。"
    elif song["long"] == "free":
        play += " ロング版も無料です。"
    return [
        ("楽譜が読めなくても弾けますか？",
         "はい。Plush Keys では、上から落ちてくる色の帯と同じ色の鍵盤を押すだけで弾けます。ドレミや楽譜を覚えていなくても大丈夫です。慣れてきたら五線譜の表示にも切り替えられます（プレミアム）。"),
        ("無料で弾けますか？", play),
        ("本物のピアノや電子ピアノでも弾けますか？",
         "iPhone や iPad の画面の鍵盤で弾けるほか、USB や Bluetooth の MIDI キーボード・電子ピアノをつなげば、本物の鍵盤でも色の帯に合わせて弾けます。"),
    ]


def related(song):
    others = [s for s in SONGS if s["slug"] != song["slug"]]
    same = [s for s in others if s["composer"] == song["composer"]]
    rest = [s for s in others if s not in same]
    return (same + rest)[:6]


CSS_LINK = '<link rel="stylesheet" href="../styles.css" />'
FOOTER = """<footer>
  <div>
    <a href="../">Plush Keys</a>
    <a href="./">曲ごとの弾き方</a>
    <a href="../privacy.html">プライバシーポリシー</a>
    <a href="mailto:hiro.apps.shoten@gmail.com">サポート</a>
  </div>
  <span class="small">Plush Keys（プラッシュキーズ）— 楽譜なしで色をたどって弾けるピアノアプリ<br />
  Made by Hiro Apps Shoten, an independent developer. App Store is a trademark of Apple Inc.</span>
</footer>"""


def song_page(song):
    url = f"{BASE}songs/{song['slug']}.html"
    lines = doremi_lines(song)
    status_badge = '<span class="song-badge free">無料で弾ける</span>' if song["free"] else '<span class="song-badge premium">プレミアム</span>'
    img = (f'<img class="song-face" src="../assets/composers/{song["image"]}" alt="{esc(song["composer"])}の似顔絵（アプリの作曲家ずかんより）" width="112" height="112" loading="lazy" />'
           if song["image"] else '<img class="song-face" src="../assets/icon@3x.png" alt="Plush Keys のアイコン" width="112" height="112" loading="lazy" />')
    play_note = ("無料の曲です。" if song["free"] else "プレミアム（買い切り ¥300・3日間の無料お試しあり）の曲です。") + \
                ({"premium": "もっと長く弾けるロング版はプレミアムです。", "free": "ロング版も無料です。"}.get(song["long"], ""))
    key_note = ("Plush Keys の編曲での音です（白鍵だけで弾けるように、原曲から調を移しています）。"
                if song["transposed"] else "Plush Keys の編曲で、最初に出てくるメロディの音です。")
    faqs = faq(song)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Plush Keys", "item": BASE},
            {"@type": "ListItem", "position": 2, "name": "曲ごとの弾き方", "item": f"{BASE}songs/"},
            {"@type": "ListItem", "position": 3, "name": song["title"], "item": url}]},
        {"@type": "MusicComposition", "name": song["title"], "composer": {"@type": "Person", "name": song["composer"]}, "url": url},
        {"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]},
    ]}
    rel = "\n".join(f'      <li><a href="{s["slug"]}.html">{esc(s["title"])}</a><span class="song-link-sub">{esc(s["composer"])}</span></li>' for s in related(song))
    faq_html = "\n".join(f"    <details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs)
    about_html = "\n".join(f"    <p>{esc(p)}</p>" for p in song["about"])
    doremi_html = "<br />".join(esc(l) for l in lines)
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{esc(page_title(song))}</title>
<meta name="description" content="{esc(page_desc(song))}" />
<link rel="canonical" href="{url}" />
<meta name="apple-itunes-app" content="app-id=6780288745" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Plush Keys" />
<meta property="og:title" content="{esc(song['title'])}をドレミで｜楽譜なしで弾く方法" />
<meta property="og:description" content="{esc(page_desc(song))}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{BASE}assets/screenshots/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
{CSS_LINK}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="song-page">
<div class="topbar"><a class="brand" href="../">Plush&nbsp;Keys<span class="dot">.</span></a><a class="cta-btn small" href="{STORE}">アプリを見る</a></div>
<main class="wrap">
  <nav class="crumbs" aria-label="パンくずリスト"><a href="../">Plush Keys</a> › <a href="./">曲ごとの弾き方</a> › <span>{esc(song['title'])}</span></nav>
  <header class="song-head">
    {img}
    <div>
      <h1>{esc(song['title'])}<span class="song-h1-sub">をドレミで弾こう</span></h1>
      <p class="song-meta">{esc(song['composer'])}　{status_badge}</p>
    </div>
  </header>

  <section class="card song-doremi">
    <h2>最初のメロディをドレミで</h2>
    <p class="doremi">{doremi_html}</p>
    <p class="song-note">{esc(key_note)}{esc(accidental_note(song))}</p>
  </section>

  <section class="card">
    <h2>この曲について</h2>
{about_html}
  </section>

  <section class="card">
    <h2>Plush Keys で弾くには</h2>
    <ol class="song-steps">
      <li>アプリを開いて「曲を弾く」を選びます。</li>
      <li>上の検索に「{esc(song['search'])}」と入れて、曲を選びます。</li>
      <li>上から落ちてくる色の帯が下の線に来たら、同じ色の鍵盤を押します。むずかしいときは「やさしい」から。</li>
    </ol>
    <p>{esc(song['tip'])}</p>
    <p class="song-note">{esc(play_note)}</p>
  </section>

  <section class="faq">
    <h2>よくある質問</h2>
{faq_html}
  </section>

  <section class="cta-section">
    <p>楽譜が読めなくても、色をたどれば「{esc(song['title'])}」が弾けます。</p>
    <a class="store-badge" href="{STORE}" aria-label="App Store で Plush Keys を見る"><img src="../assets/badge-appstore-ja.svg" alt="App Store でダウンロード" height="60" /></a>
  </section>

  <section class="card">
    <h2>ほかの曲もドレミで</h2>
    <ul class="song-links">
{rel}
    </ul>
    <p class="song-note"><a href="./">曲ごとの弾き方の一覧へ</a></p>
  </section>
</main>
{FOOTER}
</body>
</html>
"""


def index_page():
    url = f"{BASE}songs/"
    items = "\n".join(
        f'    <li><a href="{s["slug"]}.html"><span class="song-link-title">{esc(s["title"])}</span>'
        f'<span class="song-link-sub">{esc(s["composer"])}・{"無料" if s["free"] else "プレミアム"}</span>'
        f'<span class="song-link-notes">{esc(" ".join(s["doremi"].split()[:6]))}…</span></a></li>'
        for s in SONGS)
    ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "楽譜なしで弾ける名曲のドレミ",
          "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{BASE}songs/{s['slug']}.html", "name": s["title"]}
                              for i, s in enumerate(SONGS)]}
    desc = "エリーゼのために・カノン・トルコ行進曲・月の光など、有名な曲の最初のメロディをドレミで紹介。楽譜が読めなくても、Plush Keys なら色をたどって弾けます。"
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>名曲をドレミで｜楽譜なしで弾ける曲の一覧 - Plush Keys</title>
<meta name="description" content="{esc(desc)}" />
<link rel="canonical" href="{url}" />
<meta name="apple-itunes-app" content="app-id=6780288745" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Plush Keys" />
<meta property="og:title" content="名曲をドレミで｜楽譜なしで弾ける曲の一覧" />
<meta property="og:description" content="{esc(desc)}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{BASE}assets/screenshots/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
{CSS_LINK}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="song-page">
<div class="topbar"><a class="brand" href="../">Plush&nbsp;Keys<span class="dot">.</span></a><a class="cta-btn small" href="{STORE}">アプリを見る</a></div>
<main class="wrap">
  <nav class="crumbs" aria-label="パンくずリスト"><a href="../">Plush Keys</a> › <span>曲ごとの弾き方</span></nav>
  <h1 class="song-index-h1">名曲をドレミで弾こう</h1>
  <p class="lead">有名な曲の最初のメロディを、ドレミで紹介します。楽譜が読めなくても、Plush Keys なら落ちてくる色と同じ色の鍵盤を押すだけ。アプリには童謡からクラシックまで{APP_SONG_COUNT}曲が入っています。</p>
  <ul class="song-links song-index">
{items}
  </ul>
  <section class="cta-section">
    <a class="store-badge" href="{STORE}" aria-label="App Store で Plush Keys を見る"><img src="../assets/badge-appstore-ja.svg" alt="App Store でダウンロード" height="60" /></a>
  </section>
</main>
{FOOTER}
</body>
</html>
"""


def sitemap():
    urls = [BASE, f"{BASE}privacy.html", f"{BASE}songs/"] + [f"{BASE}songs/{s['slug']}.html" for s in SONGS]
    body = "\n".join(f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod></url>" for u in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n'


def main():
    out = ROOT / "songs"
    out.mkdir(exist_ok=True)
    for s in SONGS:
        assert len(s["doremi"].split()) >= sum(s["chunks"][:1]), s["slug"]
        (out / f"{s['slug']}.html").write_text(song_page(s), encoding="utf-8")
    (out / "index.html").write_text(index_page(), encoding="utf-8")
    (ROOT / "sitemap.xml").write_text(sitemap(), encoding="utf-8")
    print(f"wrote {len(SONGS)} song pages + songs/index.html + sitemap.xml")


if __name__ == "__main__":
    main()
