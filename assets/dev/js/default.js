
window.addEventListener('load', start);

function start() {
  scrollSpy();
}

const scrollSpy = () => {
  const elements = document.querySelectorAll('.scrollspy');
  M.ScrollSpy.init(elements);
}
