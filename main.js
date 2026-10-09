/* ============================================================
   main.js —— 个人主页 v2.10
   修复「完整动画模式下，画作与副标题卡在初始状态」的根因。

   【根因】IntersectionObserver 按「几何可见面积」判定是否触发：
     · 卡片 .card[data-reveal]  初始 opacity:0（不影响几何）+ 水平小位移
       → 布局盒子仍在视口内，isIntersecting=true → 正常触发 ✅
     · 副标题 .mask-inner        初始 transform:translateY(110%) 且被
       父级 .mask(overflow:hidden) 裁掉 → 可见面积=0 → isIntersecting 永远
       为 false → 永远不触发 ❌
     · 画作 .artwork-frame       初始 clip-path:inset(100% 0 0 0) 完全裁掉
       → 可见面积=0 → 永远不触发 ❌

   【修复】不再观察元素本人，改为观察它「几何可见」的父容器作为代理：
     · .mask-inner    → 观察 .mask（父级，几何可见）
     · .artwork-frame → 观察 figure（父级，几何可见）
     · 其他           → 观察自身
     代理目标进入视口后，再给真正的 [data-reveal] 元素加 .is-revealed。

   降级（prefers-reduced-motion）下元素用 opacity:0 隐藏（几何可见），
   因此降级模式本来就正常，无需代理；代理方案对其同样兼容。

   其余职责：页脚年份、诊断日志、无 IO 旧浏览器兜底、首屏 Hero 兜底。
   所有缓动 / 位移 / clip-path 均由 CSS 承担；无第三方库。
   ============================================================ */
(function () {
  "use strict";

  function init() {
    // 1. 页脚年份自动更新
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    // 2. 查询所有 [data-reveal] + 诊断日志
    var revealEls = Array.prototype.slice.call(
      document.querySelectorAll("[data-reveal]")
    );
    var isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    console.log("[reveal] targets found:", revealEls.length);
    console.log("[reveal] prefers-reduced-motion:", isReduced);
    console.log("[reveal] mode:", isReduced ? "fade-only (reduced motion)" : "full animation");

    // 分类统计（诊断：三个数字都应 > 0）
    console.log(
      "[reveal] breakdown — mask-inner:",
      document.querySelectorAll(".mask-inner[data-reveal]").length,
      "| artwork-frame:",
      document.querySelectorAll(".artwork-frame[data-reveal]").length,
      "| card:",
      document.querySelectorAll(".card[data-reveal]").length
    );

    function showAll() {
      revealEls.forEach(function (el) {
        el.classList.add("is-revealed");
      });
    }

    // 3. 旧浏览器无 IntersectionObserver：直接全部显示，绝不隐藏内容（信息零丢失）。
    if (!("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    // 4. 建立「观察代理目标 → 待触发元素」的映射。
    //    targetMap: observeTarget(element) -> [reveal element, ...]
    var targetMap = new Map();

    revealEls.forEach(function (el) {
      var observeTarget = el;

      // 副标题：观察 .mask 父容器（几何可见，避免 translateY(110%)+overflow 被裁成 0 面积）
      if (el.classList.contains("mask-inner")) {
        observeTarget = el.closest(".mask") || el;
      }
      // 画作：观察 figure 父容器（几何可见，避免 clip-path:inset(100%) 被裁成 0 面积）
      else if (el.classList.contains("artwork-frame")) {
        observeTarget = el.closest("figure") || el;
      }

      if (targetMap.has(observeTarget)) {
        targetMap.get(observeTarget).push(el);
      } else {
        targetMap.set(observeTarget, [el]);
      }
    });

    // 5. 滚动入场：IO 命中代理目标后，给其对应的所有 [data-reveal] 加 .is-revealed。
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var els = targetMap.get(entry.target);
            if (els) {
              els.forEach(function (el) {
                el.classList.add("is-revealed");
              });
              targetMap.delete(entry.target);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -6% 0px"
      }
    );

    targetMap.forEach(function (els, observeTarget) {
      observer.observe(observeTarget);
    });

    // 6. [兜底] 仅首屏：1.5s 后强制 Hero 区域入场（其余 section 只由 IO 触发，
    //    不做全页超时兜底，否则用户滚下去时所有内容已显示，看不到「浮现」）。
    var heroReveals = Array.prototype.slice.call(
      document.querySelectorAll(".hero [data-reveal]")
    );
    window.setTimeout(function () {
      heroReveals.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      console.log("[reveal] hero fallback applied at 1500ms");
    }, 1500);
  }

  // DOMContentLoaded 后再绑定：确保 [data-reveal] 元素已全部解析。
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// [新增] 反馈表单逻辑（v3.0）
(function () {
  "use strict";

  /* ============================================================
     FEEDBACK_CONFIG —— 提交落地的 GitHub 仓库配置
     反馈 Issue 写入仓库：https://github.com/Qixx-xx/feedback
     ============================================================ */
  var FEEDBACK_CONFIG = {
    githubUser: "Qixx-xx",   // ← GitHub 用户名
    githubRepo: "feedback",  // ← 反馈 Issue 落地的仓库（https://github.com/Qixx-xx/feedback）
    label: "feedback"        // ← Issue 标签，可选
  };

  var form = document.querySelector(".feedback-form");
  if (!form) return;

  var toast = document.querySelector(".feedback-toast");
  var toastTimer = null;

  function showToast() {
    if (!toast) return;
    toast.classList.add("is-visible");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 1. 读取字段
    var name = (form.querySelector('input[name="name"]') || {}).value || "";
    name = name.trim();
    var email = (form.querySelector('input[name="email"]') || {}).value || "";
    email = email.trim();
    var typeEl = form.querySelector('input[name="type"]:checked');
    var type = typeEl ? typeEl.value : "";
    var content = (form.querySelector('textarea[name="content"]') || {}).value || "";
    content = content.trim();
    var ratingEl = form.querySelector('input[name="rating"]:checked');
    var rating = ratingEl ? ratingEl.value : "5";

    // 2. 验证
    if (!type) {
      window.alert("请选择反馈类型");
      return;
    }
    if (content.length < 10) {
      window.alert("反馈内容至少 10 个字");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.alert("邮箱格式不正确");
      return;
    }

    // 3. 拼装 Issue URL
    var title = "[反馈/" + type + "] " + (name || "匿名") + " · " + rating + "/5";
    var body = [
      "**反馈类型**：" + type,
      "**姓名**：" + (name || "未填写"),
      "**邮箱**：" + (email || "未填写"),
      "**满意度**：" + rating + "/5",
      "",
      "---",
      "",
      content
    ].join("\n");

    var url = "https://github.com/" + FEEDBACK_CONFIG.githubUser + "/" + FEEDBACK_CONFIG.githubRepo + "/issues/new"
      + "?title=" + encodeURIComponent(title)
      + "&body=" + encodeURIComponent(body)
      + "&labels=" + encodeURIComponent(FEEDBACK_CONFIG.label);

    // 4. 打开 GitHub 新建 Issue 页
    window.open(url, "_blank", "noopener,noreferrer");

    // 5. 显示 Toast
    showToast();

    // 6. 清空正文（保留类型和星级，便于连续提交）
    form.querySelector('textarea[name="content"]').value = "";
  });
})();
