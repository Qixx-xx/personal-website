// 页脚年份自动获取当前年份
document.getElementById('year').textContent = new Date().getFullYear();

// 导航点击平滑滚动（CSS 已设置 scroll-behavior: smooth，这里做兜底，对固定头部做 offset 补偿）
function smoothScrollTo(target) {
  var el = document.querySelector(target);
  if (!el) return;
  var headerH = 64;
  var top = el.getBoundingClientRect().top + window.pageYOffset - headerH;
  window.scrollTo({ top: top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = link.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      smoothScrollTo(href);
      if (history.pushState) history.pushState(null, '', href);
    }
  });
});
