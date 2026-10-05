/* =====================================================================
 * Plush Keys LP — 収録曲ショーケース (Song Finder)
 * データ駆動: 131曲を JS 配列で1回だけ埋め込み、言語(kanji/kana/en)は
 * ラベル辞書のみ切替。曲名は ja / en を出し分け(kanji と kana は同じ ja を共有)。
 *
 * 依存ライブラリなし。本体 index.html の言語トグル JS と協調する想定。
 *  - グローバル関数 window.PKShowcase.setLang('kanji'|'kana'|'en') を公開。
 *    本体の setLang() から呼ぶか、CustomEvent('pk:lang', {detail:lang}) を listen。
 *  - prefers-reduced-motion で stagger / count-up を無効化。
 * ===================================================================== */
(function () {
  'use strict';

  // ---- カタログ (AUTO-GENERATED from instrument-app Resources/Songs + SongLibrary.metadata, 2026-10-05 — ja 192曲 / en 175曲) ----
  // 短縮キー: id / ja(日本語名) / en(英語名) / cat / cj(作曲家ja) / ce(作曲家en) / r(その言語の版にだけある曲: 'ja' | 'en')
  var SONGS = [{"id":"double-eagle-march","ja":"双頭の鷲の旗の下に","en":"Under the Double Eagle","cat":"classical","cj":"J.F.ワーグナー","ce":"J.F. Wagner"},{"id":"clarinet-polka","ja":"クラリネット・ポルカ","en":"Clarinet Polka","cat":"classical"},{"id":"elgar-nimrod","ja":"ニムロッド","en":"Nimrod (Enigma Variations)","cat":"classical","cj":"エルガー","ce":"Elgar"},{"id":"pomp-and-circumstance","ja":"威風堂々","en":"Pomp and Circumstance","cat":"classical","cj":"エルガー","ce":"Elgar"},{"id":"salut-damour","ja":"愛のあいさつ","en":"Salut d'Amour","cat":"classical","cj":"エルガー","ce":"Elgar"},{"id":"cancan","ja":"カンカン","en":"Can-Can","cat":"classical","cj":"オッフェンバック","ce":"Offenbach"},{"id":"barcarolle-hoffmann","ja":"ホフマンの舟歌","en":"Barcarolle (Tales of Hoffmann)","cat":"classical","cj":"オッフェンバック","ce":"Offenbach"},{"id":"rhapsody-in-blue","ja":"ラプソディ・イン・ブルー","en":"Rhapsody in Blue","cat":"classical","cj":"ガーシュウィン","ce":"Gershwin"},{"id":"gounod-ave-maria","ja":"アヴェ・マリア（グノー）","en":"Ave Maria (Gounod)","cat":"classical","cj":"グノー","ce":"Gounod"},{"id":"grieg-piano-concerto","ja":"ピアノ協奏曲（グリーグ）","en":"Piano Concerto (Grieg)","cat":"classical","cj":"グリーグ","ce":"Grieg"},{"id":"mountain-king","ja":"山の魔王の宮殿にて","en":"In the Hall of the Mountain King","cat":"classical","cj":"グリーグ","ce":"Grieg"},{"id":"morning-mood","ja":"朝","en":"Morning Mood","cat":"classical","cj":"グリーグ","ce":"Grieg"},{"id":"satie-gymnopedie-1","ja":"ジムノペディ 第1番","en":"Gymnopédie No.1","cat":"classical","cj":"サティ","ce":"Satie"},{"id":"danse-macabre","ja":"死の舞踏","en":"Danse Macabre","cat":"classical","cj":"サン=サーンス","ce":"Saint-Saëns"},{"id":"saint-saens-aquarium","ja":"水族館","en":"Aquarium (Carnival of the Animals)","cat":"classical","cj":"サン=サーンス","ce":"Saint-Saëns"},{"id":"lion-march","ja":"獅子王の行進","en":"Royal March of the Lion","cat":"classical","cj":"サン=サーンス","ce":"Saint-Saëns"},{"id":"saint-saens-swan","ja":"白鳥","en":"The Swan","cat":"classical","cj":"サン=サーンス","ce":"Saint-Saëns"},{"id":"saint-saens-elephant","ja":"象 (サン=サーンス)","en":"The Elephant","cat":"classical","cj":"サン=サーンス","ce":"Saint-Saëns"},{"id":"tritsch-tratsch","ja":"トリッチ・トラッチ・ポルカ","en":"Tritsch-Tratsch-Polka","cat":"classical","cj":"シュトラウス","ce":"Strauss II"},{"id":"blue-danube","ja":"美しく青きドナウ","en":"The Blue Danube","cat":"classical","cj":"シュトラウス","ce":"Strauss II"},{"id":"thunder-lightning","ja":"雷鳴と稲妻","en":"Thunder and Lightning Polka","cat":"classical","cj":"シュトラウス","ce":"Strauss II"},{"id":"radetzky-march","ja":"ラデツキー行進曲","en":"Radetzky March","cat":"classical","cj":"シュトラウス1世","ce":"Strauss I"},{"id":"military-march","ja":"ぐんたいこうしんきょく","en":"Military March","cat":"classical","cj":"シューベルト","ce":"Schubert"},{"id":"schubert-trout","ja":"ます","en":"The Trout (Schubert)","cat":"classical","cj":"シューベルト","ce":"Schubert"},{"id":"ave-maria-schubert","ja":"アヴェ・マリア","en":"Ave Maria (Schubert)","cat":"classical","cj":"シューベルト","ce":"Schubert"},{"id":"lullaby-schubert","ja":"シューベルトの子守唄","en":"Schubert's Lullaby","cat":"classical","cj":"シューベルト","ce":"Schubert"},{"id":"schubert-moments-musicaux-3","ja":"モーメント・ミュージカル","en":"Moments Musicaux No.3","cat":"classical","cj":"シューベルト","ce":"Schubert"},{"id":"schumann-fremden-landern","ja":"みしらぬくに","en":"Von fremden Ländern","cat":"classical","cj":"シューマン","ce":"Schumann"},{"id":"schumann-traumerei","ja":"トロイメライ","en":"Träumerei","cat":"classical","cj":"シューマン","ce":"Schumann"},{"id":"chopin-nocturne-20","ja":"ノクターン 嬰ハ短調（遺作）","en":"Nocturne in C-sharp minor (Posth.)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-nocturne-9-2","ja":"ノクターン第2番 変ホ長調","en":"Nocturne Op.9 No.2","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-ballade-1","ja":"バラード第1番","en":"Ballade No.1","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-mazurka-7-1","ja":"マズルカ 変ロ長調","en":"Mazurka in B-flat (Op.7-1)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-waltz-a-minor","ja":"ワルツ イ短調（遺作）","en":"Waltz in A minor (Posth.)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-waltz-69-1","ja":"別れのワルツ","en":"Waltz in A-flat (Op.69-1, L'Adieu)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-tristesse","ja":"別れの曲","en":"Tristesse (Étude Op.10 No.3)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-prelude-a-major","ja":"前奏曲 イ長調","en":"Prelude in A major (Op.28-7)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-prelude-c-minor","ja":"前奏曲 ハ短調","en":"Prelude in C minor (Op.28-20)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-prelude-e-minor","ja":"前奏曲 ホ短調","en":"Prelude in E minor (Op.28 No.4)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-minute-waltz","ja":"子犬のワルツ","en":"Minute Waltz (Op.64 No.1)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-heroic-polonaise","ja":"英雄ポロネーズ","en":"Heroic Polonaise (Chopin Op.53)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-grande-valse","ja":"華麗なる大円舞曲","en":"Grande Valse Brillante (Op.18)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-funeral-march","ja":"葬送行進曲","en":"Funeral March (Sonata Op.35)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"chopin-raindrop","ja":"雨だれの前奏曲","en":"Raindrop Prelude (Op.28-15)","cat":"classical","cj":"ショパン","ce":"Chopin"},{"id":"joplin-entertainer","ja":"エンターテイナー","en":"The Entertainer","cat":"classical","cj":"ジョプリン","ce":"Joplin"},{"id":"stars-and-stripes","ja":"星条旗よ永遠なれ","en":"Stars and Stripes Forever","cat":"classical","cj":"スーザ","ce":"Sousa"},{"id":"tchaikovsky-1812","ja":"1812年序曲","en":"1812 Overture (Finale)","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"tchaikovsky-morning-prayer","ja":"あさのおいのり","en":"Morning Prayer","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"sugar-plum-fairy","ja":"こんぺい糖の踊り","en":"Dance of the Sugar Plum Fairy","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"tchaikovsky-old-french-song","ja":"ふるい フランスの うた","en":"Old French Song","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"nutcracker-arabian","ja":"アラビアの踊り (くるみ割り人形)","en":"Arabian Dance (Nutcracker)","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"trepak","ja":"トレパック (ロシアの踊り)","en":"Trepak (Russian Dance)","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"tchaikovsky-piano-concerto-1","ja":"ピアノ協奏曲第1番","en":"Piano Concerto No.1 (opening theme)","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"swan-lake","ja":"白鳥の湖","en":"Swan Lake","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"waltz-of-the-flowers","ja":"花のワルツ","en":"Waltz of the Flowers","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"nutcracker-march","ja":"行進曲 (くるみ割り人形)","en":"March (Nutcracker)","cat":"classical","cj":"チャイコフスキー","ce":"Tchaikovsky"},{"id":"debussy-arabesque-1","ja":"アラベスク 第1番","en":"Arabesque No.1","cat":"classical","cj":"ドビュッシー","ce":"Debussy"},{"id":"debussy-arabesque-2","ja":"アラベスク 第2番","en":"Arabesque No.2","cat":"classical","cj":"ドビュッシー","ce":"Debussy"},{"id":"debussy-fille-aux-cheveux","ja":"亜麻色の髪の乙女","en":"The Girl with the Flaxen Hair","cat":"classical","cj":"ドビュッシー","ce":"Debussy"},{"id":"debussy-reverie","ja":"夢","en":"Rêverie","cat":"classical","cj":"ドビュッシー","ce":"Debussy"},{"id":"clair-de-lune","ja":"月の光","en":"Clair de Lune","cat":"classical","cj":"ドビュッシー","ce":"Debussy"},{"id":"sylvia-pizzicato","ja":"シルヴィアのピチカート","en":"Pizzicato (Sylvia)","cat":"classical","cj":"ドリーブ","ce":"Delibes"},{"id":"humoresque","ja":"ユーモレスク","en":"Humoresque","cat":"classical","cj":"ドヴォルザーク","ce":"Dvořák"},{"id":"going-home","ja":"家路","en":"Going Home (Largo, New World)","cat":"classical","cj":"ドヴォルザーク","ce":"Dvořák"},{"id":"csikos-post","ja":"クシコス・ポスト","en":"Csikos Post","cat":"classical","cj":"ネッケ","ce":"Necke"},{"id":"surprise-symphony","ja":"驚愕交響曲","en":"Surprise Symphony","cat":"classical","cj":"ハイドン","ce":"Haydn"},{"id":"maidens-prayer","ja":"乙女の祈り","en":"The Maiden's Prayer","cat":"classical","cj":"バダジェフスカ","ce":"Badarzewska"},{"id":"air-on-g","ja":"G線上のアリア","en":"Air on the G String (Bach)","cat":"classical","cj":"バッハ","ce":"Bach"},{"id":"bach-toccata-fugue","ja":"トッカータとフーガ","en":"Toccata and Fugue","cat":"classical","cj":"バッハ","ce":"Bach"},{"id":"bach-prelude-c","ja":"バッハ プレリュード ハ長調","en":"Bach: Prelude in C (BWV 846)","cat":"classical","cj":"バッハ","ce":"Bach"},{"id":"bach-badinerie","ja":"バディネリ","en":"Badinerie (Bach)","cat":"classical","cj":"バッハ","ce":"Bach"},{"id":"minuet-bach","ja":"メヌエット","en":"Minuet in G","cat":"classical","cj":"バッハ","ce":"Bach"},{"id":"jesu-joy","ja":"主よ人の望みの喜びよ","en":"Jesu, Joy of Man's Desiring","cat":"classical","cj":"バッハ","ce":"Bach"},{"id":"pachelbel-canon","ja":"カノン","en":"Pachelbel: Canon in C","cat":"classical","cj":"パッヘルベル","ce":"Pachelbel"},{"id":"habanera","ja":"ハバネラ","en":"Habanera (Carmen)","cat":"classical","cj":"ビゼー","ce":"Bizet"},{"id":"bizet-toreador","ja":"闘牛士の歌","en":"Toreador Song (Carmen)","cat":"classical","cj":"ビゼー","ce":"Bizet"},{"id":"entry-of-gladiators","ja":"剣闘士の入場","en":"Entry of the Gladiators","cat":"classical","cj":"フチーク","ce":"Fučík"},{"id":"hungarian-dance-5","ja":"ハンガリー舞曲第5番","en":"Hungarian Dance No.5","cat":"classical","cj":"ブラームス","ce":"Brahms"},{"id":"brahms-intermezzo-118-2","ja":"ブラームスのインテルメッツォ","en":"Intermezzo Op.118 No.2","cat":"classical","cj":"ブラームス","ce":"Brahms"},{"id":"brahms-waltz-op39-15","ja":"ブラームスのワルツ","en":"Brahms Waltz Op.39 No.15","cat":"classical","cj":"ブラームス","ce":"Brahms"},{"id":"lullaby-brahms","ja":"ブラームスの子守唄","en":"Brahms' Lullaby","cat":"classical","cj":"ブラームス","ce":"Brahms"},{"id":"brahms-symphony-1","ja":"交響曲第1番","en":"Symphony No.1 Finale","cat":"classical","cj":"ブラームス","ce":"Brahms"},{"id":"handel-largo","ja":"オンブラ・マイ・フ","en":"Largo (Ombra mai fu)","cat":"classical","cj":"ヘンデル","ce":"Handel"},{"id":"water-music-hornpipe","ja":"水上の音楽 (ホーンパイプ)","en":"Water Music: Hornpipe (Handel)","cat":"classical","cj":"ヘンデル","ce":"Handel"},{"id":"see-conquering-hero","ja":"見よ勇者は帰る","en":"See, the Conquering Hero Comes","cat":"classical","cj":"ヘンデル","ce":"Handel"},{"id":"fur-elise-short","ja":"エリーゼのために","en":"Für Elise","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"beethoven-spring-sonata","ja":"ヴァイオリンソナタ 春","en":"Spring Sonata (Violin Sonata 5)","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"beethoven-symphony-7","ja":"交響曲第7番（第1楽章）","en":"Symphony No.7 (mvt I theme)","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"pathetique-2nd","ja":"悲愴","en":"Pathétique Sonata II","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"moonlight-1","ja":"月光ソナタ 第1楽章","en":"Moonlight Sonata I","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"beethoven-emperor","ja":"皇帝（ピアノ協奏曲第5番 第1楽章）","en":"Emperor Concerto (mvt I main theme)","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"ode-to-joy","ja":"第九","en":"Ode to Joy (Symphony No. 9)","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"beethoven-eroica","ja":"英雄","en":"Eroica (Symphony No.3)","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"beethoven-fate","ja":"運命","en":"Symphony No. 5 (Fate)","cat":"classical","cj":"ベートーヴェン","ce":"Beethoven"},{"id":"jupiter","ja":"木星","en":"Jupiter","cat":"classical","cj":"ホルスト","ce":"Holst"},{"id":"boccherini-minuet","ja":"メヌエット (ボッケリーニ)","en":"Boccherini Minuet","cat":"classical","cj":"ボッケリーニ","ce":"Boccherini"},{"id":"mussorgsky-great-gate","ja":"キエフの大門","en":"The Great Gate of Kiev","cat":"classical","cj":"ムソルグスキー","ce":"Mussorgsky"},{"id":"mussorgsky-promenade","ja":"プロムナード","en":"Promenade (Pictures at an Exhibition)","cat":"classical","cj":"ムソルグスキー","ce":"Mussorgsky"},{"id":"wedding-march","ja":"けっこんこうしんきょく","en":"Wedding March","cat":"classical","cj":"メンデルスゾーン","ce":"Mendelssohn"},{"id":"mendelssohn-spring-song","ja":"春の歌","en":"Spring Song (Op. 62 No. 6)","cat":"classical","cj":"メンデルスゾーン","ce":"Mendelssohn"},{"id":"mozart-k448","ja":"2台のピアノのためのソナタ K.448","en":"Sonata for Two Pianos, K.448 (theme)","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"figaro-overture","ja":"「フィガロの結婚」序曲","en":"The Marriage of Figaro: Overture","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"eine-kleine","ja":"アイネ・クライネ・ナハトムジーク","en":"Eine kleine Nachtmusik","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"mozart-oboe-concerto","ja":"オーボエ協奏曲","en":"Oboe Concerto K.314","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"turkish-march","ja":"トルコこうしんきょく","en":"Turkish March","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"mozart-horn-concerto-4","ja":"ホルン協奏曲第4番","en":"Horn Concerto No. 4 (Mozart)","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"mozart-k545","ja":"モーツァルト ソナタ ハ長調","en":"Mozart: Sonata in C (K.545)","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"mozart-symphony-25","ja":"交響曲第25番","en":"Symphony No. 25 (Mozart)","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"mozart-symphony-40","ja":"交響曲第40番","en":"Symphony No. 40 (Mozart)","cat":"classical","cj":"モーツァルト","ce":"Mozart"},{"id":"rachmaninoff-concerto-2","ja":"ピアノ協奏曲第2番","en":"Piano Concerto No.2 (theme)","cat":"classical","cj":"ラフマニノフ","ce":"Rachmaninoff"},{"id":"bolero","ja":"ボレロ","en":"Boléro (Ravel)","cat":"classical","cj":"ラヴェル","ce":"Ravel"},{"id":"ravel-pavane","ja":"亡き王女のためのパヴァーヌ","en":"Pavane (Ravel)","cat":"classical","cj":"ラヴェル","ce":"Ravel"},{"id":"liszt-la-campanella","ja":"ラ・カンパネラ","en":"La Campanella (Liszt)","cat":"classical","cj":"リスト","ce":"Liszt"},{"id":"liszt-liebestraum-3","ja":"愛の夢 第3番","en":"Liebestraum No. 3","cat":"classical","cj":"リスト","ce":"Liszt"},{"id":"flight-of-bumblebee","ja":"熊蜂の飛行","en":"Flight of the Bumblebee","cat":"classical","cj":"リムスキー＝コルサコフ","ce":"Rimsky-Korsakov"},{"id":"william-tell","ja":"ウィリアム・テル","en":"William Tell Overture (Finale)","cat":"classical","cj":"ロッシーニ","ce":"Rossini"},{"id":"rossini-barber-seville","ja":"セビリアの理髪師","en":"The Barber of Seville (Overture)","cat":"classical","cj":"ロッシーニ","ce":"Rossini"},{"id":"skaters-waltz","ja":"スケーターズ・ワルツ","en":"The Skaters' Waltz","cat":"classical","cj":"ワルトトイフェル","ce":"Waldteufel"},{"id":"ride-of-valkyries","ja":"ワルキューレの騎行","en":"Ride of the Valkyries (Wagner)","cat":"classical","cj":"ワーグナー","ce":"Wagner"},{"id":"bridal-chorus","ja":"婚礼の合唱","en":"Bridal Chorus (Here Comes the Bride)","cat":"classical","cj":"ワーグナー","ce":"Wagner"},{"id":"vivaldi-winter","ja":"冬（四季）","en":"Winter (The Four Seasons)","cat":"classical","cj":"ヴィヴァルディ","ce":"Vivaldi"},{"id":"vivaldi-spring","ja":"春","en":"Spring (Vivaldi, Four Seasons)","cat":"classical","cj":"ヴィヴァルディ","ce":"Vivaldi"},{"id":"aida-triumphal-march","ja":"アイーダ凱旋行進曲","en":"Triumphal March (Aida)","cat":"classical","cj":"ヴェルディ","ce":"Verdi"},{"id":"la-donna-e-mobile","ja":"女心の歌","en":"La donna è mobile","cat":"classical","cj":"ヴェルディ","ce":"Verdi"},{"id":"amazing-grace","ja":"アメイジング・グレイス","en":"Amazing Grace","cat":"classical","cj":"賛美歌","ce":"Hymn"},{"id":"usagi-to-kame","ja":"うさぎとかめ","en":"The Tortoise and the Hare","cat":"nursery","r":"ja"},{"id":"lullaby-edo","ja":"えどこもりうた","en":"Edo Lullaby","cat":"nursery","r":"ja"},{"id":"kaeru-no-uta","ja":"かえるのうた","en":"Frog Song","cat":"nursery","r":"ja"},{"id":"kirakira-boshi","ja":"きらきらぼし","en":"Twinkle Twinkle Little Star","cat":"nursery"},{"id":"koinobori","ja":"こいのぼり（いらかの波）","en":"Koinobori","cat":"nursery","r":"ja"},{"id":"sakura-sakura","ja":"さくらさくら","en":"Sakura Sakura","cat":"nursery"},{"id":"chocho","ja":"ちょうちょう","en":"Lightly Row","cat":"nursery"},{"id":"musunde-hiraite","ja":"むすんでひらいて","en":"Go Tell Aunt Rhody","cat":"nursery"},{"id":"momotaro","ja":"ももたろう","en":"Momotaro","cat":"nursery","r":"ja"},{"id":"lullaby-yurikago","ja":"ゆりかごのうた","en":"Cradle Song","cat":"nursery","r":"ja"},{"id":"yozora-no-uta","ja":"よぞらのうた","en":"Song of the Night Sky","cat":"nursery","r":"ja"},{"id":"nanatsu-no-ko","ja":"七つの子","en":"Nanatsu no Ko","cat":"nursery","r":"ja"},{"id":"aogeba-totoshi","ja":"仰げば尊し","en":"Aogeba Totoshi","cat":"nursery","r":"ja"},{"id":"kisha","ja":"汽車ポッポ","en":"Kisha Poppo (Train)","cat":"nursery","r":"ja"},{"id":"chatsumi","ja":"茶摘み","en":"Chatsumi","cat":"nursery","r":"ja"},{"id":"yuki","ja":"雪","en":"Yuki","cat":"nursery","r":"ja"},{"id":"oboro-zukiyo","ja":"おぼろ月夜","en":"Oboro Zukiyo (Hazy Moon)","cat":"nursery","cj":"岡野貞一","ce":"Teiichi Okano","r":"ja"},{"id":"haru-no-ogawa","ja":"はるのおがわ","en":"The Spring Stream","cat":"nursery","cj":"岡野貞一","ce":"Teiichi Okano","r":"ja"},{"id":"furusato","ja":"ふるさと","en":"Hometown","cat":"nursery","cj":"岡野貞一","ce":"Teiichi Okano","r":"ja"},{"id":"momiji","ja":"もみじ","en":"Autumn Leaves","cat":"nursery","cj":"岡野貞一","ce":"Teiichi Okano","r":"ja"},{"id":"haru-ga-kita","ja":"春が来た","en":"Haru ga Kita (Spring Has Come)","cat":"nursery","cj":"岡野貞一","ce":"Teiichi Okano","r":"ja"},{"id":"kojo-no-tsuki","ja":"荒城の月","en":"Kojo no Tsuki","cat":"nursery","cj":"瀧廉太郎","ce":"Rentaro Taki","r":"ja"},{"id":"clementine","ja":"いとしのクレメンタイン","en":"Oh My Darling, Clementine","cat":"foreign"},{"id":"michael-row-the-boat","ja":"こげよマイケル","en":"Michael, Row the Boat Ashore","cat":"foreign"},{"id":"itsy-bitsy-spider","ja":"ちっちゃなクモさん","en":"The Itsy Bitsy Spider","cat":"foreign"},{"id":"battle-hymn-republic","ja":"ともだち讃歌","en":"Battle Hymn of the Republic","cat":"foreign"},{"id":"neko-funjatta","ja":"ねこふんじゃった","en":"The Flea Waltz","cat":"foreign"},{"id":"pop-goes-the-weasel","ja":"ぽん！といたち","en":"Pop Goes the Weasel","cat":"foreign"},{"id":"baa-baa-black-sheep","ja":"めえめえくろひつじ","en":"Baa, Baa, Black Sheep","cat":"foreign"},{"id":"coming-round-the-mountain","ja":"やまをこえてやってくる","en":"She'll Be Coming 'Round the Mountain","cat":"foreign"},{"id":"old-macdonald","ja":"ゆかいな牧場","en":"Old MacDonald Had a Farm","cat":"foreign"},{"id":"america-the-beautiful","ja":"アメリカ・ザ・ビューティフル","en":"America the Beautiful","cat":"foreign","r":"en"},{"id":"yankee-doodle","ja":"アルプス一万尺","en":"Yankee Doodle","cat":"foreign"},{"id":"greensleeves","ja":"グリーンスリーブス","en":"Greensleeves","cat":"foreign"},{"id":"skip-to-my-lou","ja":"スキップ・トゥ・マイ・ルー","en":"Skip to My Lou","cat":"foreign"},{"id":"danny-boy","ja":"ダニーボーイ（ロンドンデリーの歌）","en":"Danny Boy (Londonderry Air)","cat":"foreign"},{"id":"this-old-man","ja":"ディス・オールド・マン","en":"This Old Man","cat":"foreign"},{"id":"hickory-dickory-dock","ja":"ヒッコリー・ディッコリー・ドック","en":"Hickory Dickory Dock","cat":"foreign"},{"id":"bingo","ja":"ビンゴ","en":"Bingo","cat":"foreign"},{"id":"frere-jacques","ja":"フレール・ジャック","en":"Frère Jacques","cat":"foreign"},{"id":"hot-cross-buns","ja":"ホットクロスバンズ","en":"Hot Cross Buns","cat":"foreign"},{"id":"row-your-boat","ja":"ボートをこげよ","en":"Row Row Row Your Boat","cat":"foreign"},{"id":"my-bonnie","ja":"マイ・ボニー","en":"My Bonnie","cat":"foreign"},{"id":"mary-had-a-little-lamb","ja":"メリーさんのひつじ","en":"Mary Had a Little Lamb","cat":"foreign"},{"id":"london-bridge","ja":"ロンドン橋","en":"London Bridge","cat":"foreign"},{"id":"grandfather-clock","ja":"大きな古時計","en":"My Grandfather's Clock","cat":"foreign"},{"id":"home-on-the-range","ja":"峠の我が家","en":"Home on the Range","cat":"foreign"},{"id":"last-rose-of-summer","ja":"庭の千草","en":"The Last Rose of Summer","cat":"foreign"},{"id":"railroad-song","ja":"線路は続くよどこまでも","en":"I've Been Working on the Railroad","cat":"foreign"},{"id":"when-the-saints","ja":"聖者の行進","en":"When the Saints Go Marching In","cat":"foreign"},{"id":"auld-lang-syne","ja":"蛍の光","en":"Auld Lang Syne","cat":"foreign"},{"id":"little-brown-jug","ja":"茶色の小瓶","en":"Little Brown Jug","cat":"foreign","cj":"ウィナー","ce":"Winner"},{"id":"santa-lucia","ja":"サンタ・ルチア","en":"Santa Lucia","cat":"foreign","cj":"コットラウ","ce":"Cottrau"},{"id":"home-sweet-home","ja":"埴生の宿","en":"Home! Sweet Home!","cat":"foreign","cj":"ビショップ","ce":"Bishop"},{"id":"oh-susanna","ja":"オー・スザンナ","en":"Oh! Susanna","cat":"foreign","cj":"フォスター","ce":"Foster"},{"id":"camptown-races","ja":"草競馬","en":"Camptown Races","cat":"foreign","cj":"フォスター","ce":"Foster"},{"id":"long-long-ago","ja":"久しき昔","en":"Long, Long Ago","cat":"foreign","cj":"ベイリー","ce":"Bayly"},{"id":"aura-lee","ja":"オーラ・リー","en":"Aura Lee","cat":"foreign","cj":"ポールトン","ce":"Poulton"},{"id":"we-wish-merry-christmas","ja":"おめでとうクリスマス","en":"We Wish You a Merry Christmas","cat":"christmas"},{"id":"silent-night","ja":"きよしこのよる","en":"Silent Night","cat":"christmas"},{"id":"deck-the-halls","ja":"ひいらぎ飾ろう","en":"Deck the Halls","cat":"christmas"},{"id":"o-tannenbaum","ja":"もみの木","en":"O Christmas Tree","cat":"christmas"},{"id":"jingle-bells","ja":"ジングルベル","en":"Jingle Bells","cat":"christmas"},{"id":"hark-the-herald","ja":"天には栄え","en":"Hark! The Herald Angels Sing","cat":"christmas"},{"id":"first-noel","ja":"牧人ひつじを","en":"The First Noel","cat":"christmas"},{"id":"adeste-fideles","ja":"神の御子は今宵しも","en":"O Come, All Ye Faithful","cat":"christmas"},{"id":"joy-to-the-world","ja":"もろびとこぞりて","en":"Joy to the World","cat":"christmas","cj":"賛美歌","ce":"Hymn"},{"id":"happy-birthday","ja":"ハッピーバースデー","en":"Happy Birthday","cat":"anniversary"}];

  // ---- カテゴリ定義 (色と3言語ラベル) ----
  // 色は既存 CSS 変数のトーンに合わせる: classical=sky / nursery=green / foreign=pink / christmas=accent / anniversary=yellow
  var CATS = [
    { key: 'all',         color: '' },
    { key: 'classical',   color: 'sky' },
    { key: 'nursery',     color: 'green' },
    { key: 'foreign',     color: 'pink' },
    { key: 'christmas',   color: 'accent' },
    { key: 'anniversary', color: 'yellow' }
  ];

  // ---- シーン(イベント)別おすすめ: 曲 id を直接束ねる(カタログから抽出済) ----
  var SCENES = [
    { key: 'wedding',    ids: ['pachelbel-canon', 'air-on-g', 'salut-damour', 'gounod-ave-maria', 'ave-maria-schubert', 'bridal-chorus'] },
    { key: 'halloween',  ids: ['danse-macabre', 'bach-toccata-fugue', 'mountain-king'] },
    { key: 'graduation', ids: ['auld-lang-syne', 'pomp-and-circumstance', 'going-home'] },
    { key: 'yearend',    ids: ['ode-to-joy'] },
    { key: 'recital',    ids: ['maidens-prayer', 'fur-elise-short', 'turkish-march'] },
    { key: 'christmas',  ids: ['silent-night', 'jingle-bells', 'joy-to-the-world', 'we-wish-merry-christmas', 'deck-the-halls'] }
  ];

  // ---- 3言語ラベル辞書 (UI文言のみ。曲名/作曲家名はカタログから) ----
  var L = {
    kanji: {
      heading: '知ってる曲が、きっとある',
      lead: '童謡からショパン・チャイコフスキーまで、ぜんぶで {n} 曲。さがしてみよう。',
      statSongs: '曲', statClassical: 'クラシック', statComposers: '人の作曲家', statFree: 'ではじめる',
      sceneTitle: 'こんな日に、この曲',
      scenes: { wedding: '結婚式', halloween: 'ハロウィン', graduation: '卒業・入学', yearend: '年末', recital: '発表会', christmas: 'クリスマス' },
      searchLabel: 'すきな曲をさがす',
      searchPlaceholder: '曲名や作曲家でさがす（例：カノン、ショパン）',
      cats: { all: 'ぜんぶ', classical: 'クラシック', nursery: 'どうよう', foreign: 'がいこく', christmas: 'クリスマス', anniversary: 'おいわい' },
      count: '{n} 曲',
      more: 'もっと見る（あと {n} 曲）',
      empty: 'その曲はまだないけれど、ほかに {n} 曲あそべるよ。',
      emptyCta: 'ダウンロードして、ぜんぶ見る',
      finderCta: 'この {n} 曲、ぜんぶ無料ではじめる',
      clear: 'すべて表示'
    },
    kana: {
      heading: 'しってる うたが、きっと ある',
      lead: 'どうようから ショパン・チャイコフスキーまで、ぜんぶで {n} きょく。さがしてみよう。',
      statSongs: 'きょく', statClassical: 'クラシック', statComposers: 'にんの さっきょくか', statFree: 'で はじめる',
      sceneTitle: 'こんな ひに、この きょく',
      scenes: { wedding: 'けっこんしき', halloween: 'ハロウィン', graduation: 'そつぎょう・にゅうがく', yearend: 'ねんまつ', recital: 'はっぴょうかい', christmas: 'クリスマス' },
      searchLabel: 'すきな きょくを さがす',
      searchPlaceholder: 'きょくめいや さっきょくかで さがす（れい：カノン、ショパン）',
      cats: { all: 'ぜんぶ', classical: 'クラシック', nursery: 'どうよう', foreign: 'がいこく', christmas: 'クリスマス', anniversary: 'おいわい' },
      count: '{n} きょく',
      more: 'もっと みる（あと {n} きょく）',
      empty: 'その きょくは まだ ないけれど、ほかに {n} きょく あそべるよ。',
      emptyCta: 'ダウンロードして、ぜんぶ みる',
      finderCta: 'この {n} きょく、ぜんぶ むりょうで はじめる',
      clear: 'ぜんぶ ひょうじ'
    },
    en: {
      heading: 'Songs they already know and love',
      lead: 'From nursery tunes to Chopin and Tchaikovsky — {n} songs in all. Find yours.',
      statSongs: 'songs', statClassical: 'classics', statComposers: 'composers', statFree: 'to start',
      sceneTitle: 'The right song for the day',
      scenes: { wedding: 'Wedding', halloween: 'Halloween', graduation: 'Graduation', yearend: "New Year's", recital: 'Recital', christmas: 'Christmas' },
      searchLabel: 'Find a song',
      searchPlaceholder: 'Search by title or composer (e.g. Canon, Chopin)',
      cats: { all: 'All', classical: 'Classical', nursery: 'Nursery', foreign: 'Folk', christmas: 'Christmas', anniversary: 'Celebration' },
      count: '{n} songs',
      more: 'Show more ({n} left)',
      empty: "That one isn't in yet — but {n} other songs are ready to play.",
      emptyCta: 'Download and see them all',
      finderCta: 'Get all {n} songs free',
      clear: 'Show all'
    }
  };

  // 言語別: 曲名を返す (kanji と kana は ja を共有 / en は en)
  function songName(s, lang) { return lang === 'en' ? s.en : s.ja; }
  function composerName(s, lang) { return lang === 'en' ? (s.ce || '') : (s.cj || ''); }

  // 検索用の正規化キー (全言語を連結し小文字化)。各曲に1度だけ計算してキャッシュ。
  function searchKey(s) {
    if (s._k) return s._k;
    s._k = [s.id, s.ja, s.en, s.cj || '', s.ce || ''].join(' ').toLowerCase();
    return s._k;
  }

  // ---- 状態 ----
  var lang = 'kanji';
  var activeCat = 'all';
  var query = '';
  var activeScene = null;      // scene key or null
  var activeComposer = null;   // 該当作曲家の cj 配列 or null (フェイスウォール用)
  var composerClearedCbs = []; // composer 解除時に呼ぶコールバック
  var shown = 0;               // 現在描画している件数
  var PAGE = 40;               // 初期/追加描画件数
  var reduce = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // 表示中の言語の版で弾ける曲 (日本語版だけ・英語版だけの曲がある)。件数は言語を変えるたびに数え直す。
  function pool() {
    var mine = lang === 'en' ? 'en' : 'ja';
    return SONGS.filter(function (s) { return !s.r || s.r === mine; });
  }
  var CAT_COUNT = {}, TOTAL = 0, CLASSICAL = 0, COMPOSERS = 0;
  function recount() {
    var list = pool();
    CATS.forEach(function (c) {
      CAT_COUNT[c.key] = (c.key === 'all') ? list.length : list.filter(function (s) { return s.cat === c.key; }).length;
    });
    TOTAL = list.length;
    CLASSICAL = CAT_COUNT.classical;
    // 「賛美歌」は人の名前ではないので作曲家の人数に数えない
    COMPOSERS = (function () { var set = {}; list.forEach(function (s) { if (s.cj && s.cj !== '賛美歌') set[s.cj] = 1; }); return Object.keys(set).length; })();
  }
  recount();

  // ---- DOM refs (init で取得) ----
  var root, elLead, elSearch, elPills, elGrid, elCount, elMore, elEmpty, elScenes, elFinderCta, statEls;

  function t(key) { return (L[lang] && L[lang][key]) || (L.kanji[key] || ''); }
  function fmt(str, n) { return String(str).replace('{n}', n); }

  // 現在のフィルタ条件にマッチする曲リスト
  function filtered() {
    var q = query.trim().toLowerCase();
    var sceneIds = null;
    if (activeScene) {
      var sc = SCENES.filter(function (x) { return x.key === activeScene; })[0];
      if (sc) sceneIds = sc.ids;
    }
    return pool().filter(function (s) {
      if (activeComposer) { if (activeComposer.indexOf(s.cj) === -1) return false; }
      if (sceneIds) { if (sceneIds.indexOf(s.id) === -1) return false; }
      else {
        if (activeCat !== 'all' && s.cat !== activeCat) return false;
        if (q && searchKey(s).indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function catColor(cat) {
    var c = CATS.filter(function (x) { return x.key === cat; })[0];
    return c ? c.color : '';
  }

  // チップ1個を生成
  function chipEl(s, idx) {
    var li = document.createElement('li');
    li.className = 'pk-songchip pk-cat-' + catColor(s.cat);
    if (!reduce) { li.style.setProperty('--i', Math.min(idx, 20)); li.classList.add('pk-stagger'); }
    var dot = document.createElement('span');
    dot.className = 'pk-dot';
    dot.setAttribute('aria-hidden', 'true');
    var name = document.createElement('span');
    name.className = 'pk-songname';
    name.textContent = songName(s, lang);
    li.appendChild(dot);
    li.appendChild(name);
    var comp = composerName(s, lang);
    if (comp) {
      var c = document.createElement('span');
      c.className = 'pk-composer';
      c.textContent = comp;
      li.appendChild(c);
    }
    return li;
  }

  // グリッドを描画 (reset=true で全消し→先頭から / false で続きを追記)
  function renderGrid(reset) {
    var list = filtered();
    var total = list.length;

    if (reset) { elGrid.textContent = ''; shown = 0; }

    // 空状態
    if (total === 0) {
      elGrid.hidden = true;
      elMore.hidden = true;
      elEmpty.hidden = false;
      elEmpty.querySelector('.pk-empty-text').textContent = fmt(t('empty'), TOTAL);
      elEmpty.querySelector('.pk-empty-cta').textContent = t('emptyCta');
      elCount.textContent = fmt(t('count'), 0);
      return;
    }
    elGrid.hidden = false;
    elEmpty.hidden = true;

    var end = Math.min(shown + PAGE, total);
    var frag = document.createDocumentFragment();
    for (var i = shown; i < end; i++) frag.appendChild(chipEl(list[i], i - shown));
    elGrid.appendChild(frag);
    shown = end;

    // 件数・もっと見る
    elCount.textContent = fmt(t('count'), total);
    if (shown < total) {
      elMore.hidden = false;
      elMore.textContent = fmt(t('more'), total - shown);
    } else {
      elMore.hidden = true;
    }

    // ファインダー末尾CTA文言 (現在の表示曲数でなく総数を訴求)
    if (elFinderCta) elFinderCta.querySelector('.pk-finder-cta-text').textContent = fmt(t('finderCta'), TOTAL);
  }

  // フィルタ条件が変わったら先頭から描き直す + aria-live で件数読み上げ
  function refilter() { renderGrid(true); }

  // ---- ラベル類を現在言語で再描画 ----
  function renderLabels() {
    var d = L[lang];
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key === 'lead') el.textContent = fmt(d.lead, TOTAL);
      else if (d[key] != null) el.textContent = d[key];
    });
    // 統計カードの単位ラベル
    if (statEls) {
      statEls.songs.textContent = d.statSongs;
      statEls.classical.textContent = d.statClassical;
      statEls.composers.textContent = d.statComposers;
      statEls.free.textContent = d.statFree;
    }
    // カテゴリピル
    elPills.querySelectorAll('.pk-pill').forEach(function (btn) {
      var k = btn.getAttribute('data-cat');
      btn.querySelector('.pk-pill-label').textContent = d.cats[k];
      btn.querySelector('.pk-pill-count').textContent = CAT_COUNT[k];
    });
    // シーンボタン
    elScenes.querySelectorAll('.pk-scene').forEach(function (btn) {
      var k = btn.getAttribute('data-scene');
      btn.querySelector('.pk-scene-label').textContent = d.scenes[k];
    });
    // 検索
    elSearch.setAttribute('aria-label', d.searchLabel);
    elSearch.setAttribute('placeholder', d.searchPlaceholder);
    // クリア
    var clearBtn = root.querySelector('.pk-clear');
    if (clearBtn) clearBtn.textContent = d.clear;
  }

  // ---- カウントアップ (証拠バーの数字。reduced-motion は最終値即表示) ----
  function countUp(el, target) {
    if (reduce) { el.textContent = target; return; }
    var dur = 1200, start = null;
    function step(ts) {
      if (start == null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    if (!('IntersectionObserver' in window) || reduce) {
      statEls.nSongs.textContent = TOTAL;
      statEls.nClassical.textContent = CLASSICAL;
      statEls.nComposers.textContent = COMPOSERS;
      statEls.nFree.textContent = '¥0';
      return;
    }
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !done) {
          done = true;
          countUp(statEls.nSongs, TOTAL);
          countUp(statEls.nClassical, CLASSICAL);
          countUp(statEls.nComposers, COMPOSERS);
          statEls.nFree.textContent = '¥0';
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(statEls.nSongs);
  }

  // ---- composer(フェイスウォール) 解除ヘルパ ----
  function clearComposer() {
    if (activeComposer == null) return;
    activeComposer = null;
    composerClearedCbs.forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  // ---- ピル/シーンの active 状態切替 ----
  function setActiveCat(cat) {
    clearComposer();
    activeCat = cat; activeScene = null; query = elSearch.value;
    elPills.querySelectorAll('.pk-pill').forEach(function (b) {
      var on = b.getAttribute('data-cat') === cat;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    elScenes.querySelectorAll('.pk-scene').forEach(function (b) {
      b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false');
    });
    refilter();
  }
  function setActiveScene(scene) {
    clearComposer();
    if (activeScene === scene) { setActiveCat('all'); elSearch.value = ''; query = ''; refilter(); return; }
    activeScene = scene; activeCat = 'all'; query = ''; elSearch.value = '';
    elScenes.querySelectorAll('.pk-scene').forEach(function (b) {
      var on = b.getAttribute('data-scene') === scene;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    elPills.querySelectorAll('.pk-pill').forEach(function (b) {
      var on = b.getAttribute('data-cat') === 'all';
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    refilter();
  }

  // ---- 配置: 現在表示中の言語ブロックの「ギャラリー直後スロット」へ移設 ----
  // 既定位置(footer 前・常時表示)は安全網。スロットが見つかれば各言語で同じ良い位置に昇格。
  function mountToActive() {
    if (!root) return;
    var slot = document.querySelector('.lang-section.show .pk-showcase-slot');
    if (slot && root.parentNode !== slot) slot.appendChild(root);
  }

  // ---- 公開: 言語切替 ----
  function setLang(next) {
    if (!L[next]) return;
    lang = next;
    recount();
    // 証拠バーの数字も、その言語の版の曲数に合わせる (カウントアップ後の言語切替)
    if (statEls && statEls.nSongs) {
      statEls.nSongs.textContent = TOTAL;
      statEls.nClassical.textContent = CLASSICAL;
      statEls.nComposers.textContent = COMPOSERS;
    }
    renderLabels();
    refilter(); // 曲名を新言語で描き直す
    if (window.requestAnimationFrame) requestAnimationFrame(mountToActive);
    else mountToActive();
  }

  // ---- 初期化 ----
  function init() {
    root = document.getElementById('pk-showcase');
    if (!root) return;

    elLead = root.querySelector('.pk-lead');
    elSearch = root.querySelector('.pk-search-input');
    elPills = root.querySelector('.pk-pills');
    elScenes = root.querySelector('.pk-scenes');
    elGrid = root.querySelector('.pk-grid');
    elCount = root.querySelector('.pk-count');
    elMore = root.querySelector('.pk-more');
    elEmpty = root.querySelector('.pk-empty');
    elFinderCta = root.querySelector('.pk-finder-cta');

    statEls = {
      nSongs: root.querySelector('[data-stat="songs-n"]'),
      nClassical: root.querySelector('[data-stat="classical-n"]'),
      nComposers: root.querySelector('[data-stat="composers-n"]'),
      nFree: root.querySelector('[data-stat="free-n"]'),
      songs: root.querySelector('[data-stat="songs-l"]'),
      classical: root.querySelector('[data-stat="classical-l"]'),
      composers: root.querySelector('[data-stat="composers-l"]'),
      free: root.querySelector('[data-stat="free-l"]')
    };

    // カテゴリピルを生成
    CATS.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pk-pill' + (c.key === 'all' ? ' is-active' : '') + (c.color ? ' pk-cat-' + c.color : '');
      btn.setAttribute('data-cat', c.key);
      btn.setAttribute('aria-pressed', c.key === 'all' ? 'true' : 'false');
      btn.innerHTML = '<span class="pk-pill-label"></span><span class="pk-pill-count"></span>';
      btn.addEventListener('click', function () { setActiveCat(c.key); });
      elPills.appendChild(btn);
    });

    // シーンボタンを生成
    SCENES.forEach(function (sc) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pk-scene';
      btn.setAttribute('data-scene', sc.key);
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = '<span class="pk-scene-emoji" aria-hidden="true">' + sceneEmoji(sc.key) + '</span><span class="pk-scene-label"></span>';
      btn.addEventListener('click', function () { setActiveScene(sc.key); });
      elScenes.appendChild(btn);
    });

    // 検索 (IME 考慮で input イベント)
    var composing = false;
    elSearch.addEventListener('compositionstart', function () { composing = true; });
    elSearch.addEventListener('compositionend', function () { composing = false; clearComposer(); query = elSearch.value; activeScene = null; refilter(); });
    elSearch.addEventListener('input', function () {
      if (composing) return;
      clearComposer();
      query = elSearch.value; activeScene = null;
      // 検索開始したらシーン選択は解除
      elScenes.querySelectorAll('.pk-scene').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      refilter();
    });

    // もっと見る
    elMore.addEventListener('click', function () { renderGrid(false); });

    // 空状態クリア
    var clearBtn = root.querySelector('.pk-clear');
    if (clearBtn) clearBtn.addEventListener('click', function () { elSearch.value = ''; query = ''; setActiveCat('all'); });

    renderLabels();
    refilter();
    initCounters();
    mountToActive();

    // 本体 index.html の言語トグルと協調:
    //  ① CustomEvent('pk:lang') を listen
    document.addEventListener('pk:lang', function (e) { if (e && e.detail) setLang(e.detail); });
    //  ② 既存の .langtoggle button クリックを直接 hook (本体改変を最小化)
    document.querySelectorAll('.langtoggle button[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); });
    });
    //  ③ 初期言語: 本体が active にしているボタンに合わせる
    var activeBtn = document.querySelector('.langtoggle button.active');
    if (activeBtn && activeBtn.dataset.lang) setLang(activeBtn.dataset.lang);
  }

  function sceneEmoji(key) {
    return { wedding: '💍', halloween: '🎃', graduation: '🎓', yearend: '🎍', recital: '🎀', christmas: '🎄' }[key] || '🎵';
  }

  // 公開API
  function filterByComposer(jaNames) {
    if (!jaNames) { activeComposer = null; }
    else {
      activeComposer = jaNames.slice();
      activeScene = null; activeCat = 'all'; query = ''; if (elSearch) elSearch.value = '';
      elPills.querySelectorAll('.pk-pill').forEach(function (b) {
        var on = b.getAttribute('data-cat') === 'all';
        b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      elScenes.querySelectorAll('.pk-scene').forEach(function (b) {
        b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false');
      });
    }
    refilter();
  }
  window.PKShowcase = {
    setLang: setLang, init: init,
    filterByComposer: filterByComposer,
    onComposerCleared: function (fn) { if (typeof fn === 'function') composerClearedCbs.push(fn); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
