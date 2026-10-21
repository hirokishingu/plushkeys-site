#!/usr/bin/env python3
"""曲ごとのページ (日本語 songs/*.html・英語 en/songs/*.html)、それぞれの一覧、sitemap.xml を作る (2026-10-21)。

    python3 tools/build_song_pages.py

ねらい: 「曲名 ドレミ」「曲名 簡単」「楽譜なし」で調べた人に、最初のメロディのドレミと、
Plush Keys での弾き方を届ける。英語のページは「<曲名> piano letter notes」で調べた人に、同じメロディを
音名 (C D E…) で届ける。ドレミはアプリ (instrument-app) の曲データから出したもの
(Plush Keys の編曲の音。原曲から調を移した曲はそう書く)。
アプリに無い機能や、まだ公開していない版の機能は書かない。曲を足すときは tools/song_pages_data.py に足して実行する。
"""
import html
import json
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from song_pages_data import SONGS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://hirokishingu.github.io/plushkeys-site/"
STORE = "https://apps.apple.com/jp/app/plush-keys/id6780288745"
STORE_EN = "https://apps.apple.com/us/app/plush-keys/id6780288745"
TODAY = date.today().isoformat()
# アプリの曲数 (日本語の一覧 / 英語の一覧)。アプリの版を上げて曲数が変わったら直す。
APP_SONG_COUNT = 192
APP_SONG_COUNT_EN = 175
# 米国のプレミアムの価格 (英語のページに書く)。App Store Connect で変えたら直す。
PRICE_US = "$3.99"

CATS = [("classical", "クラシック", "Classical"),
        ("folk", "童謡・唱歌・世界の歌", "Nursery rhymes & folk songs"),
        ("christmas", "クリスマスの歌", "Christmas songs")]
JA2EN = {"ド": "C", "レ": "D", "ミ": "E", "ファ": "F", "ソ": "G", "ラ": "A", "シ": "B"}
EN_SONGS = [s for s in SONGS if s.get("en")]


def esc(s):
    return html.escape(s, quote=True)


def ja_url(song):
    return f"{BASE}songs/{song['slug']}.html"


def en_url(song):
    return f"{BASE}en/songs/{song['slug']}.html"


def letters(doremi):
    """ドレミを音名に (ファ♯ → F♯)。"""
    out = []
    for n in doremi.split():
        acc = n[-1] if n[-1] in "♯♭" else ""
        out.append(JA2EN[n[:-1] if acc else n] + acc)
    return " ".join(out)


def note_lines(notes, chunks):
    notes = notes.split()
    lines, i = [], 0
    for n in chunks:
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
    return "曲の最後まで白鍵だけで弾けます。" if song["white"] else "ここまでは白鍵だけで弾けます。"


def accidental_note_en(song):
    notes = song["doremi"]
    if "♯" in notes and "♭" in notes:
        return "♯ means the black key just to the right, and ♭ the black key just to the left."
    if "♯" in notes:
        return "A note with ♯ is the black key just to the right of it."
    if "♭" in notes:
        return "A note with ♭ is the black key just to the left of it."
    return "White keys only, all the way to the end." if song["white"] else "White keys only, up to here."


def composers_ld(names):
    people = [{"@type": "Person", "name": n} for n in names]
    return people[0] if len(people) == 1 else people


def related(song, pool):
    others = [s for s in pool if s["slug"] != song["slug"]]
    same = [s for s in others if s["composer"] == song["composer"]]
    cat = [s for s in others if s not in same and s["cat"] == song["cat"]]
    rest = [s for s in others if s not in same and s not in cat]
    return (same + cat + rest)[:6]


def alternates(song):
    """同じ曲の日本語と英語のページを、検索エンジンに知らせる。"""
    if not song.get("en"):
        return ""
    return (f'<link rel="alternate" hreflang="ja" href="{ja_url(song)}" />\n'
            f'<link rel="alternate" hreflang="en" href="{en_url(song)}" />\n'
            f'<link rel="alternate" hreflang="x-default" href="{en_url(song)}" />\n')


