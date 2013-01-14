OBJECT.help = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.text += '<div>' +
		this.child.static.html() + '</div>';
}

extend(OBJECT.help, OBJECT.base, {
	class_name: 'help',
	displayed: true,
	text: '<h2>Справка</h2>',
	child_config: {
		static: '.help_static',
		show: '.help_show'
	},
	events: {
		show: {
			click: function(){
				Overlay.html(this.text, '80%');
			}
		}
	},
	listen: {
		file_number_changed: function(modificator){
			if (this.displayed) {
				this.displayed = false;
				this.child.static.remove();
				this.child.show.show();
			}
		}
	}
});