/* ==========================================================================
   views/home.js — 首页视图
   负责：主视觉、分类侧栏、右侧信息面板、秒杀区、推荐区、楼层、品牌墙
   ========================================================================== */
(function (window, document) {
  'use strict';

  var Mall = window.Mall;
  var data = Mall.data;
  var mk = Mall.markup;
  var $ = Mall.$;
  var esc = Mall.esc;

  /* ------------------------------------------------------------------------
     工具：计算下一个整点场次（每 4 小时一场）
     ------------------------------------------------------------------------ */
  function nextSessionTime() {
    var now = new Date();
    var target = new Date(now.getTime());
    target.setMinutes(0, 0, 0);
    var next = (Math.floor(now.getHours() / 4) + 1) * 4;
    target.setHours(next);
    return target;
  }

  /* ------------------------------------------------------------------------
     主视觉轮播
     ------------------------------------------------------------------------ */
  function renderHero() {
    var host = $('[data-hero-slides]');
    if (!host) {
      return;
    }

    host.innerHTML = data.heroSlides
      .map(function (slide, index) {
        return (
          '<div class="carousel__slide" role="group" aria-roledescription="幻灯片" ' +
          'aria-label="' +
          (index + 1) +
          ' / ' +
          data.heroSlides.length +
          '">' +
          '<a href="#">' +
          '<img src="' +
          esc(slide.img) +
          '" alt="' +
          esc(slide.alt) +
          '" width="1180" height="940"' +
          (index === 0 ? '' : ' loading="lazy"') +
          ' />' +
          '</a>' +
          '</div>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     分类侧栏 + 飞出面板
     ------------------------------------------------------------------------ */
  function renderCategories() {
    var host = $('[data-categories]');
    if (!host) {
      return;
    }

    host.innerHTML = data.categories
      .map(function (category) {
        var groups = category.groups
          .map(function (group) {
            var items = group.items
              .map(function (item) {
                return '<a href="#">' + esc(item) + '</a>';
              })
              .join('');

            return (
              '<div class="flyout__group">' +
              '<dt>' +
              esc(group.label) +
              '</dt>' +
              '<dd>' +
              items +
              '</dd>' +
              '</div>'
            );
          })
          .join('');

        var links = category.links
          .map(function (link) {
            return '<a href="#">' + esc(link) + '</a>';
          })
          .join('');

        return (
          '<li class="cate__item">' +
          '<a class="cate__link" href="#">' +
          esc(category.name) +
          '</a>' +
          '<div class="cate__flyout">' +
          '<p class="flyout__title">' +
          esc(category.name) +
          '</p>' +
          '<dl class="flyout__groups">' +
          groups +
          '</dl>' +
          '<div class="flyout__links">' +
          links +
          '</div>' +
          '</div>' +
          '</li>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     右侧信息面板：用户卡 + 快捷入口 + 公告
     ------------------------------------------------------------------------ */
  function renderAside() {
    var host = $('[data-aside]');
    if (!host) {
      return;
    }

    var quickLinks = [
      { icon: 'cart', text: '我的订单' },
      { icon: 'wallet', text: '我的优惠券' },
      { icon: 'star', text: '我的关注' },
      { icon: 'grid', text: '我的足迹' }
    ]
      .map(function (item) {
        return (
          '<a href="#">' +
          Mall.icon(item.icon) +
          '<span>' +
          esc(item.text) +
          '</span>' +
          '</a>'
        );
      })
      .join('');

    var news = data.news
      .map(function (item) {
        return (
          '<li>' +
          mk.tag(item.tag, 'outline') +
          '<a href="#" class="ellipsis">' +
          esc(item.text) +
          '</a>' +
          '</li>'
        );
      })
      .join('');

    host.innerHTML =
      '<div class="aside-panel">' +
      '<div class="user-card">' +
      '<div class="user-card__top">' +
      '<span class="user-card__avatar" aria-hidden="true">JD</span>' +
      '<div>' +
      '<p class="user-card__name">Hi，欢迎来到京选</p>' +
      '<p class="user-card__sub">登录后可查看更多优惠</p>' +
      '</div>' +
      '</div>' +
      '<div class="user-card__actions">' +
      '<a class="btn btn--primary btn--sm" href="login.html">登录</a>' +
      '<a class="btn btn--ghost btn--sm" href="login.html">注册</a>' +
      '</div>' +
      '<div class="quick-links">' +
      quickLinks +
      '</div>' +
      '</div>' +
      '<div class="news-panel">' +
      '<div class="news-panel__head">' +
      '<button type="button" class="is-active" data-news-tab="notice">公告</button>' +
      '<button type="button" data-news-tab="promo">特惠</button>' +
      '<a class="news-panel__more" href="#">更多</a>' +
      '</div>' +
      '<ul class="news-list" data-news-list>' +
      news +
      '</ul>' +
      '</div>' +
      '<a class="aside-promo" href="coupon.html">' +
      '<span class="aside-promo__title">新人专享礼包</span>' +
      '<span class="aside-promo__desc">注册即领 100 元优惠券组合</span>' +
      '<span class="aside-promo__link">立即领取' +
      Mall.icon('arrowRight') +
      '</span>' +
      '</a>' +
      '</div>';

    bindNewsTabs(host);
  }

  function bindNewsTabs(scope) {
    var promoNews = [
      '限时秒杀：每日 12 点开抢，先到先得',
      '家电以旧换新补贴最高 800 元',
      'PLUS 会员日 8 号专享 95 折',
      '生鲜产地直发专区满 129 减 20',
      '图书文娱满 199 减 35，叠加店铺券'
    ];

    Mall.delegate(scope, 'click', '[data-news-tab]', function (event, button) {
      var tab = button.getAttribute('data-news-tab');
      var list = $('[data-news-list]', scope);

      Mall.$$('[data-news-tab]', scope).forEach(function (node) {
        node.classList.toggle('is-active', node === button);
      });

      var items = tab === 'promo'
        ? promoNews.map(function (text) {
            return { tag: '特惠', text: text };
          })
        : data.news;

      list.innerHTML = items
        .map(function (item) {
          return (
            '<li>' +
            mk.tag(item.tag, 'outline') +
            '<a href="#" class="ellipsis">' +
            esc(item.text) +
            '</a>' +
            '</li>'
          );
        })
        .join('');
    });
  }

  /* ------------------------------------------------------------------------
     轮播下方 banner 行
     ------------------------------------------------------------------------ */
  function renderBannerRow() {
    var host = $('[data-banner-row]');
    if (!host) {
      return;
    }

    host.innerHTML = data.bannerRow
      .map(function (item) {
        return (
          '<a class="banner-row__item banner-row__item--' +
          esc(item.tone) +
          '" href="#">' +
          '<span class="banner-row__eyebrow">' +
          esc(item.eyebrow) +
          '</span>' +
          '<strong class="banner-row__title">' +
          esc(item.title) +
          '</strong>' +
          '<span class="banner-row__desc">' +
          esc(item.desc) +
          '</span>' +
          '<span class="banner-row__cta">' +
          esc(item.cta) +
          Mall.icon('arrowRight') +
          '</span>' +
          '</a>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     秒杀专区
     ------------------------------------------------------------------------ */
  function renderFlash() {
    var host = $('[data-flash]');
    if (!host) {
      return;
    }

    var deadline = nextSessionTime().toISOString();

    host.innerHTML =
      '<div class="flash">' +
      '<div class="flash__head">' +
      '<div class="flash__title">' +
      '<strong id="flash-title">京东秒杀</strong>' +
      '<span>FLASH SALE</span>' +
      '</div>' +
      '<div class="flash__timer">' +
      '<span class="flash__timer-label">距本场结束</span>' +
      '<time class="countdown countdown--light" data-countdown data-deadline="' +
      deadline +
      '" aria-label="距离本场结束的剩余时间"></time>' +
      '</div>' +
      '<a class="flash__more" href="jd_miaosha.html">更多秒杀' +
      Mall.icon('arrowRight') +
      '</a>' +
      '</div>' +
      '<div class="flash__body">' +
      data.flashItems
        .slice(0, 10)
        .map(function (item) {
          return mk.flashCard(item);
        })
        .join('') +
      '</div>' +
      '</div>';
  }

  /* ------------------------------------------------------------------------
     推荐区（含价格筛选）
     ------------------------------------------------------------------------ */
  var recommendFilter = 'all';

  function filterRecommend(items) {
    if (recommendFilter === 'budget') {
      return items.filter(function (item) {
        return item.price < 100;
      });
    }

    if (recommendFilter === 'premium') {
      return items.filter(function (item) {
        return item.price >= 1000;
      });
    }

    return items;
  }

  function paintRecommend() {
    var grid = $('[data-recommend-grid]');
    if (!grid) {
      return;
    }

    var items = filterRecommend(data.recommendItems);
    grid.innerHTML = items.length
      ? items
          .map(function (item) {
            return mk.productCard(item);
          })
          .join('')
      : '<p class="text-muted">该价位暂无推荐商品，换个筛选条件试试。</p>';
  }

  function renderRecommend() {
    var host = $('[data-recommend]');
    if (!host) {
      return;
    }

    host.innerHTML =
      '<div class="floor__head">' +
      '<h2 class="floor__title">为你推荐</h2>' +
      '<span class="floor__desc">根据浏览与购买记录挑选</span>' +
      '<div class="floor__tabs" role="tablist" aria-label="价格筛选">' +
      '<button type="button" class="floor__tab is-active" data-filter="all">全部</button>' +
      '<button type="button" class="floor__tab" data-filter="budget">100 元以下</button>' +
      '<button type="button" class="floor__tab" data-filter="premium">1000 元以上</button>' +
      '</div>' +
      '</div>' +
      '<div class="product-grid" data-recommend-grid></div>';

    paintRecommend();

    Mall.delegate(host, 'click', '[data-filter]', function (event, button) {
      recommendFilter = button.getAttribute('data-filter');
      Mall.$$('[data-filter]', host).forEach(function (node) {
        node.classList.toggle('is-active', node === button);
      });
      paintRecommend();
    });
  }

  /* ------------------------------------------------------------------------
     楼层
     ------------------------------------------------------------------------ */
  function resolveItems(ids) {
    return ids
      .map(function (id) {
        return data.recommendItems.filter(function (item) {
          return item.id === id;
        })[0];
      })
      .filter(Boolean);
  }

  function renderFloors() {
    var host = $('[data-floors]');
    if (!host) {
      return;
    }

    host.innerHTML = data.floors
      .map(function (floor) {
        var items = resolveItems(floor.items)
          .map(function (item) {
            return mk.productCard(item);
          })
          .join('');

        return (
          '<section class="floor" aria-labelledby="floor-' +
          esc(floor.id) +
          '">' +
          '<div class="floor__head">' +
          '<h2 class="floor__title" id="floor-' +
          esc(floor.id) +
          '">' +
          esc(floor.title) +
          '</h2>' +
          '<span class="floor__desc">' +
          esc(floor.desc) +
          '</span>' +
          '</div>' +
          '<div class="floor__grid">' +
          '<div class="floor__feature">' +
          '<div>' +
          '<h3 class="floor__feature-title">' +
          esc(floor.feature.title) +
          '</h3>' +
          '<p class="floor__feature-desc">' +
          esc(floor.feature.desc) +
          '</p>' +
          '</div>' +
          '<div class="floor__feature-img">' +
          '<img src="' +
          esc(floor.feature.img) +
          '" alt="' +
          esc(floor.feature.title) +
          '" loading="lazy" width="300" height="225" />' +
          '</div>' +
          '</div>' +
          '<div class="product-grid">' +
          items +
          '</div>' +
          '</div>' +
          '</section>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     生活服务入口
     ------------------------------------------------------------------------ */
  function renderPromises() {
    var host = $('[data-promises]');
    if (!host) {
      return;
    }

    var services = [
      { icon: 'phone', title: '话费充值', desc: '最快 1 分钟到账' },
      { icon: 'truck', title: '机票酒店', desc: '天天低价 随心出行' },
      { icon: 'star', title: '电影演出', desc: '在线选座 极速出票' },
      { icon: 'wallet', title: '水电煤缴费', desc: '生活缴费一站办' },
      { icon: 'refresh', title: '以旧换新', desc: '高价回收 上门取件' }
    ];

    host.innerHTML = services
      .map(function (item) {
        return (
          '<a class="promise" href="#">' +
          '<span class="promise__icon">' +
          Mall.icon(item.icon) +
          '</span>' +
          '<span>' +
          '<span class="promise__title">' +
          esc(item.title) +
          '</span>' +
          '<span class="promise__desc">' +
          esc(item.desc) +
          '</span>' +
          '</span>' +
          '</a>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     品牌墙
     ------------------------------------------------------------------------ */
  function renderBrands() {
    var host = $('[data-brands]');
    if (!host) {
      return;
    }

    host.innerHTML = data.brands
      .map(function (brand) {
        return '<a class="brandwall__item" href="#">' + esc(brand) + '</a>';
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     启动
     ------------------------------------------------------------------------ */
  renderHero();
  renderCategories();
  renderAside();
  renderBannerRow();
  renderPromises();
  renderFlash();
  renderRecommend();
  renderFloors();
  renderBrands();

  Mall.boot({ active: 'home' });
})(window, document);
