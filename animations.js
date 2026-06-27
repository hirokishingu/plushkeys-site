/* =====================================================================
 * Plush Keys LP — アニメーション制御 (IntersectionObserver)
 *  - セクション/カードのリビール (.pk-reveal → .pk-in)
 *  - ヒーロー証拠バーの数字カウントアップ (.pk-hero-stat[data-count])
 *  - ヒーロー hero-shot の初回フェードイン
 * showcase.js のショーケース統計カウントアップとは独立(あちらは自前で処理)。
 * prefers-reduced-motion で全停止(最終値即表示)。外部ライブラリなし。
 * ===================================================================== */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  // easeOutCubic count-up
  function countUp(el, target, dur) {
    if (reduce) { el.textContent = formatTarget(el, target); return; }
    var start = null;
    function step(ts) {
      if (start == null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = formatTarget(el, target);
    }
    requestAnimationFrame(step);
  }
  // data-suffix (例: ¥, +) を尊重。数値0以外は単純整数。
  function formatTarget(el, target) {
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    return pre + target + suf;
  }

  ready(function () {
    // ---- リビール ----
    // 既存セクションの繰り返し要素にも控えめなスクロールリビールを付与する。
    // ちらつき回避: ファーストビュー内(=既に見えている)要素には付けず、画面下の要素だけ
    // .pk-reveal(初期 opacity:0)を後付けして observe する。
    var reveals = [].slice.call(document.querySelectorAll('.pk-reveal'));
    if (!reduce && hasIO) {
      var vh = window.innerHeight || 800;
      var extra = document.querySelectorAll('.cards .card, .gallery figure, .composer-row figure, .faq details');
      [].forEach.call(extra, function (el) {
        if (el.classList.contains('pk-reveal')) return;
        if (el.getBoundingClientRect().top > vh * 0.92) { // 画面下端より十分下=まだ見えていない
          el.classList.add('pk-reveal');
          reveals.push(el);
        }
      });
    }
    if (reduce || !hasIO) {
      reveals.forEach(function (el) { el.classList.add('pk-in'); });
    } else {
      var ioR = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('pk-in'); ioR.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { ioR.observe(el); });
    }

    // ---- ヒーロー証拠バー数字カウントアップ ----
    var heroStats = [].slice.call(document.querySelectorAll('.pk-hero-stat[data-count]'));
    function fireHero(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var nEl = el.querySelector('.pk-stat-n') || el;
      if (isNaN(target)) { return; } // ¥0 等は data-count を付けず HTML 既定値のまま
      el.classList.add('pk-in');
      countUp(nEl, target, 1200);
    }
    if (reduce || !hasIO) {
      heroStats.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var nEl = el.querySelector('.pk-stat-n') || el;
        if (!isNaN(target)) nEl.textContent = formatTarget(nEl, target);
      });
    } else {
      var ioS = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { fireHero(e.target); ioS.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      heroStats.forEach(function (el) { ioS.observe(el); });
    }

    // ---- hero-shot 初回フェードイン ----
    var shot = document.querySelector('.lang-section.show .hero-shot') || document.querySelector('.hero-shot');
    if (shot && !reduce) {
      // 画像読込後 or 即時に1回
      requestAnimationFrame(function () { shot.classList.add('pk-shot-in'); });
    }
  });
})();
