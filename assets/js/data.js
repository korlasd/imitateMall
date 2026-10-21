/* ==========================================================================
   data.js — 页面数据源
   重构要点：把原先散落在 HTML 中重复数千行的分类菜单与商品卡抽象为数据，
   由视图层统一渲染，后续增删条目只需改这里。
   ========================================================================== */
(function (window) {
  'use strict';

  var Mall = window.Mall || (window.Mall = {});

  /* ------------------------------------------------------------------------
     商品分类（左侧栏 + 飞出面板）
     ------------------------------------------------------------------------ */
  var categories = [
    {
      name: '家用电器',
      icon: 'grid',
      groups: [
        { label: '大家电', items: ['电视', '空调', '冰箱', '洗衣机', '冷柜', '热水器'] },
        { label: '厨房电器', items: ['油烟机', '燃气灶', '消毒柜', '洗碗机', '微波炉'] },
        { label: '生活电器', items: ['净化器', '吸尘器', '电风扇', '加湿器', '除湿机'] }
      ],
      links: ['家电馆', '家电专卖店', '以旧换新', '企业采购']
    },
    {
      name: '手机 / 运营商 / 数码',
      icon: 'phone',
      groups: [
        { label: '手机通讯', items: ['5G手机', '全面屏', '游戏手机', '老人机', '对讲机'] },
        { label: '手机配件', items: ['充电器', '数据线', '手机壳', '移动电源', '耳机'] },
        { label: '数码', items: ['相机', '摄像机', '智能手表', '运动相机', '无人机'] }
      ],
      links: ['手机馆', '以旧换新', '数码服务']
    },
    {
      name: '电脑 / 办公',
      icon: 'grid',
      groups: [
        { label: '电脑整机', items: ['笔记本', '游戏本', '台式机', '一体机', '服务器'] },
        { label: '电脑配件', items: ['显卡', '主板', '内存', '固态硬盘', '机箱电源'] },
        { label: '外设办公', items: ['显示器', '键鼠', '打印机', '投影仪', '办公文具'] }
      ],
      links: ['电脑馆', 'DIY装机', '企业采购']
    },
    {
      name: '家居 / 家具 / 家装 / 厨具',
      icon: 'grid',
      groups: [
        { label: '家纺', items: ['四件套', '被子', '枕芯', '毛毯', '蚊帐'] },
        { label: '家具', items: ['沙发', '床', '衣柜', '餐桌', '书桌'] },
        { label: '厨具', items: ['炒锅', '刀具', '餐具', '保温杯', '收纳'] }
      ],
      links: ['家装城', '设计服务', '安装服务']
    },
    {
      name: '男装 / 女装 / 童装 / 内衣',
      icon: 'grid',
      groups: [
        { label: '女装', items: ['衬衫', '连衣裙', '针织衫', '外套', '半身裙'] },
        { label: '男装', items: ['T恤', '衬衫', '夹克', '西服', '卫衣'] },
        { label: '内衣童装', items: ['文胸', '家居服', '童装', '童鞋', '校服'] }
      ],
      links: ['服饰馆', '新品首发', '品牌闪购']
    },
    {
      name: '美妆 / 个护清洁 / 宠物',
      icon: 'star',
      groups: [
        { label: '美妆护肤', items: ['面膜', '精华', '面霜', '口红', '香水'] },
        { label: '个人护理', items: ['洗发水', '沐浴露', '牙膏', '剃须刀', '吹风机'] },
        { label: '宠物生活', items: ['狗粮', '猫粮', '猫砂', '宠物零食', '驱虫'] }
      ],
      links: ['美妆馆', '正品保障', '临期清仓']
    },
    {
      name: '女鞋 / 箱包 / 钟表 / 珠宝',
      icon: 'star',
      groups: [
        { label: '女鞋', items: ['单鞋', '高跟鞋', '靴子', '凉鞋', '帆布鞋'] },
        { label: '箱包', items: ['双肩包', '单肩包', '行李箱', '钱包', '手提包'] },
        { label: '钟表珠宝', items: ['机械表', '石英表', '项链', '手链', '戒指'] }
      ],
      links: ['鞋靴馆', '珠宝城', '鉴定服务']
    },
    {
      name: '男鞋 / 运动 / 户外',
      icon: 'truckFast',
      groups: [
        { label: '男鞋', items: ['运动鞋', '板鞋', '皮鞋', '凉鞋', '工装鞋'] },
        { label: '运动', items: ['跑步鞋', '篮球鞋', '瑜伽', '健身器材', '骑行'] },
        { label: '户外', items: ['冲锋衣', '登山鞋', '帐篷', '睡袋', '登山杖'] }
      ],
      links: ['运动馆', '户外装备', '专业测评']
    },
    {
      name: '房产 / 汽车 / 汽车用品',
      icon: 'grid',
      groups: [
        { label: '汽车用品', items: ['脚垫', '车衣', '行车记录仪', '车载支架', '洗车机'] },
        { label: '汽车服务', items: ['保养', '轮胎', '贴膜', '救援', '洗车'] },
        { label: '房产', items: ['新房', '二手房', '租房', '装修', '家居'] }
      ],
      links: ['汽车馆', '京车会', '养车服务']
    },
    {
      name: '母婴 / 玩具乐器',
      icon: 'star',
      groups: [
        { label: '奶粉辅食', items: ['婴儿奶粉', '米粉', '果泥', '磨牙棒', '营养品'] },
        { label: '尿裤湿巾', items: ['纸尿裤', '拉拉裤', '湿巾', '护理垫', '隔尿垫'] },
        { label: '玩具乐器', items: ['积木', '毛绒玩具', '模型', '民乐', '键盘乐器'] }
      ],
      links: ['母婴馆', '童书', '早教']
    },
    {
      name: '食品 / 酒类 / 生鲜 / 特产',
      icon: 'wallet',
      groups: [
        { label: '休闲食品', items: ['坚果', '糕点', '肉干', '糖果', '饼干'] },
        { label: '酒类', items: ['白酒', '葡萄酒', '啤酒', '黄酒', '洋酒'] },
        { label: '生鲜', items: ['水果', '蔬菜', '海鲜', '牛羊肉', '禽蛋'] }
      ],
      links: ['食品馆', '京东超市', '地方特产']
    },
    {
      name: '艺术 / 礼品鲜花 / 农资绿植',
      icon: 'star',
      groups: [
        { label: '礼品', items: ['鲜花', '蛋糕', '礼品卡', '定制礼品', '节庆礼盒'] },
        { label: '艺术', items: ['书画', '陶瓷', '文玩', '邮币', '收藏'] },
        { label: '农资绿植', items: ['种子', '化肥', '绿植', '花盆', '园艺工具'] }
      ],
      links: ['礼品城', '鲜花速递', '艺术收藏']
    },
    {
      name: '医药保健 / 计生情趣',
      icon: 'shield',
      groups: [
        { label: '保健', items: ['维生素', '蛋白粉', '鱼油', '益生菌', '钙片'] },
        { label: '医疗器械', items: ['血压计', '血糖仪', '雾化器', '轮椅', '理疗仪'] },
        { label: '计生用品', items: ['避孕套', '验孕棒', '润滑剂', '情趣用品', '私处护理'] }
      ],
      links: ['大药房', '在线问诊', '健康管理']
    },
    {
      name: '图书 / 文娱 / 教育 / 电子书',
      icon: 'star',
      groups: [
        { label: '图书', items: ['小说', '文学', '经管', '童书', '教辅'] },
        { label: '文娱', items: ['乐器', '音像', '文创', '手办', '模型'] },
        { label: '教育', items: ['在线课程', '考试培训', '外语学习', '职业培训', '电子书'] }
      ],
      links: ['图书城', '数字阅读', '教育培训']
    },
    {
      name: '机票 / 酒店 / 旅游 / 生活',
      icon: 'truck',
      groups: [
        { label: '交通', items: ['机票', '火车票', '汽车票', '租车', '接送机'] },
        { label: '住宿', items: ['酒店', '民宿', '公寓', '钟点房', '温泉'] },
        { label: '生活服务', items: ['电影票', '演出票', '家政', '洗衣', '维修'] }
      ],
      links: ['旅行预订', '生活服务', '企业差旅']
    },
    {
      name: '理财 / 众筹 / 白条 / 保险',
      icon: 'wallet',
      groups: [
        { label: '理财', items: ['活期理财', '定期理财', '基金', '黄金', '股票'] },
        { label: '信用', items: ['京东白条', '分期免息', '信用购', '先享后付', '额度提升'] },
        { label: '保险', items: ['意外险', '医疗险', '重疾险', '旅行险', '车险'] }
      ],
      links: ['京东金融', '众筹', '保险服务']
    }
  ];

  /* ------------------------------------------------------------------------
     首页主视觉
     ------------------------------------------------------------------------ */
  var heroSlides = [
    { img: 'img/page4/1.jpg', alt: '秋季家电换新专场，满 1000 减 100' },
    { img: 'img/page4/2.jpg', alt: '数码新品首发，以旧换新最高补贴 800 元' },
    { img: 'img/page4/3.jpg', alt: '家居生活节，精选好物低至五折' },
    { img: 'img/page4/4.jpg', alt: '服饰新品上新，第二件半价' },
    { img: 'img/page4/5.jpg', alt: '超市囤货季，满 199 减 100' },
    { img: 'img/page4/6.jpg', alt: '生鲜产地直发，最快次日达' },
    { img: 'img/page4/7.jpg', alt: '会员专享日，PLUS 额外立减' }
  ];

  var bannerRow = [
    {
      tone: 'gold',
      eyebrow: '今日推荐',
      title: '发现好货',
      desc: '探索新生活，每一口都新鲜',
      cta: '立即查看',
      img: 'img/page7/1.png',
      alt: '发现好货'
    },
    {
      tone: 'ink',
      eyebrow: '办公优选',
      title: '电脑好物集',
      desc: '轻薄本 / 游戏本 / 显示器直降',
      cta: '进入专区',
      img: 'img/page9/1.png',
      alt: '电脑办公 电脑好物集'
    },
    {
      tone: 'jade',
      eyebrow: '大牌捡漏',
      title: '拍拍二手',
      desc: '官方质检，一元起拍',
      cta: '去捡漏',
      img: 'img/page9/2.png',
      alt: '拍拍二手 大牌捡漏一元起拍'
    }
  ];

  /* ------------------------------------------------------------------------
     秒杀商品
     ------------------------------------------------------------------------ */
  var flashItems = [
    {
      id: 'f-1',
      name: '稻香村 中秋月饼礼盒 经典八味 800g',
      img: 'img/page5/1.jpg',
      price: 28,
      origin: 59,
      sold: 82
    },
    {
      id: 'f-2',
      name: '家用高压洗车机 便携无线清洗机 全套配件',
      img: 'img/page5/3.jpg',
      price: 199,
      origin: 359,
      sold: 67
    },
    {
      id: 'f-3',
      name: '5G 全网通智能手机 8GB+256GB 幻夜黑',
      img: 'img/page5/4.jpg',
      price: 1299,
      origin: 1699,
      sold: 91
    },
    {
      id: 'f-4',
      name: '轻质透气运动小白鞋 男女同款',
      img: 'img/page5/5.jpg',
      price: 119,
      origin: 259,
      sold: 74
    },
    {
      id: 'f-5',
      name: '超轻钛合金防蓝光眼镜 商务方框',
      img: 'img/page5/6.jpg',
      price: 89,
      origin: 199,
      sold: 58
    },
    {
      id: 'f-6',
      name: '大益普洱茶饼 熟茶 357g 经典配方',
      img: 'img/page5/7.jpg',
      price: 128,
      origin: 268,
      sold: 45
    },
    {
      id: 'f-7',
      name: '足金锁骨链 黄金项链 简约百搭款',
      img: 'img/page5/8.jpg',
      price: 1580,
      origin: 1980,
      sold: 36
    },
    {
      id: 'f-8',
      name: '高腰直筒牛仔裤 复古水洗 显瘦版型',
      img: 'img/page6/1.jpg',
      price: 149,
      origin: 299,
      sold: 63
    },
    {
      id: 'f-9',
      name: '全身水洗电动剃须刀 三刀头 快充',
      img: 'img/page6/left5.jpg',
      price: 159,
      origin: 329,
      sold: 71
    },
    {
      id: 'f-10',
      name: '耐热玻璃茶具套装 家用泡茶器',
      img: 'img/page6/left2.jpg',
      price: 69,
      origin: 149,
      sold: 54
    }
  ];

  /* ------------------------------------------------------------------------
     推荐商品
     ------------------------------------------------------------------------ */
  var recommendItems = [
    {
      id: 'p-1',
      name: '法式小众设计感衬衫 女 秋季新款 宽松显瘦',
      img: 'img/page6/left3.jpg',
      price: 169,
      origin: 329,
      shop: '京选服饰旗舰店',
      comments: '2.1万',
      tag: '新品'
    },
    {
      id: 'p-2',
      name: '珀莱雅 双抗精华面膜套装 补水保湿 20 片',
      img: 'img/page6/left4.jpg',
      price: 139,
      origin: 259,
      shop: '珀莱雅官方旗舰店',
      comments: '8.6万',
      tag: '热销'
    },
    {
      id: 'p-3',
      name: '电动剃须刀 全身水洗 三刀头 带鬓角刀',
      img: 'img/page6/left5.jpg',
      price: 159,
      origin: 329,
      shop: '京选个护专营店',
      comments: '1.4万',
      tag: ''
    },
    {
      id: 'p-4',
      name: '川味手工香肠 500g 真空装 农家风味',
      img: 'img/page6/left6.jpg',
      price: 59,
      origin: 99,
      shop: '蜀香食品专营店',
      comments: '3.2万',
      tag: '产地直发'
    },
    {
      id: 'p-5',
      name: '洽洽 大颗粒葵花籽 500g 原味瓜子',
      img: 'img/page6/left7.jpg',
      price: 26.9,
      origin: 39.9,
      shop: '洽洽食品官方旗舰店',
      comments: '12万',
      tag: '满减'
    },
    {
      id: 'p-6',
      name: '怀旧干脆面 混合口味 30 包装 整箱',
      img: 'img/page6/left8.jpg',
      price: 29.9,
      origin: 49.9,
      shop: '零食优选专营店',
      comments: '6.7万',
      tag: ''
    },
    {
      id: 'p-7',
      name: '黄龙松 猪肉松 原味 250g 佐餐下饭',
      img: 'img/page6/left9.jpg',
      price: 45,
      origin: 79,
      shop: '黄龙食品旗舰店',
      comments: '9800',
      tag: ''
    },
    {
      id: 'p-8',
      name: '煌上煌 腊味礼盒 1.2kg 腊肉香肠组合',
      img: 'img/page6/left10.jpg',
      price: 168,
      origin: 268,
      shop: '煌上煌官方旗舰店',
      comments: '1.1万',
      tag: '礼盒'
    },
    {
      id: 'p-9',
      name: '美的 大 1.5 匹 变频立式空调 一级能效',
      img: 'img/page9/4.jpg',
      price: 4299,
      origin: 4999,
      shop: '美的空调旗舰店',
      comments: '4.5万',
      tag: '以旧换新'
    },
    {
      id: 'p-10',
      name: '天梭 力洛克系列 机械男表 钢带 39mm',
      img: 'img/page9/5.jpg',
      price: 3699,
      origin: 4200,
      shop: '天梭腕表官方旗舰店',
      comments: '7600',
      tag: '正品'
    },
    {
      id: 'p-11',
      name: '复古拼色运动鞋 男女同款 舒适缓震',
      img: 'img/page9/7.jpg',
      price: 329,
      origin: 599,
      shop: '京选运动专营店',
      comments: '3.8万',
      tag: '满减'
    },
    {
      id: 'p-12',
      name: '轻量缓震跑步鞋 透气网面 日常训练',
      img: 'img/page9/8.jpg',
      price: 289,
      origin: 499,
      shop: '京选运动专营店',
      comments: '2.6万',
      tag: ''
    },
    {
      id: 'p-13',
      name: '康宝 嵌入式消毒柜 100L 双层大容量',
      img: 'img/page9/9.jpg',
      price: 1899,
      origin: 2499,
      shop: '康宝厨电旗舰店',
      comments: '8900',
      tag: '包安装'
    },
    {
      id: 'p-14',
      name: '稻香村 中秋月饼礼盒 经典八味 800g',
      img: 'img/page5/1.jpg',
      price: 28,
      origin: 59,
      shop: '稻香村食品旗舰店',
      comments: '15万',
      tag: '秒杀'
    },
    {
      id: 'p-15',
      name: '家用高压洗车机 便携无线清洗机',
      img: 'img/page5/3.jpg',
      price: 199,
      origin: 359,
      shop: '京选车品专营店',
      comments: '1.9万',
      tag: ''
    }
  ];

  /* ------------------------------------------------------------------------
     楼层数据（按品类分组的商品）
     ------------------------------------------------------------------------ */
  var floors = [
    {
      id: 'digital',
      title: '数码电器',
      desc: '潮流新品 · 以旧换新补贴',
      feature: {
        title: '电脑办公好物集',
        desc: '轻薄本 / 游戏本 / 显示器，最高立减 800 元',
        img: 'img/page9/1.png',
        href: '#'
      },
      items: ['p-9', 'p-10', 'p-13', 'p-3', 'p-15']
    },
    {
      id: 'lifestyle',
      title: '生鲜食品',
      desc: '产地直发 · 最快次日达',
      feature: {
        title: '生鲜产地直发',
        desc: '从基地到餐桌，最快次日达',
        img: 'img/page6/left6.jpg',
        href: '#'
      },
      items: ['p-4', 'p-5', 'p-6', 'p-7', 'p-8']
    }
  ];

  /* ------------------------------------------------------------------------
     优惠券
     ------------------------------------------------------------------------ */
  var coupons = [
    {
      id: 'c-1',
      amount: 100,
      threshold: 1000,
      type: '全品类',
      title: '全场通用券，可与店铺券叠加',
      scope: '京东自营及第三方店铺通用',
      expire: '2026-11-11',
      used: false
    },
    {
      id: 'c-2',
      amount: 50,
      threshold: 499,
      type: '家电',
      title: '家电品类券，空调冰箱洗衣机可用',
      scope: '限家用电器类目自营商品',
      expire: '2026-11-30',
      used: false
    },
    {
      id: 'c-3',
      amount: 30,
      threshold: 199,
      type: '超市',
      title: '京东超市囤货券，食品酒水通用',
      scope: '限京东超市自营商品',
      expire: '2026-11-05',
      used: false
    },
    {
      id: 'c-4',
      amount: 20,
      threshold: 129,
      type: '生鲜',
      title: '生鲜尝鲜券，水果海鲜均可使用',
      scope: '限生鲜类目，产地直发商品',
      expire: '2026-11-08',
      used: false
    },
    {
      id: 'c-5',
      amount: 15,
      threshold: 99,
      type: '服饰',
      title: '服饰鞋靴券，新品同样可用',
      scope: '限服饰鞋靴类目',
      expire: '2026-11-20',
      used: false
    },
    {
      id: 'c-6',
      amount: 200,
      threshold: 2000,
      type: '数码',
      title: '数码大额券，手机电脑相机可用',
      scope: '限数码类目自营商品',
      expire: '2026-11-11',
      used: false
    },
    {
      id: 'c-7',
      amount: 10,
      threshold: 59,
      type: '全品类',
      title: '新人首单立减券',
      scope: '新用户首单专享，每个账号限用一次',
      expire: '2026-11-01',
      used: false
    },
    {
      id: 'c-8',
      amount: 40,
      threshold: 299,
      type: '个护',
      title: '美妆个护券，面膜精华可用',
      scope: '限美妆个护类目',
      expire: '2026-11-15',
      used: false
    },
    {
      id: 'c-9',
      amount: 25,
      threshold: 159,
      type: '母婴',
      title: '母婴用品券，奶粉尿裤可用',
      scope: '限母婴类目，不含进口奶粉',
      expire: '2026-11-25',
      used: true
    },
    {
      id: 'c-10',
      amount: 60,
      threshold: 599,
      type: '家居',
      title: '家居日用券，床品厨具可用',
      scope: '限家居日用类目',
      expire: '2026-11-18',
      used: false
    },
    {
      id: 'c-11',
      amount: 35,
      threshold: 199,
      type: '图书',
      title: '图书文娱券，满 199 减 35',
      scope: '限图书文娱类目',
      expire: '2026-12-31',
      used: false
    },
    {
      id: 'c-12',
      amount: 88,
      threshold: 888,
      type: 'PLUS会员',
      title: 'PLUS 专享券，额外叠加上不封顶',
      scope: '仅限 PLUS 会员领取使用',
      expire: '2026-11-11',
      used: false
    }
  ];

  /* ------------------------------------------------------------------------
     秒杀场次
     ------------------------------------------------------------------------ */
  var seckillSessions = [
    { time: '00:00', state: '已结束', status: 'past' },
    { time: '08:00', state: '已结束', status: 'past' },
    { time: '12:00', state: '抢购中', status: 'live' },
    { time: '16:00', state: '即将开始', status: 'upcoming' },
    { time: '20:00', state: '即将开始', status: 'upcoming' }
  ];

  /* ------------------------------------------------------------------------
     公告 / 品牌
     ------------------------------------------------------------------------ */
  var news = [
    { tag: '公告', text: '秋季家电换新补贴上线，最高补贴 800 元' },
    { tag: '公告', text: 'PLUS 会员日：每月 8 日额外 95 折' },
    { tag: '公告', text: '拍拍二手以旧换新服务已覆盖全国 200 城' },
    { tag: '公告', text: '生鲜产地直发专区新增 30 个县域基地' },
    { tag: '公告', text: '关于严厉打击假冒商品的治理公告' }
  ];

  var brands = [
    '美的 Midea',
    '海尔 Haier',
    '格力 GREE',
    '小米 Xiaomi',
    '华为 HUAWEI',
    '联想 Lenovo',
    '戴森 Dyson',
    '耐克 Nike',
    '老板 ROBAM',
    '伊利 YILI',
    '天梭 TISSOT',
    '康宝 Canbo'
  ];

  Mall.data = {
    categories: categories,
    heroSlides: heroSlides,
    bannerRow: bannerRow,
    flashItems: flashItems,
    recommendItems: recommendItems,
    floors: floors,
    coupons: coupons,
    seckillSessions: seckillSessions,
    news: news,
    brands: brands
  };
})(window);
