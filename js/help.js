OBJECT.help = function(id, values, events) {
	OBJECT.base.call(this, id, values, events);

	this.submodule.static.el.show();
	this.text += '<div>' + this.submodule.static.el.html() + '</div>';
};

extend(OBJECT.help, OBJECT.base, {
	class_name: 'help',
	child_config: {
		show: '.help_show'
	},
	submodule_config: {
		static: 'bb'
	},
	displayed: true,
	text: '<h2>Справка</h2>',
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
				this.submodule.static.el.remove();
				this.child.show.show();
			}
		}
	}
});