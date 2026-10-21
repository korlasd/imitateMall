/* ==========================================================================
   views/coupon.js — 领券中心视图
   领取状态写入 localStorage，刷新后仍保持「已领取」。
   ========================================================================== */
(function (window, document) {
  'use strict';

  var Mall = window.Mall;
  var data = Mall.data;
  var $ = Mall.$;
  var esc = Mall.esc;

  var CLAIM_KEY = 'imitateMall:claimedCoupons';

  /* ------------------------------------------------------------------------
     领取状态
     ------------------------------------------------------------------------ */
  function claimedIds() {
    try {
      var raw = window.localStorage.getItem(CLAIM_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (error) {
      return [];
    }
  }

  function claim(id) {
    var list = claimedIds();
    if (list.indexOf(id) === -1) {
      list.push(id);
      try {
        window.localStorage.setItem(CLAIM_KEY, JSON.stringify(list));
      } catch (error) {
        /* 忽略隐私模式下的写入失败 */
      }
    }
  }

  /* ------------------------------------------------------------------------
     统计
     ------------------------------------------------------------------------ */
  function renderStats() {
    var host = $('[data-coupon-stats]');
    if (!host) {
      return;
    }

    var total = data.coupons.length;
    var maxAmount = data.coupons.reduce(function (max, item) {
      return Math.max(max, item.amount);
    }, 0);
    var mine = claimedIds().length;

    var stats = [
      { num: total, label: '在领券张数' },
      { num: '¥' + maxAmount, label: '最高立减' },
      { num: mine, label: '已领取' }
    ];

    host.innerHTML = stats
      .map(function (item) {
        return (
          '<div class="stat">' +
          '<p class="stat__num">' +
          esc(item.num) +
          '</p>' +
          '<p class="stat__label">' +
          esc(item.label) +
          '</p>' +
          '</div>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     品类筛选（从数据中动态汇总，新增品类无需改代码）
     ------------------------------------------------------------------------ */
  var typeFilter = 'all';

  function allTypes() {
    var types = ['全部'];
    data.coupons.forEach(function (item) {
      if (types.indexOf(item.type) === -1) {
        types.push(item.type);
      }
    });
    return types;
  }

  function renderChips() {
    var host = $('[data-type-chips]');
    if (!host) {
      return;
    }

    host.innerHTML = allTypes()
      .map(function (type) {
        return (
          '<button type="button" class="chip' +
          (type === '全部' ? ' is-active' : '') +
          '" data-type="' +
          esc(type) +
          '">' +
          esc(type) +
          '</button>'
        );
      })
      .join('');
  }

  /* ------------------------------------------------------------------------
     券卡渲染
     ------------------------------------------------------------------------ */
  function couponCard(item) {
    var mine = claimedIds().indexOf(item.id) !== -1;
    var disabled = item.used || mine;
    var label = item.used ? '已使用' : mine ? '已领取' : '立即领取';

    return (
      '<article class="coupon' +
      (item.used ? ' is-used' : '') +
      '" data-coupon-id="' +
      esc(item.id) +
      '">' +
      '<div class="coupon__amount">' +
      '<span class="coupon__value">' +
      '<span class="coupon__value-symbol">¥</span>' +
      '<span class="coupon__value-num">' +
      esc(item.amount) +
      '</span>' +
      '</span>' +
      '<span class="coupon__threshold">满 ' +
      esc(item.threshold) +
      ' 元可用</span>' +
      '</div>' +
      '<div class="coupon__body">' +
      '<span class="coupon__type tag tag--brand">' +
      esc(item.type) +
      '</span>' +
      '<h3 class="coupon__title">' +
      esc(item.title) +
      '</h3>' +
      '<p class="coupon__meta">' +
      esc(item.scope) +
      '</p>' +
      '<div class="coupon__foot">' +
      '<span class="coupon__expire num">有效期至 ' +
      esc(item.expire) +
      '</span>' +
      '<button type="button" class="coupon__action" data-claim="' +
      esc(item.id) +
      '"' +
      (disabled ? ' disabled' : '') +
      '>' +
      label +
      '</button>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  function paintCoupons() {
    var grid = $('[data-coupon-grid]');
    var count = $('[data-coupon-count]');
    if (!grid) {
      return;
    }

    var items = data.coupons.filter(function (item) {
      return typeFilter === 'all' || item.type === typeFilter;
    });

    if (count) {
      count.textContent = '共 ' + items.length + ' 张可领取';
    }

    grid.innerHTML = items.length
      ? items.map(couponCard).join('')
      : '<p class="text-muted">该品类暂无优惠券，换个品类看看。</p>';
  }

  /* ------------------------------------------------------------------------
     交互
     ------------------------------------------------------------------------ */
  function bindEvents() {
    Mall.delegate(document, 'click', '[data-type]', function (event, button) {
      typeFilter = button.getAttribute('data-type');
      Mall.$$('[data-type]').forEach(function (node) {
        node.classList.toggle('is-active', node === button);
      });
      paintCoupons();
    });

    Mall.delegate(document, 'click', '[data-claim]', function (event, button) {
      if (button.hasAttribute('disabled')) {
        return;
      }

      var id = button.getAttribute('data-claim');
      var coupon = data.coupons.filter(function (item) {
        return item.id === id;
      })[0];

      claim(id);
      button.textContent = '已领取';
      button.setAttribute('disabled', 'disabled');

      if (coupon) {
        Mall.toast('领取成功：满 ' + coupon.threshold + ' 减 ' + coupon.amount);
      }

      renderStats();
    });
  }

  /* ------------------------------------------------------------------------
     启动
     ------------------------------------------------------------------------ */
  renderStats();
  renderChips();
  paintCoupons();
  bindEvents();

  Mall.boot({ active: 'coupon' });
})(window, document);
