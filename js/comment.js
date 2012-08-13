OBJECT.comment_form = function(id, values, events) {

	OBJECT.form.call(this, id, values, events);

	this.child.text.wysibb({
		debug: false,
		smileAutoDetect: false,
		themeName: false,
		validTags: ['a','b','i','s','img','strike'],
		buttons: 'bold,italic,strike,|,fontsizeselect,fontcolor,|,link,img,|,spoiler',
		smileList: []
	});
}

extend(OBJECT.comment_form, OBJECT.form, {
	class_name: 'comment_form',
	child_config: {
		text: '.comment_text'
	}
});
