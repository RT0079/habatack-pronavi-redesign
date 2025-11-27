document.addEventListener('DOMContentLoaded', () => {
  // ========= ハンバーガーメニュー =========
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.global-nav a');

  if (header && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('is-nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        header.classList.remove('is-nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ========= teacher セクション：スクロール演出 =========
  const teacherSection = document.querySelector('.teacher');
  const cards = Array.from(document.querySelectorAll('.teacher-list-card'));
  const messages = Array.from(document.querySelectorAll('.teacher-message-text'));

  if (teacherSection && cards.length && messages.length) {
    const steps = Math.min(cards.length, messages.length); // 4枚なら 4

    const setActive = (index) => {
      cards.forEach((card, i) => {
        const relative = i - index; // アクティブとの差分（0:本人, 1:1枚後ろ, 2:2枚後ろ…）

        const isActive = relative === 0;
        const isPast = relative < 0;

        card.classList.toggle('is-active', isActive);
        card.classList.toggle('is-past', isPast);

        if (isPast) {
          // すでに通り過ぎたカード → 下に落として透明に
          card.style.transform = 'translateY(40px) scale(0.85)';
          card.style.opacity = '0';
          card.style.zIndex = '0';
        } else if (isActive) {
          // 今一番手前に出すカード
          card.style.transform = 'translate(0px, 0px) scale(1)';
          card.style.opacity = '1';
          card.style.zIndex = '20';
        } else {
          // これから出てくる「後ろのカード」たち
          // アクティブのすぐ後ろに 2,3,4… がついてくる感じで配置
          const stepOffsetX = 40;   // 1枚後ろごとの横ずれ量
          const stepOffsetY = -40;  // 1枚後ろごとの縦ずれ量（上方向）
          const scaleStep = 0.04;   // 1枚後ろごとの縮小率

          const order = relative; // 1,2,3,...
          const x = stepOffsetX * order;
          const y = stepOffsetY * order;
          const scale = 1 - scaleStep * order; // 1, 0.96, 0.92, ...

          card.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
          card.style.opacity = '1';
          card.style.zIndex = String(20 - order); // 後ろに行くほど z-index を下げる
        }
      });

      // テキスト側も同じ index で切り替え
      messages.forEach((msg, i) => {
        msg.classList.toggle('is-active', i === index);
      });
    };

    const onScroll = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = teacherSection.offsetTop;
      // sticky が効いている間のスクロール量 = セクション高さ - 画面高さ
      const end = start + teacherSection.offsetHeight - vh;
      const scrollY = window.scrollY;

      let progress = (scrollY - start) / (end - start);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      let index = Math.floor(progress * steps);
      if (index >= steps) index = steps - 1;
      if (index < 0) index = 0;

      setActive(index);
    };

    // 初期状態＆イベント登録
    setActive(0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
});


 $(".slide-item").slick({
  slidesToShow: 1,
  centerMode: true,
  centerPadding: '0px',
  arrows: true,
  prevArrow: '<button class="slick-prev"></button>',
  nextArrow: '<button class="slick-next"></button>'
 });
 $(document).ready(function(){
  const imgHeight = $('.slide-item img').height();
  $('.slick-prev, .slick-next').css('top', imgHeight / 2 + 'px');
  $('.slick-prev').css({
    top: imgHeight / 2 + 'px',
    left: '-60px'   
  });
  $('.slick-next').css({
    top: imgHeight / 2 + 'px',
    right: '-60px'  
  });
});