# ---------------------------------------------------------------- 日本語

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
    url = ja_url(song)
    lines = note_lines(song["doremi"], song["chunks"])
    status_badge = '<span class="song-badge free">無料で弾ける</span>' if song["free"] else '<span class="song-badge premium">プレミアム</span>'
    img = (f'<img class="song-face" src="../assets/composers/{song["image"]}" alt="{esc(song["composer"])}の似顔絵（アプリの作曲家ずかんより）" width="112" height="112" loading="lazy" />'
           if song["image"] else '<img class="song-face" src="../assets/icon@3x.png" alt="Plush Keys のアイコン" width="112" height="112" loading="lazy" />')
    play_note = ("無料の曲です。" if song["free"] else "プレミアム（買い切り ¥300・3日間の無料お試しあり）の曲です。") + \
                ({"premium": "もっと長く弾けるロング版はプレミアムです。", "free": "ロング版も無料です。"}.get(song["long"], ""))
    key_note = ("Plush Keys の編曲での音です（原曲から調を移しています）。"
                if song["transposed"] else "Plush Keys の編曲で、最初に出てくるメロディの音です。")
    faqs = faq(song)
    work = {"@type": "MusicComposition", "name": song["title"], "url": url}
    if not song.get("trad"):
        work["composer"] = composers_ld(song.get("persons") or [song["composer"]])
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Plush Keys", "item": BASE},
            {"@type": "ListItem", "position": 2, "name": "曲ごとの弾き方", "item": f"{BASE}songs/"},
            {"@type": "ListItem", "position": 3, "name": song["title"], "item": url}]},
        work,
        {"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]},
    ]}
    rel = "\n".join(f'      <li><a href="{s["slug"]}.html">{esc(s["title"])}</a><span class="song-link-sub">{esc(s["composer"])}</span></li>' for s in related(song, SONGS))
    faq_html = "\n".join(f"    <details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs)
    about_html = "\n".join(f"    <p>{esc(p)}</p>" for p in song["about"])
    doremi_html = "<br />".join(esc(l) for l in lines)
    lang_link = (f'<a class="song-lang" href="../en/songs/{song["slug"]}.html" hreflang="en" lang="en">English</a>'
                 if song.get("en") else "")
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{esc(page_title(song))}</title>
<meta name="description" content="{esc(page_desc(song))}" />
<link rel="canonical" href="{url}" />
{alternates(song)}<meta name="apple-itunes-app" content="app-id=6780288745" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Plush Keys" />
<meta property="og:locale" content="ja_JP" />
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
  <nav class="crumbs" aria-label="パンくずリスト">{lang_link}<a href="../">Plush Keys</a> › <a href="./">曲ごとの弾き方</a> › <span>{esc(song['title'])}</span></nav>
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


def index_items(songs, en=False):
    def item(s):
        if en:
            e = s["en"]
            return (f'    <li><a href="{s["slug"]}.html"><span class="song-link-title">{esc(e["title"])}</span>'
                    f'<span class="song-link-sub">{esc(e["composer"])} · {"Free" if s["free"] else "Premium"}</span>'
                    f'<span class="song-link-notes">{esc(" ".join(letters(s["doremi"]).split()[:6]))}…</span></a></li>')
        return (f'    <li><a href="{s["slug"]}.html"><span class="song-link-title">{esc(s["title"])}</span>'
                f'<span class="song-link-sub">{esc(s["composer"])}・{"無料" if s["free"] else "プレミアム"}</span>'
                f'<span class="song-link-notes">{esc(" ".join(s["doremi"].split()[:6]))}…</span></a></li>')
    blocks = []
    for key, ja_name, en_name in CATS:
        group = [s for s in songs if s["cat"] == key]
        if group:
            blocks.append(f'  <h2 class="song-index-h2">{esc(en_name if en else ja_name)}</h2>\n'
                          f'  <ul class="song-links song-index">\n' + "\n".join(item(s) for s in group) + "\n  </ul>")
    return "\n".join(blocks)


INDEX_ALTERNATES = (f'<link rel="alternate" hreflang="ja" href="{BASE}songs/" />\n'
                    f'<link rel="alternate" hreflang="en" href="{BASE}en/songs/" />\n'
                    f'<link rel="alternate" hreflang="x-default" href="{BASE}en/songs/" />\n')


def index_page():
    url = f"{BASE}songs/"
    ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "楽譜なしで弾ける名曲のドレミ",
          "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": ja_url(s), "name": s["title"]}
                              for i, s in enumerate(SONGS)]}
    desc = ("エリーゼのために・カノン・月の光などのクラシック、ハッピーバースデー・かえるの合唱などの童謡、きよしこの夜などのクリスマスの歌。"
            "有名な曲の最初のメロディをドレミで紹介。楽譜が読めなくても、Plush Keys なら色をたどって弾けます。")
    return f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>名曲や童謡をドレミで｜楽譜なしで弾ける曲の一覧 - Plush Keys</title>
