/* =====================================================================
 * Plush Keys LP — 作曲家フェイスウォール (Composer Face Wall)
 *
 * 39枚のチビ似顔絵を「曲数順に並ぶ顔タイルの壁」にし、各顔を操作子化:
 * タップ → その作曲家の曲だけに #pk-showcase を絞り込む。
 *
 * 依存ライブラリなし。本体 showcase.js / index.html と協調する想定。
 *  - カタログ(131曲)は再定義しない。window.PKShowcase 経由で参照/操作する。
 *  - 似顔絵は assets/composers/composer_<key>.png を loading=lazy で読み込む。
 *  - 言語(kanji/kana/en)は showcase と同じ 3way。CustomEvent('pk:lang') を listen。
 *  - prefers-reduced-motion で stagger / ぴょこ跳ねを停止。
 *
 * ---- 協調チャネル (2モード・どちらでも動く) ----
 *  A) 推奨: showcase.js に下記2点を足すと「正確な完全一致フィルタ」になる。
 *       window.PKShowcase.filterByComposer(jaNames|null)  // jaNames=該当作曲家のcj配列 or null=解除
 *       window.PKShowcase.onComposerCleared(fn)           // ピル/シーン/検索でcomposer解除された時に通知
 *     (詳細は spec.md の「showcase.js 最小パッチ」)
 *  B) フォールバック: API が無ければ既存 .pk-search-input に作曲家名を流し込む。
 *     既存 searchKey() が cj/ce を index 済なので追加データ無しで絞り込める。
 * ===================================================================== */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  /* ---- 作曲家データ (AUTO-GENERATED from /tmp/lp_composers.json — 39件) ----
   * ja / en / key(portraitキー) / n(曲数)。n の多い順。
   * Strauss は composer_strauss を I/II で共有 → 描画時に key で dedup し
   * n を合算(=4面ぶんを1枚に)、フィルタは両方の cj を OR で効かせる。 */
  var COMPOSERS_RAW = [
    { ja: 'ショパン', en: 'Chopin', key: 'composer_chopin', n: 15 },
    { ja: 'チャイコフスキー', en: 'Tchaikovsky', key: 'composer_tchaikovsky', n: 9 },
    { ja: 'ベートーヴェン', en: 'Beethoven', key: 'composer_beethoven', n: 9 },
    { ja: 'ドビュッシー', en: 'Debussy', key: 'composer_debussy', n: 5 },
    { ja: 'バッハ', en: 'Bach', key: 'composer_bach', n: 5 },
    { ja: 'ブラームス', en: 'Brahms', key: 'composer_brahms', n: 5 },
    { ja: 'モーツァルト', en: 'Mozart', key: 'composer_mozart', n: 5 },
    { ja: 'シューベルト', en: 'Schubert', key: 'composer_schubert', n: 4 },
    { ja: 'サン=サーンス', en: 'Saint-Saëns', key: 'composer_saint-saens', n: 3 },
    { ja: 'シュトラウス', en: 'Strauss II', key: 'composer_strauss', n: 3 },
    { ja: 'エルガー', en: 'Elgar', key: 'composer_elgar', n: 2 },
    { ja: 'グリーグ', en: 'Grieg', key: 'composer_grieg', n: 2 },
    { ja: 'シューマン', en: 'Schumann', key: 'composer_schumann', n: 2 },
    { ja: 'ドヴォルザーク', en: 'Dvořák', key: 'composer_dvorak', n: 2 },
    { ja: 'ヘンデル', en: 'Handel', key: 'composer_handel', n: 2 },
    { ja: 'メンデルスゾーン', en: 'Mendelssohn', key: 'composer_mendelssohn', n: 2 },
    { ja: 'J.F.ワーグナー', en: 'J.F. Wagner', key: 'composer_jf_wagner', n: 1 },
    { ja: 'オッフェンバック', en: 'Offenbach', key: 'composer_offenbach', n: 1 },
    { ja: 'ガーシュウィン', en: 'Gershwin', key: 'composer_gershwin', n: 1 },
    { ja: 'グノー', en: 'Gounod', key: 'composer_gounod', n: 1 },
    { ja: 'サティ', en: 'Satie', key: 'composer_satie', n: 1 },
    { ja: 'シュトラウス1世', en: 'Strauss I', key: 'composer_strauss', n: 1 },
    { ja: 'ジョプリン', en: 'Joplin', key: 'composer_joplin', n: 1 },
    { ja: 'スーザ', en: 'Sousa', key: 'composer_sousa', n: 1 },
    { ja: 'ネッケ', en: 'Necke', key: 'composer_necke', n: 1 },
    { ja: 'ハイドン', en: 'Haydn', key: 'composer_haydn', n: 1 },
    { ja: 'バダジェフスカ', en: 'Badarzewska', key: 'composer_badarzewska', n: 1 },
    { ja: 'パッヘルベル', en: 'Pachelbel', key: 'composer_pachelbel', n: 1 },
    { ja: 'ビゼー', en: 'Bizet', key: 'composer_bizet', n: 1 },
    { ja: 'ホルスト', en: 'Holst', key: 'composer_holst', n: 1 },
    { ja: 'ボッケリーニ', en: 'Boccherini', key: 'composer_boccherini', n: 1 },
    { ja: 'ラフマニノフ', en: 'Rachmaninoff', key: 'composer_rachmaninoff', n: 1 },
    { ja: 'ラヴェル', en: 'Ravel', key: 'composer_ravel', n: 1 },
    { ja: 'リスト', en: 'Liszt', key: 'composer_liszt', n: 1 },
    { ja: 'ロッシーニ', en: 'Rossini', key: 'composer_rossini', n: 1 },
    { ja: 'ワーグナー', en: 'Wagner', key: 'composer_wagner', n: 1 },
    { ja: 'ヴィヴァルディ', en: 'Vivaldi', key: 'composer_vivaldi', n: 1 },
    { ja: 'ヴェルディ', en: 'Verdi', key: 'composer_verdi', n: 1 },
    { ja: 'フォスター', en: 'Foster', key: 'composer_foster', n: 1 }
  ];

  /* portrait key で dedup → 38面。同一keyの cj を jas[] に束ね、n を合算。
   * en は曲数が多い側(=先に来た方=配列が n降順なので主たる方)を採用。 */
  function buildWall() {
    var byKey = {};
    var order = [];
    COMPOSERS_RAW.forEach(function (c) {
      if (!byKey[c.key]) {
        byKey[c.key] = { key: c.key, en: c.en, jas: [c.ja], primaryJa: c.ja, n: c.n };
        order.push(c.key);
      } else {
        byKey[c.key].jas.push(c.ja);
        byKey[c.key].n += c.n;
        // primaryJa / en は最初(=曲数多い側)を維持。Strauss は「シュトラウス」「Strauss II」のまま。
      }
    });
    var list = order.map(function (k) { return byKey[k]; });
    // 合算後 n で安定ソート(降順)。元配列が概ね降順なので Strauss(3→4)が少し前に出る。
    list.sort(function (a, b) { return b.n - a.n; });
    return list;
  }
  var WALL = buildWall(); // 38面

  /* ---- 3言語ラベル辞書 (UI文言のみ) ---- */
  var L = {
    kanji: {
      title: 'この子たちの名曲、ぜんぶ入ってます',
      lead: '気になる顔をタップすると、その作曲家の曲がすっと並びます。',
      all: 'ぜんぶ',
      allAria: 'すべての作曲家にもどす',
      songsSuffix: '曲',
      faceAria: '{name}（{n}曲）でしぼりこむ',
      activePrefix: '',
      activeName: '{name}の曲',
      activeCount: '{n}曲',
      clear: 'ぜんぶ見る'
    },
    kana: {
      title: 'このこたちの めいきょく、ぜんぶ はいってるよ',
      lead: 'きになる かおを タップすると、その さっきょくかの きょくが ならぶよ。',
      all: 'ぜんぶ',
      allAria: 'すべての さっきょくかに もどす',
      songsSuffix: 'きょく',
      faceAria: '{name}（{n}きょく）で しぼりこむ',
      activePrefix: '',
      activeName: '{name}の きょく',
      activeCount: '{n}きょく',
      clear: 'ぜんぶ みる'
    },
    en: {
      title: 'Every one of these wrote a song inside.',
      lead: 'Tap a face to line up just that composer’s songs.',
      all: 'All',
      allAria: 'Back to all composers',
      songsSuffix: '',
      faceAria: 'Filter by {name} ({n} songs)',
      activePrefix: '',
      activeName: '{name}',
      activeCount: '{n} songs',
      clear: 'Show all'
    }
  };

  /* ---- 状態 ---- */
  var lang = 'kanji';
  var activeKey = null; // 選択中の portrait key or null
  var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var root, elTitle, elLead, elFaces, elChip, suppressClear = false;

  function t(k) { return (L[lang] && L[lang][k]) || L.kanji[k] || ''; }
  function fmt(s, map) { return String(s).replace(/\{(\w+)\}/g, function (_, k) { return (map[k] != null ? map[k] : ''); }); }
  function faceName(c) { return lang === 'en' ? c.en : c.primaryJa; }

  /* ===== showcase との結線 ===== */
  // A) 推奨 API があれば exact-match で絞り込み。B) 無ければ検索欄に流し込む。
  function applyComposer(c) {
    var api = window.PKShowcase;
    if (api && typeof api.filterByComposer === 'function') {
      api.filterByComposer(c ? c.jas.slice() : null);
      return;
    }
    // フォールバック: 既存検索欄チャネル。
    var input = document.querySelector('.lang-section.show .pk-showcase-slot .pk-search-input')
      || document.querySelector('#pk-showcase .pk-search-input');
    if (!input) return;
    suppressClear = true; // 自分が起こした input で自分の選択を消さない
    if (c) {
      // primaryJa は cj の部分文字列として両 Strauss を拾う(共有ポートレート意図どおり)。
      input.value = (lang === 'en') ? c.en : c.primaryJa;
    } else {
      input.value = '';
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    suppressClear = false;
  }

  function scrollToShowcase() {
    var sc = document.querySelector('.lang-section.show .pk-showcase-slot #pk-showcase')
      || document.getElementById('pk-showcase');
    if (sc && sc.scrollIntoView) sc.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  /* ===== 選択トグル ===== */
  function selectKey(key, doScroll) {
    var next = (activeKey === key) ? null : key; // 同じ顔の再タップで解除
    activeKey = next;
    var c = next ? WALL.filter(function (x) { return x.key === next; })[0] : null;
    applyComposer(c);
    paintSelection();
    renderChip(c);
    if (next && doScroll) scrollToShowcase();
  }

  // 外部(ピル/シーン/手動検索)から composer が解除された時に呼ばれる
  function clearSelection() {
    if (suppressClear) return;
    if (activeKey == null) return;
    activeKey = null;
    paintSelection();
    renderChip(null);
  }

  function paintSelection() {
    if (!elFaces) return;
    var btns = elFaces.querySelectorAll('.pk-face');
    [].forEach.call(btns, function (b) {
      var on = b.getAttribute('data-key') === activeKey;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ===== レンダリング ===== */
  function renderChip(c) {
    if (!elChip) return;
    if (!c) { elChip.hidden = true; elChip.innerHTML = ''; return; }
    elChip.hidden = false;
    var label = fmt(t('activeName'), { name: faceName(c) }) + ' ' + fmt(t('activeCount'), { n: c.n });
    elChip.innerHTML = '';
    var span = document.createElement('span');
    span.className = 'pk-facechip-text';
    span.textContent = label;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pk-facechip-clear';
    btn.setAttribute('aria-label', t('clear'));
    btn.textContent = '✕'; // ✕
    btn.addEventListener('click', function () { selectKey(activeKey, false); });
    elChip.appendChild(span);
    elChip.appendChild(btn);
  }

  function faceEl(c, idx) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pk-face' + (c.n >= 5 ? ' pk-face-lg' : '');
    btn.setAttribute('data-key', c.key);
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', fmt(t('faceAria'), { name: faceName(c), n: c.n }));
    if (!reduce) { btn.style.setProperty('--i', Math.min(idx, 20)); btn.classList.add('pk-face-stagger'); }

    var img = document.createElement('img');
    img.className = 'pk-face-img';
    img.src = 'assets/composers/' + c.key + '.png';
    img.width = 200; img.height = 200;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = ''; // 名前/aria-label がボタンにあるので装飾扱い(二重読み上げ回避)
    img.setAttribute('aria-hidden', 'true');

    var name = document.createElement('span');
    name.className = 'pk-face-name';
    name.textContent = faceName(c);

    var badge = document.createElement('span');
    badge.className = 'pk-face-badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = c.n + t('songsSuffix');

    btn.appendChild(img);
    btn.appendChild(name);
    btn.appendChild(badge);
    btn.addEventListener('click', function () { selectKey(c.key, true); });
    return btn;
  }

  // 「ぜんぶ」タイル(先頭・絞り込み解除)
  function allTileEl() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pk-face pk-face-all';
    btn.setAttribute('data-key', '__all__');
    btn.setAttribute('aria-label', t('allAria'));
    var ic = document.createElement('span');
    ic.className = 'pk-face-all-ic';
    ic.setAttribute('aria-hidden', 'true');
    ic.textContent = '♪'; // ♪
    var name = document.createElement('span');
    name.className = 'pk-face-name';
    name.textContent = t('all');
    btn.appendChild(ic);
    btn.appendChild(name);
    btn.addEventListener('click', function () {
      if (activeKey != null) selectKey(activeKey, false); // 現在選択を解除
    });
    return btn;
  }

  function renderFaces() {
    if (!elFaces) return;
    elFaces.textContent = '';
    var frag = document.createDocumentFragment();
    frag.appendChild(allTileEl());
    WALL.forEach(function (c, i) { frag.appendChild(faceEl(c, i)); });
    elFaces.appendChild(frag);
    paintSelection();
  }

  function renderLabels() {
    if (elTitle) elTitle.textContent = t('title');
    if (elLead) elLead.textContent = t('lead');
  }

  /* ===== 言語切替 ===== */
  function setLang(next) {
    if (!L[next]) return;
    lang = next;
    renderLabels();
    renderFaces();         // 名前/aria を新言語で
    var c = activeKey ? WALL.filter(function (x) { return x.key === activeKey; })[0] : null;
    renderChip(c);
  }

  /* ===== 初期化 ===== */
  function init() {
    root = document.getElementById('pk-facewall');
    if (!root) return;
    elTitle = root.querySelector('.pk-facewall-title');
    elLead = root.querySelector('.pk-facewall-lead');
    elFaces = root.querySelector('.pk-faces');
    elChip = root.querySelector('.pk-facechip');

    renderLabels();
    renderFaces();
    if (elChip) elChip.hidden = true;

    // showcase 側から composer 解除の通知を受ける(API があれば)。
    var api = window.PKShowcase;
    if (api && typeof api.onComposerCleared === 'function') {
      api.onComposerCleared(clearSelection);
    } else {
      // フォールバック: ユーザーが検索欄を手で触ったら顔選択を解除。
      // (自分が dispatch した input は suppressClear で無視)
      document.addEventListener('input', function (e) {
        if (e.target && e.target.classList && e.target.classList.contains('pk-search-input')) {
          clearSelection();
        }
      }, true);
      // ピル/シーンのクリックでも顔選択を解除(検索欄に名前が残らないので体験を揃える)。
      document.addEventListener('click', function (e) {
        var el = e.target;
        while (el && el !== document) {
          if (el.classList && (el.classList.contains('pk-pill') || el.classList.contains('pk-scene'))) {
            clearSelection(); break;
          }
          el = el.parentNode;
        }
      }, true);
    }

    // 言語トグルと協調(showcase と同じ作法)。
    document.addEventListener('pk:lang', function (e) { if (e && e.detail) setLang(e.detail); });
    document.querySelectorAll('.langtoggle button[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
    var activeBtn = document.querySelector('.langtoggle button.active');
    if (activeBtn && activeBtn.dataset.lang) setLang(activeBtn.dataset.lang);
  }

  // 公開API(本体から呼べるよう最小限)
  window.PKFaceWall = { setLang: setLang, clearSelection: clearSelection, init: init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
