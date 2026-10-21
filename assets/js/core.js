/* ==========================================================================
   core.js — 全局命名空间、DOM 工具、公共组件与 UI 模块
   零构建：以普通脚本加载，挂载到 window.Mall，file:// 直接打开亦可用。
   ========================================================================== */
(function (window, document) {
  'use strict';

  var Mall = window.Mall || (window.Mall = {});

  /* ------------------------------------------------------------------------
     1. 基础工具
     ------------------------------------------------------------------------ */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  /** 事件委托：在 root 上监听，匹配 selector 后执行 handler */
  function delegate(root, type, selector, handler) {
    root.addEventListener(type, function (event) {
      var target = event.target.closest(selector);
      if (target && root.contains(target)) {
        handler.call(target, event, target);
      }
    });
  }

  /** 最简 HTML 转义，避免数据拼接破坏结构 */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pad2(value) {
    return value < 10 ? '0' + value : String(value);
  }

  /** 拆分价格整数位与小数位，用于分级排版 */
  function splitPrice(value) {
    var num = Number(value) || 0;
    var fixed = num.toFixed(2);
    var parts = fixed.split('.');
    return { int: parts[0], dec: parts[1] };
  }

  function readStore(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* 隐私模式下写入失败时静默降级为内存态 */
    }
  }

  Mall.$ = $;
  Mall.$$ = $$;
  Mall.delegate = delegate;
  Mall.esc = esc;
  Mall.splitPrice = splitPrice;

  /* ------------------------------------------------------------------------
     2. 图标（内联 SVG，避免额外请求与图标字体依赖）
     ------------------------------------------------------------------------ */
  var ICONS = {
    location:
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    search:
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    cart:
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"/></svg>',
    close:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrowRight:
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>',
    arrowUp:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
    chevronLeft:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>',
    chevronRight:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>',
    shield:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h11v10H2z"/><path d="M13 9h5l3 3v4h-8z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>',
    refresh:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 6.3"/><path d="M20 5v6h-6"/></svg>',
    medal:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="14" r="5"/><path d="M8.5 9 6 3h12l-2.5 6"/></svg>',
    check:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>',
    user:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
    lock:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    phone:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.6"/><path d="M11 18h2"/></svg>',
    menu:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    grid:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    wallet:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="2.4"/><path d="M3 10h18"/><circle cx="16.5" cy="15" r="1.1" fill="currentColor" stroke="none"/></svg>',
    star:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/></svg>',
    truckFast:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 6h4l3 3v5h-7z"/><path d="M2 8h9v6H2z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>'
  };

  Mall.icon = function (name) {
    return ICONS[name] || '';
  };

  /* ------------------------------------------------------------------------
     3. 轻提示
     ------------------------------------------------------------------------ */
  var toastStack = null;

  Mall.toast = function (message) {
    if (!toastStack) {
      toastStack = document.createElement('div');
      toastStack.className = 'toast-stack';
      toastStack.setAttribute('role', 'status');
      toastStack.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastStack);
    }

    var node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = ICONS.check + '<span>' + esc(message) + '</span>';
    toastStack.appendChild(node);

    window.setTimeout(function () {
      node.classList.add('is-leaving');
      window.setTimeout(function () {
        node.remove();
      }, 240);
    }, 1800);
  };

  /* ------------------------------------------------------------------------
     4. 购物车（localStorage 持久化，仅存 id 与数量）
     ------------------------------------------------------------------------ */
  var CART_KEY = 'imitateMall:cart';

  var cart = {
    items: function () {
      var value = readStore(CART_KEY, []);
      return Array.isArray(value) ? value : [];
    },
    count: function () {
      return cart.items().reduce(function (sum, item) {
        return sum + (Number(item.qty) || 0);
      }, 0);
    },
    add: function (id, qty) {
      var items = cart.items();
      var quantity = Number(qty) || 1;
      var found = items.filter(function (item) {
        return item.id === id;
      })[0];

      if (found) {
        found.qty += quantity;
      } else {
        items.push({ id: id, qty: quantity });
      }

      writeStore(CART_KEY, items);
      cart.syncBadge();
      return cart.count();
    },
    syncBadge: function () {
      var count = cart.count();
      $$('[data-cart-count]').forEach(function (node) {
        node.textContent = count;
        node.hidden = count === 0;
      });
    }
  };

  Mall.cart = cart;

  /* ------------------------------------------------------------------------
     5. 页头组件
     ------------------------------------------------------------------------ */
  var NAV_ITEMS = [
    { key: 'home', label: '首页', href: 'index.html' },
    { key: 'seckill', label: '京东秒杀', href: 'jd_miaosha.html' },
    { key: 'coupon', label: '优惠券', href: 'coupon.html' },
    { key: 'plus', label: 'PLUS会员', href: '#' },
    { key: 'brand', label: '品牌闪购', href: '#' },
    { key: 'auction', label: '拍卖', href: '#' },
    { key: 'appliance', label: '京东家电', href: '#' },
    { key: 'market', label: '京东超市', href: '#' },
    { key: 'fresh', label: '京东生鲜', href: '#' },
    { key: 'global', label: '京东国际', href: '#' },
    { key: 'finance', label: '京东金融', href: '#' }
  ];

  var HOT_WORDS = [
    { text: '品质男人节', hot: true },
    { text: '宝宝面霜', hot: false },
    { text: '学生特权', hot: false },
    { text: 'DIESEL', hot: false },
    { text: '羊羔奶粉', hot: false },
    { text: '皓月家阖', hot: false },
    { text: '电脑数码', hot: false },
    { text: '慢生活', hot: false }
  ];

  function renderPromo() {
    if (readStore('imitateMall:promoClosed', false)) {
      return '';
    }

    return (
      '<div class="promo" data-promo>' +
      '<div class="container promo__inner">' +
      '<span class="promo__tag">限时</span>' +
      '<p class="promo__text">' +
      '<strong>品质男人节</strong> 全场满 300 减 40，叠加品类券最高再省 120 元' +
      '</p>' +
      '<button class="promo__close" type="button" data-promo-close aria-label="关闭活动提示">' +
      ICONS.close +
      '</button>' +
      '</div>' +
      '</div>'
    );
  }

  function renderTopbar() {
    return (
      '<div class="topbar">' +
      '<div class="container topbar__inner">' +
      '<span class="topbar__loc">' +
      ICONS.location +
      '<span>南昌</span>' +
      '</span>' +
      '<span class="topbar__sep" aria-hidden="true"></span>' +
      '<div class="topbar__group topbar__group--hide-sm">' +
      '<a href="login.html">你好，请登录</a>' +
      '<a href="login.html" class="topbar__link--accent">免费注册</a>' +
      '</div>' +
      '<div class="topbar__group topbar__group--end">' +
      '<a href="#">我的订单</a>' +
      '<a href="#">我的京东</a>' +
      '<a href="#">京东会员</a>' +
      '<a href="#">企业采购</a>' +
      '<a href="#">客户服务</a>' +
      '<a href="#">网站导航</a>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function renderMasthead() {
    var hotWords = HOT_WORDS.map(function (word) {
      return (
        '<a href="#" class="' +
        (word.hot ? 'is-hot' : '') +
        '">' +
        esc(word.text) +
        '</a>'
      );
    }).join('');

    return (
      '<div class="masthead">' +
      '<div class="container masthead__inner">' +
      '<a class="brand" href="index.html">' +
      '<span class="brand__mark" aria-hidden="true">JD</span>' +
      '<span class="brand__text">' +
      '<span class="brand__name">京选商城</span>' +
      '<span class="brand__slogan">JINGXUAN MALL</span>' +
      '</span>' +
      '</a>' +
      '<form class="search" role="search" data-search>' +
      '<div class="search__box">' +
      '<label class="sr-only" for="site-search">搜索商品</label>' +
      '<input class="search__input" id="site-search" name="q" type="search" ' +
      'placeholder="搜索商品、品牌或店铺" autocomplete="off" />' +
      '<button class="search__submit" type="submit">' +
      ICONS.search +
      '<span>搜索</span>' +
      '</button>' +
      '</div>' +
      '<div class="search__hot">' +
      hotWords +
      '</div>' +
      '</form>' +
      '<div class="masthead__actions">' +
      '<a class="cart-btn" href="#">' +
      ICONS.cart +
      '<span>我的购物车</span>' +
      '<span class="cart-btn__count" data-cart-count hidden>0</span>' +
      '</a>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function renderMainnav(active) {
    var links = NAV_ITEMS.map(function (item) {
      return (
        '<li>' +
        '<a class="mainnav__link' +
        (item.key === active ? ' is-active' : '') +
        '" href="' +
        item.href +
        '"' +
        (item.key === active ? ' aria-current="page"' : '') +
        '>' +
        esc(item.label) +
        '</a>' +
        '</li>'
      );
    }).join('');

    return (
      '<nav class="mainnav" aria-label="主导航">' +
      '<div class="container mainnav__inner">' +
      '<span class="mainnav__all">' +
      ICONS.menu +
      '<span>全部商品分类</span>' +
      '</span>' +
      '<ul class="mainnav__list">' +
      links +
      '</ul>' +
      '<span class="mainnav__spacer"></span>' +
      '<span class="mainnav__meta">正品保障 · 全国联保 · 七天无理由</span>' +
      '</div>' +
      '</nav>'
    );
  }

  Mall.header = {
    /** 渲染页头到 [data-component="header"] 容器 */
    render: function (options) {
      var host = $('[data-component="header"]');
      if (!host) {
        return;
      }

      var settings = options || {};
      host.className = 'site-header';
      host.innerHTML =
        renderPromo() + renderTopbar() + renderMasthead() + renderMainnav(settings.active);

      // 关闭活动提示（记忆选择）
      delegate(host, 'click', '[data-promo-close]', function () {
        var bar = host.querySelector('[data-promo]');
        if (bar) {
          bar.remove();
          writeStore('imitateMall:promoClosed', true);
        }
      });

      // 搜索提交：静态站无后端，给出反馈即可
      delegate(host, 'submit', '[data-search]', function (event) {
        event.preventDefault();
        var input = host.querySelector('.search__input');
        var keyword = (input && input.value.trim()) || '';
        Mall.toast(keyword ? '正在搜索「' + keyword + '」' : '请输入搜索关键词');
      });

      cart.syncBadge();
    }
  };

  /* ------------------------------------------------------------------------
     6. 页脚组件
     ------------------------------------------------------------------------ */
  var FOOTER_COLUMNS = [
    {
      title: '购物指南',
      links: ['购物流程', '会员介绍', '生活旅行', '常见问题', '大家电', '联系客服']
    },
    {
      title: '配送方式',
      links: ['上门自提', '211限时达', '配送服务查询', '配送费收取标准', '海外配送']
    },
    {
      title: '支付方式',
      links: ['货到付款', '在线支付', '分期付款', '邮局汇款', '公司转账']
    },
    {
      title: '售后服务',
      links: ['售后政策', '价格保护', '退款说明', '返修/退换货', '取消订单']
    },
    {
      title: '特色服务',
      links: ['夺宝岛', 'DIY装机', '延保服务', '京东E卡', '京东通信', '京鱼座智能']
    }
  ];

  var PROMISES = [
    { icon: 'medal', title: '正品保障', desc: '正品行货 假一赔十' },
    { icon: 'truckFast', title: '极速送达', desc: '211 限时达 次日必达' },
    { icon: 'refresh', title: '无忧退换', desc: '七天无理由退换货' },
    { icon: 'shield', title: '售后无忧', desc: '全国联保 上门取件' }
  ];

  function renderFooterPromise() {
    var items = PROMISES.map(function (item) {
      return (
        '<div class="footer-promise__item">' +
        '<span class="footer-promise__icon">' +
        ICONS[item.icon] +
        '</span>' +
        '<span>' +
        '<span class="footer-promise__title">' +
        esc(item.title) +
        '</span>' +
        '<span class="footer-promise__desc">' +
        esc(item.desc) +
        '</span>' +
        '</span>' +
        '</div>'
      );
    }).join('');

    return '<div class="footer-promise">' + items + '</div>';
  }

  function renderFooterLinks() {
    var columns = FOOTER_COLUMNS.map(function (column) {
      var links = column.links
        .map(function (text) {
          return '<a href="#">' + esc(text) + '</a>';
        })
        .join('');

      return (
        '<div>' +
        '<h3 class="footer-links__title">' +
        esc(column.title) +
        '</h3>' +
        '<div class="footer-links__list">' +
        links +
        '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="footer-links">' +
      columns +
      '<div class="footer-contact">' +
      '<p class="footer-links__title">客服热线</p>' +
      '<p class="footer-contact__phone">400-000-0000</p>' +
      '<p class="footer-contact__hours">服务时间 08:00 - 22:00（全年无休）</p>' +
      '<p class="footer-contact__hours" style="margin-top:12px">' +
      '本页面为学习用途的仿站作品，不提供真实交易。' +
      '</p>' +
      '</div>' +
      '</div>'
    );
  }

  function renderFooterLegal() {
    var legalLinks = [
      '关于我们',
      '联系我们',
      '商家入驻',
      '营销中心',
      '友情链接',
      '隐私政策',
      '用户协议',
      '知识产权',
      '廉正举报'
    ]
      .map(function (text) {
        return '<a href="#">' + esc(text) + '</a>';
      })
      .join('');

    return (
      '<div class="footer-legal">' +
      '<div class="footer-legal__row">' + legalLinks + '</div>' +
      '<div class="footer-legal__copy">' +
      '<span>Copyright © 2026 京选商城（仿站练习）</span>' +
      '<span>合字B2-20180025</span>' +
      '<span>京ICP备00000000号-1</span>' +
      '<span>京公网安备 11000000000000号</span>' +
      '</div>' +
      '</div>'
    );
  }

  Mall.footer = {
    render: function () {
      var host = $('[data-component="footer"]');
      if (!host) {
        return;
      }

      host.className = 'site-footer';
      host.innerHTML =
        '<div class="container">' +
        renderFooterPromise() +
        renderFooterLinks() +
        renderFooterLegal() +
        '</div>';
    }
  };

  /* ------------------------------------------------------------------------
     7. 轮播
     基于 transform 位移，支持自动播放 / 悬停暂停 / 圆点 / 方向键 / 可见性暂停
     ------------------------------------------------------------------------ */
  function Carousel(root, options) {
    var settings = options || {};
    this.root = root;
    this.track = $('.carousel__track', root);
    this.slides = $$('.carousel__slide', root);
    this.index = 0;
    this.timer = null;
    this.interval = Number(root.getAttribute('data-interval')) || settings.interval || 5000;
    this.paused = false;

    if (!this.track || this.slides.length === 0) {
      return;
    }

    this.buildControls();
    this.bind();
    this.go(0);
    this.start();
  }

  Carousel.prototype.buildControls = function () {
    var root = this.root;

    // 圆点
    if (this.slides.length > 1 && this.root.getAttribute('data-dots') !== 'false') {
      var dots = document.createElement('div');
      dots.className = 'carousel__dots';

      for (var i = 0; i < this.slides.length; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('data-index', i);
        dot.setAttribute(
          'aria-label',
          '切换到第 ' + (i + 1) + ' 张，共 ' + this.slides.length + ' 张'
        );
        dots.appendChild(dot);
      }

      root.appendChild(dots);
      this.dots = $$('.carousel__dot', dots);
    }

    // 左右箭头
    if (this.slides.length > 1) {
      var prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'carousel__nav carousel__nav--prev';
      prev.setAttribute('aria-label', '上一张');
      prev.innerHTML = ICONS.chevronLeft;

      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'carousel__nav carousel__nav--next';
      next.setAttribute('aria-label', '下一张');
      next.innerHTML = ICONS.chevronRight;

      root.appendChild(prev);
      root.appendChild(next);
      this.prevBtn = prev;
      this.nextBtn = next;
    }
  };

  Carousel.prototype.bind = function () {
    var self = this;
    var root = this.root;

    delegate(root, 'click', '.carousel__dot', function (event, node) {
      self.go(Number(node.getAttribute('data-index')));
      self.restart();
    });

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', function () {
        self.go(self.index - 1);
        self.restart();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', function () {
        self.go(self.index + 1);
        self.restart();
      });
    }

    root.addEventListener('mouseenter', function () {
      self.paused = true;
      self.stop();
    });

    root.addEventListener('mouseleave', function () {
      self.paused = false;
      self.start();
    });

    root.addEventListener('focusin', function () {
      self.stop();
    });

    root.addEventListener('focusout', function () {
      if (!self.paused) {
        self.start();
      }
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        self.go(self.index - 1);
        self.restart();
      } else if (event.key === 'ArrowRight') {
        self.go(self.index + 1);
        self.restart();
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        self.stop();
      } else if (!self.paused) {
        self.start();
      }
    });
  };

  Carousel.prototype.go = function (index) {
    var total = this.slides.length;
    this.index = ((index % total) + total) % total;
    this.track.style.transform = 'translate3d(-' + this.index * 100 + '%,0,0)';

    if (this.dots) {
      this.dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === this.index);
        dot.setAttribute('aria-selected', i === this.index ? 'true' : 'false');
      }, this);
    }

    this.slides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', i === this.index ? 'false' : 'true');
    }, this);
  };

  Carousel.prototype.start = function () {
    var self = this;
    if (this.timer || this.slides.length <= 1) {
      return;
    }

    this.timer = window.setInterval(function () {
      self.go(self.index + 1);
    }, this.interval);
  };

  Carousel.prototype.stop = function () {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  };

  Carousel.prototype.restart = function () {
    this.stop();
    this.start();
  };

  Mall.Carousel = Carousel;

  Mall.initCarousels = function (root) {
    return $$('[data-carousel]', root || document).map(function (node) {
      return new Carousel(node);
    });
  };

  /* ------------------------------------------------------------------------
     8. 倒计时
     修正原实现错误：天数应为 floor(总秒数 / 86400)，此前写成 / (24*60*60) 之外的错误表达式。
     ------------------------------------------------------------------------ */
  function Countdown(root, deadline, options) {
    this.root = root;
    this.deadline = deadline instanceof Date ? deadline : new Date(deadline);
    this.showDays = (options && options.showDays) || false;
    this.onEnd = options && options.onEnd;
    this.timer = null;
    this.lastText = '';

    root.classList.add('countdown');
    this.tick();
    this.timer = window.setInterval(this.tick.bind(this), 1000);
  }

  Countdown.prototype.tick = function () {
    var now = Date.now();
    var remaining = Math.floor((this.deadline.getTime() - now) / 1000);

    if (remaining < 0) {
      remaining = 0;
    }

    // 天 / 时 / 分 / 秒
    var days = Math.floor(remaining / 86400);
    var hours = Math.floor((remaining % 86400) / 3600);
    var minutes = Math.floor((remaining % 3600) / 60);
    var seconds = remaining % 60;

    var text = (this.showDays ? days + ':' : '') +
      pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds);

    if (text === this.lastText) {
      return;
    }
    this.lastText = text;

    var parts = [];
    if (this.showDays) {
      parts.push(this.unit(days, '天'));
      parts.push('<span class="countdown__sep" aria-hidden="true">:</span>');
    }
    parts.push(this.unit(hours));
    parts.push('<span class="countdown__sep" aria-hidden="true">:</span>');
    parts.push(this.unit(minutes));
    parts.push('<span class="countdown__sep" aria-hidden="true">:</span>');
    parts.push(this.unit(seconds));

    this.root.innerHTML = parts.join('');
    this.root.setAttribute('datetime', this.deadline.toISOString());

    if (remaining === 0) {
      window.clearInterval(this.timer);
      this.timer = null;
      if (typeof this.onEnd === 'function') {
        this.onEnd();
      }
    }
  };

  Countdown.prototype.unit = function (value, label) {
    return (
      '<span class="countdown__unit">' +
      pad2(value) +
      '</span>' +
      (label
        ? '<span class="sr-only">' + label + '</span>'
        : '')
    );
  };

  Countdown.prototype.destroy = function () {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  };

  Mall.Countdown = Countdown;

  /**
   * 初始化所有 [data-countdown]
   * - data-deadline="2026-10-22T00:00:00" 指定绝对时间
   * - data-hours="24" 未指定 deadline 时，从当前时间顺延若干小时
   */
  Mall.initCountdowns = function (root) {
    return $$('[data-countdown]', root || document).map(function (node) {
      var showDays = node.getAttribute('data-days') === 'true';
      var deadline = node.getAttribute('data-deadline');
      var target;

      if (deadline) {
        target = new Date(deadline);
      } else {
        var hours = Number(node.getAttribute('data-hours')) || 24;
        target = new Date(Date.now() + hours * 3600 * 1000);
      }

      return new Countdown(node, target, { showDays: showDays });
    });
  };

  /* ------------------------------------------------------------------------
     9. 回到顶部
     ------------------------------------------------------------------------ */
  Mall.initBackTop = function () {
    if ($('.backtop')) {
      return;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'backtop';
    button.setAttribute('aria-label', '回到顶部');
    button.innerHTML = ICONS.arrowUp;
    document.body.appendChild(button);

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var onScroll = function () {
      button.classList.toggle('is-visible', window.scrollY > 600);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  /* ------------------------------------------------------------------------
     10. 加入购物车（事件委托，任意页面可复用）
     ------------------------------------------------------------------------ */
  Mall.bindAddToCart = function () {
    delegate(document, 'click', '[data-add-cart]', function (event, button) {
      event.preventDefault();

      if (button.hasAttribute('disabled')) {
        return;
      }

      var id = button.getAttribute('data-id') || 'unknown';
      var name = button.getAttribute('data-name') || '商品';
      var total = cart.add(id, 1);

      if (button.classList.contains('product__cart')) {
        button.classList.add('is-added');
        button.textContent = '已加入';
      }

      Mall.toast('已加入购物车：' + name + '（共 ' + total + ' 件）');
    });
  };

  /* ------------------------------------------------------------------------
     11. 骨架：统一的页面启动流程
     ------------------------------------------------------------------------ */
  Mall.boot = function (options) {
    var settings = options || {};

    Mall.header.render({ active: settings.active });
    Mall.footer.render();
    Mall.initCarousels();
    Mall.initCountdowns();
    Mall.initBackTop();
    Mall.bindAddToCart();
    cart.syncBadge();

    if (typeof settings.onReady === 'function') {
      settings.onReady(Mall);
    }
  };
})(window, document);
