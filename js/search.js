OBJECT.search = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.parse_area();
	this.val = this.get_val();
}

extend(OBJECT.search, OBJECT.base, {
	class_name: 'search',
	area: [],
	child_config: {
		area: '.search_boxes input',
		field: '.field .search',
		button: '.field .search-button',
		tip: '.field .search-tip'
	},
	parse_area: function() {
		var area = [];
		this.child.area.each(function() {
			if ($(this).is(':checked')) {
				area.push($(this).val());
			}
		});
		this.area = area;
	},
	get_val: function() {
		return this.child.field.val().replace(/\//g, ' ')
			.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	},
	move_tip: function(move) {

	},
	perform_search: function(val, area) {
		document.location.href='/search/'+area.join(',')+
			'/'+this.get_sort(area)+'/'+encodeURI(val)+'/';
	},
	get_sort: function(area) {
		if (area.length == 1 && area[0] == 'art') {
			return 'art';
		}
		return 'rel';
	},
	events: {
		area: {
			click: function() {
				this.parse_area();
			}
		},
		field: {
			keyup: function() {
				var val = this.get_val();
				if (this.val != val && val.length > 0) {
					this.val = val;
					var area = this.area.join(',');
					Ajax.get('/ajax/search_tip', {area: area, val: val}, function(response) {
						console.log(response);
					});
				}
			},
			keydown: function(e) {
				switch (e.which) {
					case 40: this.move_tip(1);
					case 38: this.move_tip(-1);
					case 13:
						var val = this.get_val();
						if (val.length > 2 && this.area.length > 0) {
							this.perform_search(val, this.area);
						}
					default: break;
				}
			}
		},
		button: {
			click: function() {
				var val = this.get_val();
				if (val.length < 3) {
					alert('В строке поиска должно быть больше двух символов.');
				} else if (this.area.length < 1) {
					alert('Задайте область поиска.');
				} else {
					this.perform_search(val, this.area);
				}
			}
		},
		tip: {}
	}
});

/*



	$("input.search").keydown(function(e){
		switch (e.which) {
			case 40:
				b = parseInt($("#search-tip").attr('rel')); a = b + 1;
				if (!(a > $('.search-tip').size())) {
					$('.search-tip-'+b).parent().removeClass('active');
					$('.search-tip-'+a).parent().addClass('active');
					if ($('.search-tip-'+a).is(".tip-type-search")) {
						$(this).val($('.search-tip-'+a).attr('rel'));
					}
					else {
						$(this).val($('.search-tip-'+a).html().split(': ')[1]);
					}
					$("#search-tip").attr('rel',a);
				}
				break;
			case 38:
				b = parseInt($("#search-tip").attr('rel')); a = b - 1;
				if (!(a < 0)) {
					$('.search-tip-'+b).parent().removeClass('active');
					$('.search-tip-'+a).parent().addClass('active');
					$(this).val($('.search-tip-'+a).attr('rel'));
					$("#search-tip").attr('rel',a);
				}
				break;
			case 13:
			*
			*
	$(".search-tip").live('click',function(event){
		if (event.button == 0) {
			if($(this).is(".tip-type-search")) {
				event.preventDefault();
				$("input.search").val($(this).attr('rel'));
				$("input.searchb").click();
			}
			else {
				document.location.href = $(this).attr('rel');
			}
		}
	});
