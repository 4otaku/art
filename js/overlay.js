function overlay(template) {
	$(".overlay").remove();

	var div = $('<div/>').addClass('overlay').html(OVERLAY[template])
		.appendTo('body');
	div.overlay({
		top: 260,
		mask: {
			color: '#fff',
			loadSpeed: 200,
			opacity: 0.5
		},
		closeOnClick: false,
		load: true
	});

}

OVERLAY = {
	test: 'Hello world'
}
