
window.addEventListener('load', start);

function start() {
  scrollSpy();
  tooltip();
  listenScroll();

  const btnBackToTop = document
    .querySelector('#backToTop');
  btnBackToTop.addEventListener('click', backToTop);
}

const scrollSpy = () => {
  const elements = document
    .querySelectorAll('.scrollspy');
  M.ScrollSpy.init(elements);
}

const tooltip = () => {
  const elements = document
    .querySelectorAll('.tooltipped');
  M.Tooltip.init(elements);
}

const listenScroll = () => {
  const $button = $('#backToTop');

  $(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    var height = 200;

    if (scrollTop > height) {
      $button.addClass('show');
    } else {
      $button.removeClass('show');
    }
  });
}

const backToTop = () => {
  $('html, body').animate({
    scrollTop: 0
  }, '300');
}