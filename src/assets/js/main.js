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

  // ========= teacher セクション：スクロール演出（PC）＋スライダー（SP） =========
  const teacherSection = document.querySelector('.teacher');
  const cards = Array.from(document.querySelectorAll('.teacher-list-card'));
  const messages = Array.from(document.querySelectorAll('.teacher-message-text'));
  const teacherMq = window.matchMedia('(max-width: 960px)');
  let teacherCleanup = () => {};

  const resetTeacherInline = () => {
    cards.forEach((card) => {
      card.removeAttribute('style');
      card.classList.remove('is-active', 'is-past');
    });
    messages.forEach((msg) => {
      msg.removeAttribute('style');
      msg.classList.remove('is-active');
    });
    teacherSection?.style.removeProperty('min-height');
  };

  const setTeacherHeight = () => {
    const steps = Math.min(cards.length, messages.length);
    // スクロール量を確保しつつ過剰に長くならないよう控えめに設定
    const perStep = 70; // 1ステップあたりの目安（vh）
    const base = 140;   // 最低確保高さ（vh）
    teacherSection.style.minHeight = `${Math.max(base, steps * perStep)}vh`;
  };

  const setupTeacherDesktop = () => {
    setTeacherHeight();

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
          const stepOffsetX = 0;    // 横方向はずらさず縦に重ねる
          const stepOffsetY = -40;  // 1枚後ろごとの縦ずれ量（上方向）
          const scaleStep = 0.06;   // 1枚後ろごとの縮小率で遠近感を強める

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
      const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0;
      const start = teacherSection.offsetTop - navOffset;
      // sticky が効いている間のスクロール量 = セクション高さ - (画面高さ - navOffset)
      const end = start + teacherSection.offsetHeight - (vh - navOffset);
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

    teacherCleanup = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  };

  const setupTeacherMobile = () => {
    teacherSection.style.minHeight = 'auto';

    const navClass = 'teacher-slider-nav';
    const leftCol = teacherSection.querySelector('.teacher-inner-left');
    let nav = teacherSection.querySelector(`.${navClass}`);
    if (!nav) {
      nav = document.createElement('div');
      nav.className = navClass;
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = `${navClass}__btn ${navClass}__btn--prev`;
      prev.setAttribute('aria-label', '前へ');
      const next = document.createElement('button');
      next.type = 'button';
      next.className = `${navClass}__btn ${navClass}__btn--next`;
      next.setAttribute('aria-label', '次へ');
      nav.append(prev, next);
    }
    if (leftCol && nav.parentElement !== leftCol) {
      leftCol.appendChild(nav);
    }
    const prevBtn = nav.querySelector(`.${navClass}__btn--prev`);
    const nextBtn = nav.querySelector(`.${navClass}__btn--next`);

    let idx = 0;
    const total = Math.min(cards.length, messages.length);

    const render = () => {
      cards.forEach((card, i) => {
        const show = i === idx;
        card.classList.remove('is-active', 'is-past');
        card.style.position = 'static';
        card.style.transform = 'none';
        card.style.opacity = show ? '1' : '0';
        card.style.display = show ? 'block' : 'none';
        card.style.pointerEvents = show ? 'auto' : 'none';
        card.style.zIndex = '1';
        card.style.margin = show ? '0 auto' : '0';
      });
      messages.forEach((msg, i) => {
        const active = i === idx;
        msg.classList.toggle('is-active', active);
        msg.style.display = active ? 'block' : 'none';
        msg.style.position = 'static';
      });
    };

    const go = (delta) => {
      idx = (idx + delta + total) % total;
      render();
    };

    const onPrev = () => go(-1);
    const onNext = () => go(1);

    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);

    render();

    teacherCleanup = () => {
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
    };
  };

  const initTeacher = () => {
    teacherCleanup();
    resetTeacherInline();
    if (!(teacherSection && cards.length && messages.length)) return;
    if (teacherMq.matches) {
      setupTeacherMobile();
    } else {
      setupTeacherDesktop();
    }
  };

  teacherMq.addEventListener('change', initTeacher);
  initTeacher();

  // ========= graduate-work セクション：左右交互にカードを切替 =========
  const graduateSection = document.querySelector('.graduate-work');
  const leftCards = graduateSection ? Array.from(graduateSection.querySelectorAll('.graduate-col--left .graduate-card')) : [];
  const rightCards = graduateSection ? Array.from(graduateSection.querySelectorAll('.graduate-col--right .graduate-card')) : [];
  const leftLinks = graduateSection ? Array.from(graduateSection.querySelectorAll('.graduate-col--left .graduate-link')) : [];
  const graduateMq = window.matchMedia('(max-width: 960px)');
  let graduateCleanup = () => {};

  const resetGraduateInline = () => {
    [...leftCards, ...rightCards].forEach((card) => {
      card.removeAttribute('style');
      card.classList.remove('is-active', 'is-past');
    });
    leftLinks.forEach((link) => link && link.removeAttribute('style'));
    const dotsWrap = graduateSection?.querySelector('.graduate-dots');
    if (dotsWrap) dotsWrap.remove();
    graduateSection?.style.removeProperty('min-height');
  };

  const setupGraduateDesktop = () => {
    if (!(graduateSection && leftCards.length && rightCards.length)) return;
    graduateSection.style.minHeight = '';
    const cardCount = Math.min(leftCards.length, rightCards.length);
    const transitions = Math.max(cardCount - 1, 1);
    const overlapStart = 0.9; // 次のスライドを始めるタイミング（90%）
    const phaseInterval = overlapStart * 2; // 同じ側が次に動くまでの間隔
    const totalSpan = transitions * phaseInterval + 1; // タイムライン全体の長さ（最後のカードが出きるまで）
    let ticking = false;

    const setSectionHeight = () => {
      const perUnit = 100;
      graduateSection.style.minHeight = `${totalSpan * perUnit}vh`;
    };

    const applyInterpolated = (cardsArr, activeIndex, frac) => {
      const last = cardsArr.length - 1;
      const nextIndex = Math.min(activeIndex + 1, last);
      const t = Math.min(Math.max(frac, 0), 1);
      const offY = 140; // 枠外からの出入り位置（%）

      cardsArr.forEach((card, idx) => {
        card.classList.remove('is-active', 'is-past');

        // 既に見終わったカードも枠内で静止させる（スライドアウトさせない）
        if (idx < activeIndex) {
          card.style.transform = 'translateY(0)';
          card.style.zIndex = '1';
          card.style.pointerEvents = 'none';
          return;
        }

        // まだ出番が先のカードは下で待機
        if (idx > activeIndex + 1) {
          card.style.transform = `translateY(${offY}%)`;
          card.style.zIndex = '0';
          card.style.pointerEvents = 'none';
          return;
        }

        // 現在表示中のカードは枠内に固定
        if (idx === activeIndex) {
          card.classList.add('is-active');
          card.style.transform = 'translateY(0)';
          card.style.zIndex = '4';
          card.style.pointerEvents = 'auto';
          return;
        }

        // 次に出るカードを下からスライドイン
        if (idx === nextIndex) {
          card.style.transform = `translateY(${offY * (1 - t)}%)`; // 140%→0%
          card.style.zIndex = '5';
          card.style.pointerEvents = 'none';
        }
      });
    };

    // タイムライン上の時間t（0〜totalSpan）に応じて、特定側のカードを動かす
    const driveSide = (cardsArr, t, offset) => {
      const steps = cardsArr.length - 1;
      const local = t - offset;

      // まだ始まっていない場合: 最初のカードを固定
      if (local < 0) {
        applyInterpolated(cardsArr, 0, 0);
        return;
      }

      // 全て完了: 最終カードで静止
      const endTime = steps * phaseInterval + 1; // 最後のアニメ duration=1
      if (local >= endTime) {
        applyInterpolated(cardsArr, steps, 1);
        return;
      }

      const stepIdx = Math.floor(local / phaseInterval);
      const frac = Math.min(Math.max(local - stepIdx * phaseInterval, 0), 1); // 各フェーズの0〜1
      applyInterpolated(cardsArr, stepIdx, frac);
    };

    const update = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = graduateSection.offsetTop;
      const sectionHeight = graduateSection.offsetHeight;
      const end = start + sectionHeight - vh;
      const scrollY = window.scrollY;

      let progress = (scrollY - start) / (end - start || 1);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // タイムライン時間（0〜totalSpan）に変換
      const timelineT = progress * totalSpan;

      // 左を先行、0.9経過で右を開始。右が0.9経過で次の左が開始…を繰り返す
      driveSide(leftCards, timelineT, 0);
      driveSide(rightCards, timelineT, overlapStart);
      ticking = false;
    };

    const onScrollGraduate = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    setSectionHeight();
    update();
    window.addEventListener('scroll', onScrollGraduate, { passive: true });
    window.addEventListener('resize', () => {
      setSectionHeight();
      update();
    });

    graduateCleanup = () => {
      window.removeEventListener('scroll', onScrollGraduate);
      window.removeEventListener('resize', setSectionHeight);
    };
  };

  const setupGraduateMobile = () => {
    if (!graduateSection || !leftCards.length) return;
    graduateSection.style.minHeight = 'auto';

    // 右カラムは非表示（CSSでも非表示だが念のため）
    rightCards.forEach(card => {
      card.style.display = 'none';
    });

    const cardsArr = leftCards;
    let idx = 0;
    const total = cardsArr.length;
    const linksArr = leftLinks.slice(0, total);

    // ドット生成
    const dotsClass = 'graduate-dots';
    let dotsWrap = graduateSection.querySelector(`.${dotsClass}`);
    if (!dotsWrap) {
      dotsWrap = document.createElement('div');
      dotsWrap.className = dotsClass;
      graduateSection.appendChild(dotsWrap);
    }
    dotsWrap.innerHTML = '';
    const dots = [];
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `${dotsClass}__dot`;
      dotsWrap.appendChild(btn);
      dots.push(btn);
    }

    // ナビ（左右矢印）は左カラム内に生成済みのものを利用
    const nav = graduateSection.querySelector('.graduate-slider-nav');
    const prevBtn = nav ? nav.querySelector('.teacher-slider-nav__btn--prev') : null;
    const nextBtn = nav ? nav.querySelector('.teacher-slider-nav__btn--next') : null;

    const render = () => {
      cardsArr.forEach((card, i) => {
        const show = i === idx;
        card.classList.remove('is-active', 'is-past');
        card.style.position = 'static';
        card.style.transform = 'none';
        card.style.opacity = show ? '1' : '0';
        card.style.display = show ? 'block' : 'none';
        card.style.pointerEvents = show ? 'auto' : 'none';
        card.style.zIndex = '1';
        card.style.margin = show ? '0 auto' : '0';
      });
      linksArr.forEach((link, i) => {
        if (!link) return;
        link.style.display = i === idx ? 'block' : 'none';
      });
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === idx);
      });
    };

    const go = (delta) => {
      idx = (idx + delta + total) % total;
      render();
    };

    // ドットクリック
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        idx = i;
        render();
      });
    });

    // 矢印
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    if (prevBtn) prevBtn.addEventListener('click', onPrev);
    if (nextBtn) nextBtn.addEventListener('click', onNext);

    // スワイプ
    let startX = 0;
    let distX = 0;
    const threshold = 40;
    const slideArea = graduateSection;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      distX = 0;
    };
    const onTouchMove = (e) => {
      distX = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
      if (Math.abs(distX) > threshold) {
        if (distX < 0) go(1);
        else go(-1);
      }
    };

    slideArea.addEventListener('touchstart', onTouchStart, { passive: true });
    slideArea.addEventListener('touchmove', onTouchMove, { passive: true });
    slideArea.addEventListener('touchend', onTouchEnd);

    render();

    graduateCleanup = () => {
      resetGraduateInline();
      dots.forEach((d) => d.replaceWith(d.cloneNode(true)));
      if (prevBtn) prevBtn.removeEventListener('click', onPrev);
      if (nextBtn) nextBtn.removeEventListener('click', onNext);
      slideArea.removeEventListener('touchstart', onTouchStart);
      slideArea.removeEventListener('touchmove', onTouchMove);
      slideArea.removeEventListener('touchend', onTouchEnd);
    };
  };

  const initGraduate = () => {
    graduateCleanup();
    if (!(graduateSection && leftCards.length)) return;
    if (graduateMq.matches) {
      setupGraduateMobile();
    } else {
      setupGraduateDesktop();
    }
  };

  graduateMq.addEventListener('change', initGraduate);
  initGraduate();
});




 $(".slide-item").slick({
  slidesToShow: 1,
  centerMode: true,
  centerPadding: '0px',
  arrows: true,
  prevArrow: '<button class="slick-prev"></button>',
  nextArrow: '<button class="slick-next"></button>',
  responsive: [
    {
      breakpoint: 960,
      settings : {
        arrows: true,
        centerPadding: '20px',
      }
    },
    {
      breakpoint: 640,
      setting : {
        arrows: true,
        centerPadding: '10px',
      }
    }
  ]
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

// FAQのアコーディオン
$(function() {
  $(".faq-question").on("click", function() {
    const answer = $(this).next(".faq-answer");
    const toggle = $(this).find(".faq-taggle");

    toggle.toggleClass('open');                 
    answer.stop(true, true).slideToggle();
  });
});

