window.addEventListener("load", start);

function start() {
  scrollSpy();
  tooltip();
  listenScroll();
  openMenuMobile();

  const btnBackToTop = document.querySelector("#backToTop");

  const btnCopy = document.querySelector("#copyToTransferArea");

  btnBackToTop.addEventListener("click", backToTop);
  btnCopy.addEventListener("click", copyToTransferArea);
}

const scrollSpy = () => {
  const elements = document.querySelectorAll(".scrollspy");

  M.ScrollSpy.init(elements);
};

const tooltip = () => {
  const elements = document.querySelectorAll(".tooltipped");

  M.Tooltip.init(elements);
};

const listenScroll = () => {
  const $button = $("#backToTop");

  $(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    var height = 200;

    if (scrollTop > height) {
      $button.addClass("-show");
    } else {
      $button.removeClass("-show");
    }
  });
};

const backToTop = () => {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    "300"
  );
};

const openMenuMobile = () => {
  const elements = document.querySelector(".sidenav");

  M.Sidenav.init(elements);
};

const copyToTransferArea = async (event) => {
  const copyValue = document.getElementById("inputExample")?.value;

  if (!navigator?.clipboard?.writeText) {
    clipboardAlert(false);
    return;
  }

  await navigator?.clipboard?.writeText(copyValue);
  clipboardAlert(true);
};

const clipboardAlert = (isCopied) => {
  const message = isCopied ? "Copiado!" : "Clipboard não suportado";

  $("#copyToTransferArea")
    .attr("data-tooltip", message)
    .addClass("copied")
    .tooltip();

  if (isCopied) $(".-copymsg").addClass("showmsg");

  setTimeout(() => {
    $("#copyToTransferArea")
      .attr("data-tooltip", "Copiar")
      .removeClass("copied");

    if (isCopied) $(".-copymsg").removeClass("showmsg");
  }, 3000);
};
