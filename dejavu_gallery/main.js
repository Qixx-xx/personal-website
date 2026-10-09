/* ===========================================================
   Deja Vu Gallery v2.1 · 数据 + 渲染
   后续补充信息只需改下面的 SECTIONS，不必动 HTML 结构。
   Hero 区文案不在此处，它保留在 gallery.html 里静态渲染，
   这样脚本未执行时页面依然有内容可看。

   v2.1 改动：
     - 移除 STATUS 状态体系（已确认 / 待补充等标签全部删除）
     - 音乐区重构：2×2 四张专辑封面 + 人生曲目 + 听歌场景
     - 缺失数据一律用自然完整的默认文案，不再出现"待补充"

   卡片字段：
     title / desc   必填
     kind           'album'（专辑封面卡）| 省略=普通卡
     tags           标签数组（省略则不显示）
     image          图片路径（省略则不显示；仅保留空帧占位）
   =========================================================== */

var IMG = 'assets/placeholder.png';

var SECTIONS = [
  {
    id: 'music', nav: 'Music', title: 'Music',
    subtitle: '音乐可以当饭吃（真的）',
    manifesto: '能听歌的话我会原谅世界。口味：酸放克 / 爵士 / 迷摇 / Queen 粉。',
    /* 2×2 四张专辑封面：只留空帧 + 专辑名，不生成具体封面图案 */
    albums: [
      { title: 'Lazy Racer', sub: '1979 · 英国 · AOR / 爵士放克' },
      { title: 'Morphine', sub: '低音贝斯 · 萨克斯 · 深夜酒吧' },
      { title: '磊落', sub: '一个会记住的名字' },
      { title: 'Queen', sub: '摇滚的底色' }
    ],
    /* 人生曲目：纯文本 + 标签 */
    lifeTracks: {
      title: '人生曲目 Life Tracks',
      desc: 'Midnight in Harlem。深夜蓝调、孤独与释放，长篇幅情绪递进。',
      tracks: ['Midnight in Harlem', '深夜蓝调', '孤独与释放']
    },
    /* 听歌场景：纯文字卡片 */
    scenarios: {
      title: '听歌场景 Listening Scenarios',
      items: ['写代码时听', '深夜 emo 时听', '原谅世界时听']
    }
  },
  {
    id: 'sports', nav: 'Sports', title: 'Sports',
    cards: [
      { title: '网球', desc: '在"看"和"打"之间徘徊，底线对拉有种很妙的节奏。', tags: ['网球'] },
      { title: '其他想尝试', desc: '攀岩、滑板、骑行、游泳，都在"想试"的清单上。', tags: ['攀岩', '滑板', '骑行', '游泳'] }
    ]
  },
  {
    id: 'birds', nav: 'Birds', title: 'Birdwatching',
    subtitle: '菜菜的观鸟佬',
    cards: [
      { title: '身份', desc: '观鸟佬（但是菜菜的）。', tags: ['观鸟', '菜菜的', '自然'], image: IMG },
      { title: '与创作关联', desc: '鸟的形态、颜色、行为，可能变成画作或故事。', tags: ['绘画', '写作', '自然'] }
    ]
  },
  {
    id: 'art-writing', nav: 'Art', title: 'Art & Writing',
    subtitle: '创造另一个世界',
    cards: [
      { title: '绘画', desc: '素描、水彩、板绘、漫画、抽象，都可能是方向。情绪出口，也是技能修炼。', tags: ['绘画', '素描', '水彩', '板绘'], image: IMG },
      { title: '写小说', desc: '悬疑推理、高概念科幻、哲学散文。偏设定驱动、烧脑反转。', tags: ['小说', '悬疑', '科幻', '哲学'] },
      { title: '图文结合', desc: '想试图文小说或互动叙事，和网页游戏 / ARG 打通。', tags: ['图文小说', '互动叙事', 'ARG'] }
    ]
  },
  {
    id: 'reading', nav: 'Reading', title: 'Film & Reading',
    subtitle: '悬疑、科幻、哲学、散文',
    cards: [
      { title: '推理剧', desc: '《神探夏洛克》《基本演绎法》。高智商炫技 + 人物细腻成长。', tags: ['推理', '福尔摩斯', '神夏', '基本演绎法'] },
      { title: '高概念科幻', desc: '《盗梦空间》《致命魔术》《信条》。规则明确，然后打破规则。', tags: ['诺兰', '高概念', '科幻'] },
      { title: '书', desc: '哲学类、散文。里尔克："要爱你的寂寞，对没有解决的一切要有信心。"', tags: ['哲学', '散文', '里尔克'] }
    ]
  },
  {
    id: 'personality', nav: 'Personality', title: 'Personality',
    subtitle: '幽默的人机，偶尔想睡觉',
    cards: [
      { title: '朋友形容', desc: '幽默的人机（可能）。' },
      { title: 'MBTI', desc: '可能 INTP，但警惕刻板印象。"不要陷入刻板印象啊！！"' },
      { title: '文科与历史', desc: '文科水平还算不错？如果历史不考试我就喜欢它。' },
      { title: '座右铭 1', desc: '"啊我能在这里睡觉吗（对不起）"' },
      { title: '座右铭 2', desc: '"要爱你的寂寞，对没有解决的一切要有信心。"——里尔克' }
    ]
  },
  {
    id: 'projection', nav: 'Wall', title: 'Projection Wall',
    subtitle: '你在这里看到了什么？', variant: 'wall',
    manifesto: '这个画廊关于我，也可能关于你。\n人在别人身上看到的，都是自己的投射。\n所以，你在这里看到了什么？',
    note: '留言占位 · 暂未开放，先留一面空墙。'
  }
];

