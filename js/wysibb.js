wbbdebug = false;

wbbconfig = {
	buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,link'
};

wbbtranslationconfig = {
	buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,save,',
	allButtons: {
		save: {
			cmd: function() {
				message('translation_edit_save', this.txtArea);
			},
			buttonHTML: '<img src="/images/wysibb/save.png" title="Сохранить" />',
			rootSelector: []
		}
	}
};

wbbparseconfig = $.extend({}, wbbconfig, {
	bbmode: true
});