wbbdebug = false;

wbbconfig = {
	buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,link'
};

wbbtranslationconfig = {
	buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,save,cancel,',
	allButtons: {
		save: {
			cmd: function() {
				console.log(arguments);
			},
			buttonText: 'Сохранить'
		},
		cancel: {
			cmd: function() {
				console.log(arguments);
			},
			buttonText: 'Отменить'
		}
	}
};

wbbparseconfig = $.extend({}, wbbconfig, {
	bbmode: true
});