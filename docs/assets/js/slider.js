$(function () {
  $('.slider').slick({
    slidesToShow: 3,          // 3枚見せる
    centerMode: true,         // 真ん中を中心に配置
    centerPadding: '80px',    // ← 左右見切れの量（調整OK）
    infinite: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          centerPadding: '40px'
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: '30px'
        }
      }
    ]
  });
});
