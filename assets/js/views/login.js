/* ==========================================================================
   views/login.js — 登录页视图
   扫码 / 账户双模式切换、密码可见性、基础表单校验
   ========================================================================== */
(function (window, document) {
  'use strict';

  var Mall = window.Mall;
  var $ = Mall.$;
  var $$ = Mall.$$;

  /* ------------------------------------------------------------------------
     图标注入（避免在 HTML 里写死 SVG）
     ------------------------------------------------------------------------ */
  function paintIcons() {
    $$('[data-icon]').forEach(function (node) {
      var name = node.getAttribute('data-icon');
      var html = Mall.icon(name);
      if (html) {
        node.innerHTML = html;
      }
    });
  }

  /* ------------------------------------------------------------------------
     登录方式切换
     ------------------------------------------------------------------------ */
  function bindTabs() {
    Mall.delegate(document, 'click', '[data-tab]', function (event, button) {
      var tab = button.getAttribute('data-tab');

      $$('[data-tab]').forEach(function (node) {
        var active = node === button;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      $$('[data-panel]').forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-panel') !== tab;
      });

      if (tab === 'account') {
        var input = $('#login-account');
        if (input) {
          input.focus();
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     密码可见性切换
     ------------------------------------------------------------------------ */
  function bindPasswordToggle() {
    Mall.delegate(document, 'click', '[data-toggle-password]', function (event, button) {
      var input = $('#login-password');
      if (!input) {
        return;
      }

      var visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      button.textContent = visible ? '显示' : '隐藏';
      button.setAttribute('aria-label', visible ? '显示密码' : '隐藏密码');
    });
  }

  /* ------------------------------------------------------------------------
     表单校验与提交
     ------------------------------------------------------------------------ */
  function setError(field, message) {
    var wrapper = document.querySelector('[data-field="' + field + '"]');
    var errorNode = document.querySelector('[data-error-for="' + field + '"]');

    if (!wrapper || !errorNode) {
      return;
    }

    wrapper.classList.toggle('is-invalid', Boolean(message));
    errorNode.textContent = message || '';
  }

  function validate(account, password) {
    var ok = true;

    if (!account.value.trim()) {
      setError('account', '请输入邮箱、用户名或手机号');
      ok = false;
    } else {
      setError('account', '');
    }

    if (!password.value) {
      setError('password', '请输入登录密码');
      ok = false;
    } else if (password.value.length < 6) {
      setError('password', '密码长度不少于 6 位');
      ok = false;
    } else {
      setError('password', '');
    }

    return ok;
  }

  function bindForm() {
    var form = $('[data-login-form]');
    if (!form) {
      return;
    }

    var account = $('#login-account');
    var password = $('#login-password');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!validate(account, password)) {
        return;
      }

      var button = form.querySelector('.login-form__submit');
      if (button) {
        button.disabled = true;
        button.textContent = '登录中…';
      }

      // 静态演示：不发起真实请求，仅给出反馈
      window.setTimeout(function () {
        Mall.toast('登录成功（演示环境，未发起真实请求）');

        if (button) {
          button.disabled = false;
          button.textContent = '立即登录';
        }
      }, 600);
    });

    // 输入时清除对应错误提示
    [account, password].forEach(function (input) {
      if (!input) {
        return;
      }
      input.addEventListener('input', function () {
        setError(input.name, '');
      });
    });

    Mall.delegate(form, 'click', '[data-oauth]', function (event, button) {
      Mall.toast(button.getAttribute('data-oauth') + ' 登录为演示占位');
    });
  }

  /* ------------------------------------------------------------------------
     启动
     ------------------------------------------------------------------------ */
  paintIcons();
  bindTabs();
  bindPasswordToggle();
  bindForm();

  // 登录页不需要页头页脚组件，只挂载回到顶部与购物车徽标同步
  Mall.initBackTop();
})(window, document);
