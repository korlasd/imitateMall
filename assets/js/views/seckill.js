/* ==========================================================================
   views/seckill.js — 秒杀页视图
   ========================================================================== */
(function (window, document) {
  'use strict';

  var Mall = window.Mall;
  var data = Mall.data;
  var mk = Mall.markup;
  var $ = Mall.$;
  var esc = Mall.esc;

  /** 下一个整点场次（每 4 小时一场） */
  function nextSessionTime() {
    var now = new Date();
    var target = new Date(now.getTime());
    target.setMinutes(0, 0, 0);
    target.setHours((Math.floor(now.getHours() / 4) + 1) * 4);
    return target;
  }

  /* ------------------------------------------------------------------------
     场次时间轴
     ------------------------------------------------------------------------ */
  function renderSessions() {
    var host = $('[data-sessions]');
    if (!host) {
      return;
    }

    host.innerHTML = data.seckillSessions
      .map(function (session, index) {
        var isLive = session.status === 'live';
        return (
          '<button type="button" class="session' +
          (isLive ? ' is-live' : '') +
          (session.status === 'past' ? ' is-past' : '') +
          '" data-session="' +
          index +
          '">' +
          '<span class="session__time">' +
          esc(session.time) +
          '</span>' +
          '<span class="session__state">' +
          esc(session.state) +
          '</span>' +
          '</button>'
        );
      })
      .join('');

    Mall.delegate(host, 'click', '[data-session]', function (event, button) {
      var index = Number(button.getAttribute('data-session'));
      var session = data.seckillSessions[index];

      Mall.$$('[data-session]', host).forEach(function (node) {
        node.classList.toggle('is-live', node === button && session.status === 'live');
      });

      if (session.status === 'past') {
        Mall.toast(session.time + ' 场次已结束，明天再来');
      } else if (session.status === 'live') {
        Mall.toast(session.time + ' 场次正在抢购中');
      } else {
        Mall.toast(session.time + ' 场次即将开始，可提前加入提醒');
      }
    });
  }

  /* ------------------------------------------------------------------------
     商品栅格（按价格筛选）
     ------------------------------------------------------------------------ */
  var priceRange = 'all';

  function filterByPrice(items) {
    return items.filter(function (item) {
      if (priceRange === 'low') {
        return item.price < 100;
      }
      if (priceRange === 'mid') {
        return item.price >= 100 && item.price < 500;
      }
      if (priceRange === 'high') {
        return item.price >= 500;
      }
      return true;
    });
  }

  function paintGrid() {
    var grid = $('[data-seckill-grid]');
    var count = $('[data-seckill-count]');
    if (!grid) {
      return;
    }

    var items = filterByPrice(data.flashItems);

    if (count) {
      count.textContent = '共 ' + items.length + ' 件商品';
    }

    grid.innerHTML = items.length
      ? items
          .map(function (item) {
            return mk.seckillCard(item);
          })
          .join('')
      : '<p class="text-muted">该价位暂无缝杀商品，换个筛选条件试试。</p>';
  }

  function bindFilters() {
    Mall.delegate(document, 'click', '[data-price]', function (event, button) {
      priceRange = button.getAttribute('data-price');
      Mall.$$('[data-price]').forEach(function (node) {
        node.classList.toggle('is-active', node === button);
      });
      paintGrid();
    });
  }

  /* ------------------------------------------------------------------------
     启动
     ------------------------------------------------------------------------ */
  // 顶部倒计时指向下一场开抢时间
  var timerHost = document.querySelector('.page-hero [data-countdown]');
  if (timerHost) {
    timerHost.setAttribute('data-deadline', nextSessionTime().toISOString());
  }

  renderSessions();
  paintGrid();
  bindFilters();

  Mall.boot({ active: 'seckill' });
})(window, document);
