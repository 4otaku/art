wbbdebug = false;

// Common config

var spoiler_html = '<div class="mini-shell">' + '' +
	'<div class="handler" width="100%">' +
		'<span class="sign">↓</span> ' +
		'<a href="#" class="disabled">{TITLE}</a>' +
	'</div>' +
	'<div class="text hidden">{SELTEXT}</div>' +
'</div>';

wbbconfig = {
	buttons: 'bold,italic,strike,|,fontsize,fontcolor,|,spoiler,|,link,img,',
	img_uploadurl: '/external/wysibb_upload.php',
	allButtons: {
		spoiler: {
			title: 'Спойлер',
			buttonHTML: '<center><img src="/images/wysibb/spoiler.png" title="Спойлер" /></center>',
			modal: {
				title: 'Введите заголовок спойлера',
				width: '600px',
				tabs: [{
					input: [{
						param: 'TITLE',
						title: 'Введите заголовок',
						type: 'div'
					}]
				}]
			},
			transform: {}
		}
	}
};

wbbconfig.allButtons.spoiler.transform[spoiler_html] =
	'[spoiler={TITLE}]\n{SELTEXT}[/spoiler]';

// Translation config

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

// Parser config

wbbparseconfig = $.extend({}, wbbconfig, {
	bbmode: true
});

// Spoiler function

$('.handler a').live('click', function(e){
	$(this).parent().parent().children('.text').toggle();
	e.preventDefault();
});