<meta name="description" content="{esc(desc)}" />
<link rel="canonical" href="{url}" />
{INDEX_ALTERNATES}<meta name="apple-itunes-app" content="app-id=6780288745" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Plush Keys" />
<meta property="og:locale" content="ja_JP" />
<meta property="og:title" content="名曲や童謡をドレミで｜楽譜なしで弾ける曲の一覧" />
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
  <nav class="crumbs" aria-label="パンくずリスト"><a class="song-lang" href="../en/songs/" hreflang="en" lang="en">English</a><a href="../">Plush Keys</a> › <span>曲ごとの弾き方</span></nav>
  <h1 class="song-index-h1">名曲や童謡をドレミで弾こう</h1>
  <p class="lead">有名な曲の最初のメロディを、ドレミで紹介します。楽譜が読めなくても、Plush Keys なら落ちてくる色と同じ色の鍵盤を押すだけ。アプリには童謡からクラシックまで{APP_SONG_COUNT}曲が入っています。</p>
{index_items(SONGS)}
  <section class="cta-section">
    <a class="store-badge" href="{STORE}" aria-label="App Store で Plush Keys を見る"><img src="../assets/badge-appstore-ja.svg" alt="App Store でダウンロード" height="60" /></a>
  </section>
</main>
{FOOTER}
</body>
</html>
"""


# ---------------------------------------------------------------- English

def en_title(song):
    return f"{song['en']['title']} – Easy Piano Letter Notes, No Sheet Music | Plush Keys"


def en_desc(song):
    e = song["en"]
    status = "Free to play" if song["free"] else "A Premium song with a 3-day free trial"
    first = " ".join(letters(song["doremi"]).split()[:8])
    return (f"Easy piano letter notes for “{e['title']}” ({e['composer']}): {first}… "
            f"In Plush Keys, just press the key that matches each falling color, no sheet music needed. {status}.")


def en_faq(song):
    t = song["en"]["title"]
    play = (f"Yes. “{t}” is a free song: download the app and play it right away.") if song["free"] else \
           (f"“{t}” is a Premium song. Premium is a one-time purchase ({PRICE_US} in the US) with a 3-day free trial, and no subscription. "
            "Some days it is also picked as Today's Song, when one Premium song is free to play.")
    if song["long"] == "premium":
        play += " The longer version is part of Premium."
    elif song["long"] == "free":
        play += " The longer version is free, too."
    return [
        ("Can I play it without reading sheet music?",
         "Yes. In Plush Keys, colored bars fall from the top. When a bar reaches the line, press the key of the same color. You don't need to know note names or read music. When you're ready, you can switch to a staff view (Premium)."),
        ("Is it free to play?", play),
        ("Can I use a real piano or keyboard?",
         "Yes. Play on the on-screen keyboard of your iPhone or iPad, or connect a USB or Bluetooth MIDI keyboard or digital piano and follow the colors on real keys."),
    ]


EN_CSS_LINK = '<link rel="stylesheet" href="../../styles.css" />'
EN_FOOTER = """<footer>
  <div>
    <a href="../../">Plush Keys</a>
    <a href="./">Piano letter notes</a>
    <a href="../../privacy.html">Privacy Policy</a>
    <a href="mailto:hiro.apps.shoten@gmail.com">Support</a>
  </div>
  <span class="small">Plush Keys — play the piano by following colors, no sheet music needed<br />
  Made by Hiro Apps Shoten, an independent developer. App Store is a trademark of Apple Inc.</span>
