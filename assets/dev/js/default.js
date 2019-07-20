$(document).ready(() => {
	anchorEffect();
	$('.tooltipped').tooltip();
	$('.sidenav').sidenav();
});

const anchorEffect = () => {
	$('#menu-navegacao').find('a').click(function() {
		let thisPathname = this.pathname.replace(/^\//, '');
		let locPath = location.pathname.replace(/^\//, '');
		
		if((locPath === thisPathname) && (location.hostname === this.hostname)) {
			let target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			$('nav ul a').removeClass('-backhovermenu');
			if(target.length) {
				$(this).addClass('-backhovermenu');
				$('html, body').animate({
					scrollTop: target.offset().top - 64
				}, 1000);
				return false;
			} 
		}
	});
}
