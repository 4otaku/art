wbbdebug = false;

wbbconfig = {
	buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,link'
};

wbbtranslationconfig = {
	buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,save,',
	allButtons: {
		save: {
			cmd: function() {
				console.log(arguments);
				console.log(this);
			},
			buttonHTML: '<img src="/images/wysibb/save.png" title="Сохранить" />',
			rootSelector: []
		}
	}
};

wbbparseconfig = $.extend({}, wbbconfig, {
	bbmode: true
});