OBJECT.slideshow = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.current = this.start;
	this.load_images();

	this.child.delay_input.numeric({
		decimal: false,
		negative: false
	});

	if (this.auto) {
		this.child.play.click();
	}
};

extend(OBJECT.slideshow, OBJECT.base, {
	class_name: 'slideshow',
	child_config: {
		images: '.slideshow_images',
		play: 'img.play',
		pause: 'img.pause',
		delay: '.delay',
		delay_input: '.delay input',
		next: 'img.next',
		prev: 'img.prev'
	},
	images: {},
	query: null,
	per_page: 10,
	current: 1,
	delay: false,
	slide_next: null,
	last: false,
	from_page: null,
	to_page: null,
	load_images: function() {
		var curr_page = this.get_curr_page();
		if (this.from_page === null || this.to_page === null) {
			var callback = this.set_first;
			var page = curr_page;
		} else if (!this.images[this.current+2] && this.current + 1 < this.last) {
			var callback = this.set_to;
			var page = curr_page + 1;
		} else if (!this.images[this.current-2] && curr_page > 1) {
			var callback = this.set_from;
			var page = curr_page - 1;
		} else if (!this.last && this.to_page < curr_page + 5) {
			var callback = this.set_to;
			var page = this.to_page + 1;
		} else if (this.from_page > 1 && this.from_page > curr_page - 5) {
			var callback = this.set_from;
			var page = this.from_page - 1;
		}

		if (!callback || !page) {
			setTimeout($.proxy(function() {
				this.load_images();
			}, this), 1000);
			return;
		}

		var query = '?page=' + page + '&per_page=' +
			this.per_page + '&' + this.query;

		Ajax.load('/ajax/art_list' + query, function(result){
			result = $(result);
			result.find('img').imagesLoaded($.proxy(function(){
				this.add_images(result, page);
				callback.call(this, page);

				setTimeout($.proxy(function() {
					this.load_images();
				}, this), 1000);
			}, this));
			this.child.images.append(result);
		}, this);
	},
	get_curr_page: function() {
		return Math.floor((this.current - 1) / this.per_page) + 1;
	},
	add_images: function(result, page) {
		var images = this.images;
		var position = (page - 1) * this.per_page + 1;
		var count = 0;
		result.filter('div.image').each(function() {

			$(this).height(Math.min($(this).naturalHeight(),
				$(window).height()));

			images[position] = $(this);
			position++;
			count++;
		});
		if (count < this.per_page) {
			this.last = position - 1;
		}
		this.check_buttons();
	},
	set_first: function(page) {
		this.from_page = page;
		this.to_page = page;
		this.images[this.current].css('display', 'inline-block');
	},
	set_to: function(page) {
		this.to_page = page;
	},
	set_from: function(page) {
		this.from_page = page;
	},
	set_current: function(current) {
		this.current = current;
		this.check_buttons();

		var url = window.location.href;
		var start_match = /(&|\?)?start=\d+/;
		var symbol = url.match(start_match);
		if (symbol) {
			url = url.replace(start_match,
				symbol[1] + 'start=' + current);
		} else {
			url = url + (url.indexOf('?') === -1 ? '?' : '&')
			 + 'start=' + current;
		}

		history.pushState(false, false, url);
	},
	check_buttons: function() {
		var next = this.images[this.current+1];
		var prev = this.images[this.current-1];

		if (next) {
			this.child.next.removeClass('disabled');
			this.child.next.show();
		} else {
			this.child.next.addClass('disabled');
			if (this.last && this.current == this.last) {
				this.child.next.hide();
			}
		}

		if (prev) {
			this.child.prev.removeClass('disabled');
			this.child.prev.show();
		} else {
			this.child.prev.addClass('disabled');
			if (this.current == 1) {
				this.child.prev.hide();
			}
		}
	},
	do_slide: function(is_start) {
		if (!is_start) {
			this.child.next.click();
		}

		this.slide_next = setTimeout($.proxy(function() {
			this.do_slide(false);
		}, this), this.delay * 1000);
	},
	events: {
		play: {
			click: function(){
				this.delay = parseInt(this.child.delay_input.val());
				this.child.play.hide();
				this.child.pause.show();
				this.child.delay.show();

				this.do_slide(true);

				Ajax.perform('/ajax/setting', {
					section: 'slideshow',
					key: 'auto',
					value: 1
				});
			}
		},
		pause: {
			click: function(){
				this.delay = false;
				this.child.play.show();
				this.child.pause.hide();
				this.child.delay.hide();

				clearTimeout(this.slide_next);

				Ajax.perform('/ajax/setting', {
					section: 'slideshow',
					key: 'auto',
					value: 0
				});
			}
		},
		next: {
			click: function(){
				var showimage = this.images[this.current+1];
				var hideimage = this.images[this.current];

				if (showimage) {
					hideimage.hide();
					showimage.css('display', 'inline-block');
					this.set_current(this.current + 1);
				}
			}
		},
		prev: {
			click: function(){
				var showimage = this.images[this.current-1];
				var hideimage = this.images[this.current];

				if (showimage) {
					hideimage.hide();
					showimage.css('display', 'inline-block');
					this.set_current(this.current - 1);
				}
			}
		},
		delay_input: {
			keyup: function() {
				var delay = parseInt(this.child.delay_input.val());
				if (delay > 0) {
					this.delay = delay;
					clearTimeout(this.slide_next);
					this.do_slide(true);

					Ajax.perform('/ajax/setting', {
						section: 'slideshow',
						key: 'delay',
						value: delay
					});
				}
			}
		}
	}
});