</footer>"""


def en_song_page(song):
    e = song["en"]
    url = en_url(song)
    lines = note_lines(letters(song["doremi"]), song["chunks"])
    status_badge = '<span class="song-badge free">Free to play</span>' if song["free"] else '<span class="song-badge premium">Premium</span>'
    img = (f'<img class="song-face" src="../../assets/composers/{song["image"]}" alt="Illustration of {esc(e["composer"])} from Plush Keys" width="112" height="112" loading="lazy" />'
           if song["image"] else '<img class="song-face" src="../../assets/icon@3x.png" alt="Plush Keys app icon" width="112" height="112" loading="lazy" />')
    play_note = ("A free song." if song["free"] else f"A Premium song (one-time purchase, {PRICE_US} in the US, with a 3-day free trial).") + \
                ({"premium": " The longer version is part of Premium.", "free": " The longer version is free, too."}.get(song["long"], ""))
    key_note = ("Letter notes from the Plush Keys arrangement (moved from the original key). "
                if song["transposed"] else "Letter notes of the opening melody in the Plush Keys arrangement. ")
    faqs = en_faq(song)
    work = {"@type": "MusicComposition", "name": e["title"], "url": url}
    if e.get("persons") or not song.get("trad"):
        work["composer"] = composers_ld(e.get("persons") or [e["composer"]])
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Plush Keys", "item": BASE},
            {"@type": "ListItem", "position": 2, "name": "Piano letter notes", "item": f"{BASE}en/songs/"},
            {"@type": "ListItem", "position": 3, "name": e["title"], "item": url}]},
        work,
        {"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]},
    ]}
    rel = "\n".join(f'      <li><a href="{s["slug"]}.html">{esc(s["en"]["title"])}</a><span class="song-link-sub">{esc(s["en"]["composer"])}</span></li>'
                    for s in related(song, EN_SONGS))
    faq_html = "\n".join(f"    <details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in faqs)
    about_html = "\n".join(f"    <p>{esc(p)}</p>" for p in e["about"])
    notes_html = "<br />".join(esc(l) for l in lines)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{esc(en_title(song))}</title>
<meta name="description" content="{esc(en_desc(song))}" />
<link rel="canonical" href="{url}" />
{alternates(song)}<meta name="apple-itunes-app" content="app-id=6780288745" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Plush Keys" />
<meta property="og:locale" content="en_US" />
<meta property="og:title" content="{esc(e['title'])} – easy piano letter notes" />
<meta property="og:description" content="{esc(en_desc(song))}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{BASE}assets/screenshots/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
{EN_CSS_LINK}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="song-page">
<div class="topbar"><a class="brand" href="../../">Plush&nbsp;Keys<span class="dot">.</span></a><a class="cta-btn small" href="{STORE_EN}">Get the app</a></div>
<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a class="song-lang" href="../../songs/{song['slug']}.html" hreflang="ja" lang="ja">日本語</a><a href="../../">Plush Keys</a> › <a href="./">Piano letter notes</a> › <span>{esc(e['title'])}</span></nav>
  <header class="song-head">
    {img}
    <div>
      <h1>{esc(e['title'])}<span class="song-h1-sub">easy piano letter notes</span></h1>
      <p class="song-meta">{esc(e['composer'])}　{status_badge}</p>
    </div>
  </header>

  <section class="card song-doremi">
    <h2>The melody in letter notes</h2>
    <p class="doremi">{notes_html}</p>
    <p class="song-note">{esc(key_note)}{esc(accidental_note_en(song))}</p>
  </section>

  <section class="card">
    <h2>About this piece</h2>
{about_html}
  </section>

  <section class="card">
    <h2>How to play it in Plush Keys</h2>
    <ol class="song-steps">
      <li>Open the app and tap “Play a Song”.</li>
      <li>Type “{esc(e['search'])}” in the search box and pick the song.</li>
      <li>When a falling colored bar reaches the line, press the key of the same color. If it feels hard, choose “Easy”.</li>
    </ol>
    <p>{esc(e['tip'])}</p>
    <p class="song-note">{esc(play_note)}</p>
  </section>

  <section class="faq">
    <h2>Questions</h2>
{faq_html}
  </section>

  <section class="cta-section">
    <p>No sheet music needed: follow the colors and play “{esc(e['title'])}”.</p>
    <a class="store-badge" href="{STORE_EN}" aria-label="See Plush Keys on the App Store"><img src="../../assets/badge-appstore-en.svg" alt="Download on the App Store" height="60" /></a>
  </section>

  <section class="card">
    <h2>More songs in letter notes</h2>
    <ul class="song-links">
{rel}
    </ul>
    <p class="song-note"><a href="./">All songs</a></p>
  </section>
</main>
{EN_FOOTER}
</body>
</html>
"""


