document.addEventListener("DOMContentLoaded", () => {
  console.log("ProNavi Redesign - Team Habatack");
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

$(function() {
  $(".faq-question").on("click", function() {
    const answer = $(this).next(".faq-answer");
    const toggle = $(this).find(".faq-toggle");

    if (answer.is(":visible")) {
      answer.slideUp();
      toggle.text("＋");
    } else {
      answer.slideDown();
      toggle.text("−");
    }
  });
});
