/* ==========================================================================
   markup.js — 渲染辅助
   把重复的商品卡、价格、标签等 HTML 片段集中管理，视图层只负责组装。
   ========================================================================== */
(function (window) {
  'use strict';

  var Mall = window.Mall || (window.Mall = {});
  var esc = Mall.esc;
  var splitPrice = Mall.splitPrice;

  /** 价格：¥ 符号 + 整数 + 小数，分级排版 */
  function price(value, options) {
    var settings = options || {};
    var parts = splitPrice(value);
    var className = settings.large ? 'price price--lg' : 'price';
    var html =
      '<span class="' +
      className +
      '">' +
      '<span class="price__symbol">¥</span>' +
      '<span class="price__int">' +
      parts.int +
      '</span>' +
      '<span class="price__dec">.' +
      parts.dec +
      '</span>';

    if (settings.origin) {
      html +=
        '<span class="price__origin">¥' + splitPrice(settings.origin).int + '</span>';
    }

    return html + '</span>';
  }

  /** 标签 */
  function tag(text, variant) {
    if (!text) {
      return '';
    }
    return (
      '<span class="tag tag--' + (variant || 'brand') + '">' + esc(text) + '</span>'
    );
  }

  /** 商品卡（推荐位 / 楼层通用） */
  function productCard(item) {
    return (
      '<article class="product">' +
      '<a class="product__media" href="#" aria-label="' +
      esc(item.name) +
      '">' +
      (item.tag
        ? '<span class="product__badge">' + tag(item.tag, 'solid') + '</span>'
        : '') +
      '<img src="' +
      esc(item.img) +
      '" alt="' +
      esc(item.name) +
      '" loading="lazy" width="300" height="300" />' +
      '</a>' +
      '<div class="product__body">' +
      '<a class="product__title" href="#">' +
      esc(item.name) +
      '</a>' +
      '<div class="product__meta">' +
      '<span class="ellipsis">' +
      esc(item.shop || '京选自营') +
      '</span>' +
      (item.comments
        ? '<span aria-hidden="true">·</span><span>' +
          esc(item.comments) +
          ' 条评价</span>'
        : '') +
      '</div>' +
      '<div class="product__foot">' +
      price(item.price, { origin: item.origin }) +
      '<button class="product__cart" type="button" data-add-cart data-id="' +
      esc(item.id) +
      '" data-name="' +
      esc(item.name) +
      '">加入购物车</button>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  /** 秒杀横向卡（首页秒杀专区） */
  function flashCard(item) {
    return (
      '<a class="flash__item" href="jd_miaosha.html">' +
      '<span class="product__media">' +
      '<img src="' +
      esc(item.img) +
      '" alt="' +
      esc(item.name) +
      '" loading="lazy" width="280" height="280" />' +
      '</span>' +
      '<span class="flash__item-name">' +
      esc(item.name) +
      '</span>' +
      '<span class="flash__price">' +
      price(item.price, { origin: item.origin }) +
      '</span>' +
      '</a>'
    );
  }

  /** 秒杀卡片（秒杀页，含库存进度） */
  function seckillCard(item) {
    var sold = Math.min(100, Math.max(0, Number(item.sold) || 0));
    var soldOut = sold >= 100;

    return (
      '<article class="seckill-card' +
      (soldOut ? ' is-soldout' : '') +
      '">' +
      '<a class="seckill-card__media" href="#" aria-label="' +
      esc(item.name) +
      '">' +
      '<img src="' +
      esc(item.img) +
      '" alt="' +
      esc(item.name) +
      '" loading="lazy" width="280" height="280" />' +
      '<span class="seckill-card__stock">' +
      '<span>已抢 ' +
      sold +
      '%</span>' +
      '<span class="progress"><span class="progress__bar" style="width:' +
      sold +
      '%"></span></span>' +
      '</span>' +
      '</a>' +
      '<div class="seckill-card__body">' +
      '<a class="seckill-card__name" href="#">' +
      esc(item.name) +
      '</a>' +
      '<div class="seckill-card__foot">' +
      price(item.price, { origin: item.origin, large: true }) +
      '<button class="seckill-card__rush" type="button" data-add-cart data-id="' +
      esc(item.id) +
      '" data-name="' +
      esc(item.name) +
      '"' +
      (soldOut ? ' disabled' : '') +
      '>' +
      (soldOut ? '已抢光' : '立即抢购') +
      '</button>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  Mall.markup = {
    price: price,
    tag: tag,
    productCard: productCard,
    flashCard: flashCard,
    seckillCard: seckillCard
  };
})(window);
