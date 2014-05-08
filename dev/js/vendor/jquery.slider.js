;(function($){
	$.fn.extend( {
		slider: function( options ) {
			this.defaults = {
				visibleItems: 3,
				spped: 300
			};

			var settings = $.extend( {}, this.defaults, options );


			return this.each( function() {
				var $this = $(this),
					$conteiner = $this.children('ul'),
					$items = $conteiner.find('li'),
					$nav = $('<div class="slider_nav_prev"><i></i></div><div class="slider_nav_next"><i></i></div>'),
					itemWidth = $items.eq(0).outerWidth(true),
					itemsCount = $items.length,
					idx = 0;

				if(itemsCount <= settings.visibleItems) return;

				function sliderNavigate () {
					$conteiner.animate({
						'left': - Math.ceil(idx * itemWidth)
					}, settings.spped);
				}

				function setPos() {
					var imgHeight = $items.eq(0).find('img').height();
					itemWidth = $items.outerWidth(true);

					$nav.css({
						'height': imgHeight
					});

					$conteiner.css({
						'left': - Math.ceil(idx * itemWidth)
					});
				}

				$nav.on('click', function (event) {
					var $target = $(event.currentTarget);

					if($target.hasClass('slider_nav_next')) {
						idx++;
						if(idx + settings.visibleItems > itemsCount) {
							idx = 0;
						}
					} else {
						idx--;
						if(idx < 0) {
							idx = itemsCount - settings.visibleItems;
						}
					}

					sliderNavigate();
				});

				$this.append($nav);

				$(window).resize(setPos);
				$items.eq(0).find('img').one('load', function() {
					setPos();
				}).each(function() {
					if(this.complete) $(this).load();
				});
			});
		}
	});
})(jQuery);