/* ================= 渲染 ================= */
(function () {
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildCard(card) {
    var art = el('article', 'gcard' + (card.kind ? ' ' + card.kind : ''));

    if (card.image) {
      /* 图片填充区保留：渲染为空帧占位，不放真实图片 */
      art.appendChild(el('div', 'gcard-media'));
    }

    var body = el('div', 'gcard-body');
    var head = el('div', 'gcard-head');
    head.appendChild(el('h3', null, card.title));
    body.appendChild(head);

    body.appendChild(el('p', 'gcard-desc', card.desc));

    if (card.tags && card.tags.length) {
      var ul = el('ul', 'tags');
      card.tags.forEach(function (t) { ul.appendChild(el('li', null, t)); });
      body.appendChild(ul);
    }

    art.appendChild(body);
    return art;
  }

  /* 专辑封面卡：空帧 + 专辑名（不生成具体图案） */
  function buildAlbum(album) {
    var fig = el('figure', 'album-card');

    var cover = el('div', 'album-cover');
    cover.appendChild(el('span', 'album-cover-name', album.title));
    fig.appendChild(cover);

    var cap = el('figcaption', 'album-caption');
    cap.appendChild(el('p', 'album-title', album.title));
    if (album.sub) cap.appendChild(el('p', 'album-sub', album.sub));
    fig.appendChild(cap);

    return fig;
  }

  function buildMusicModule(title, desc, tags) {
    var box = el('div', 'music-module');
    box.appendChild(el('h3', 'music-module-title', title));
    if (desc) box.appendChild(el('p', 'music-module-desc', desc));
    if (tags && tags.length) {
      var ul = el('ul', 'tags');
      tags.forEach(function (t) { ul.appendChild(el('li', null, t)); });
      box.appendChild(ul);
    }
    return box;
  }

  function buildScenarios(sc) {
    var box = el('div', 'music-module');
    box.appendChild(el('h3', 'music-module-title', sc.title));
    var grid = el('div', 'scenario-grid');
    sc.items.forEach(function (t) { grid.appendChild(el('div', 'scenario-item', t)); });
    box.appendChild(grid);
    return box;
  }

  function buildSection(s) {
    var sec = el('section', 'section' + (s.variant ? ' ' + s.variant : ''));
    sec.id = s.id;

    var head = el('header', 'section-head');
    head.appendChild(el('h2', 'section-title', s.title));
    if (s.subtitle) head.appendChild(el('p', 'section-subtitle', s.subtitle));
    sec.appendChild(head);

    if (s.manifesto) sec.appendChild(el('p', 'manifesto', s.manifesto));

    /* 音乐区：2×2 专辑封面 */
    if (s.albums && s.albums.length) {
      var agrid = el('div', 'album-grid');
      s.albums.forEach(function (a) { agrid.appendChild(buildAlbum(a)); });
      sec.appendChild(agrid);
    }

    /* 人生曲目模块 */
    if (s.lifeTracks) {
      sec.appendChild(buildMusicModule(
        s.lifeTracks.title, s.lifeTracks.desc, s.lifeTracks.tracks
      ));
    }

    /* 听歌场景模块 */
    if (s.scenarios) sec.appendChild(buildScenarios(s.scenarios));

    if (s.cards && s.cards.length) {
      var grid = el('div', 'card-grid');
      s.cards.forEach(function (c) { grid.appendChild(buildCard(c)); });
      sec.appendChild(grid);
    }

    if (s.note) {
      var note = el('div', 'wall-note');
      note.appendChild(el('p', null, s.note));
      sec.appendChild(note);
    }

    return sec;
  }

  var root = document.getElementById('gallery-sections');
  SECTIONS.forEach(function (s) { root.appendChild(buildSection(s)); });

  /* 导航（顶部 + 页脚）由数据生成，避免两处手写重复；删改展区时自动同步 */
  var navItems = [{ id: 'gallery-hero', nav: 'Intro' }].concat(
    SECTIONS.map(function (s) { return { id: s.id, nav: s.nav || s.title }; })
  );
  ['gallery-nav', 'footer-nav'].forEach(function (id) {
    var box = document.getElementById(id);
    if (!box) return;
    navItems.forEach(function (it) {
      var a = el('a', null, it.nav);
      a.href = '#' + it.id;
      box.appendChild(a);
    });
  });

  /* 页脚年份自动获取 */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* 平滑滚动（固定头部偏移补偿），事件委托覆盖动态生成的链接 */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.pageYOffset - 64;
    window.scrollTo({ top: top, behavior: 'smooth' });
    if (history.pushState) history.pushState(null, '', '#' + id);
  });
})();