def en_index_page():
    url = f"{BASE}en/songs/"
    ld = {"@context": "https://schema.org", "@type": "ItemList", "name": "Easy piano letter notes for famous songs",
          "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": en_url(s), "name": s["en"]["title"]}
                              for i, s in enumerate(EN_SONGS)]}
    desc = ("Easy piano letter notes for Für Elise, Twinkle Twinkle Little Star, Happy Birthday, Jingle Bells, Ode to Joy and more. "
            "No sheet music needed: in Plush Keys you just press the key that matches each falling color.")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Easy Piano Letter Notes for Famous Songs – No Sheet Music | Plush Keys</title>
<meta name="description" content="{esc(desc)}" />
<link rel="canonical" href="{url}" />
{INDEX_ALTERNATES}<meta name="apple-itunes-app" content="app-id=6780288745" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Plush Keys" />
<meta property="og:locale" content="en_US" />
<meta property="og:title" content="Easy piano letter notes for famous songs" />
<meta property="og:description" content="{esc(desc)}" />
<meta property="og:url" content="{url}" />
<meta property="og:image" content="{BASE}assets/screenshots/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
{EN_CSS_LINK}
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="song-page">
<div class="topbar"><a class="brand" href="../../">Plush&nbsp;Keys<span class="dot">.</span></a><a class="cta-btn small" href="{STORE_EN}">Get the app</a></div>
<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a class="song-lang" href="../../songs/" hreflang="ja" lang="ja">日本語</a><a href="../../">Plush Keys</a> › <span>Piano letter notes</span></nav>
  <h1 class="song-index-h1">Piano letter notes, song by song</h1>
  <p class="lead">The first melody of well-known songs in letter notes (C D E…). No sheet music needed: in Plush Keys you just press the key that matches each falling color. The app has {APP_SONG_COUNT_EN} songs, from nursery rhymes to classical favorites.</p>
{index_items(EN_SONGS, en=True)}
  <section class="cta-section">
    <a class="store-badge" href="{STORE_EN}" aria-label="See Plush Keys on the App Store"><img src="../../assets/badge-appstore-en.svg" alt="Download on the App Store" height="60" /></a>
  </section>
</main>
{EN_FOOTER}
</body>
</html>
"""


def sitemap():
    urls = ([BASE, f"{BASE}privacy.html", f"{BASE}songs/"] + [ja_url(s) for s in SONGS]
            + [f"{BASE}en/songs/"] + [en_url(s) for s in EN_SONGS])
    body = "\n".join(f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod></url>" for u in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n'


def check(song):
    n = len(song["doremi"].split())
    assert sum(song["chunks"]) == n, f"{song['slug']}: chunks {sum(song['chunks'])} != notes {n}"
    assert song["cat"] in {c[0] for c in CATS}, song["slug"]
    letters(song["doremi"])  # 知らない音名があれば KeyError で止まる


def main():
    slugs = [s["slug"] for s in SONGS]
    assert len(slugs) == len(set(slugs)), "slug が重なっています"
    out, out_en = ROOT / "songs", ROOT / "en" / "songs"
    out.mkdir(exist_ok=True)
    out_en.mkdir(parents=True, exist_ok=True)
    for s in SONGS:
        check(s)
        (out / f"{s['slug']}.html").write_text(song_page(s), encoding="utf-8")
    for s in EN_SONGS:
        (out_en / f"{s['slug']}.html").write_text(en_song_page(s), encoding="utf-8")
    (out / "index.html").write_text(index_page(), encoding="utf-8")
    (out_en / "index.html").write_text(en_index_page(), encoding="utf-8")
    (ROOT / "sitemap.xml").write_text(sitemap(), encoding="utf-8")
    print(f"wrote {len(SONGS)} Japanese + {len(EN_SONGS)} English song pages, both indexes and sitemap.xml")


if __name__ == "__main__":
    main()
