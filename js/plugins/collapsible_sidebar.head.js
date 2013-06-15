if (localStorage.getItem('art-sidebar-collapsed')) {
	var css = '.sidebar {width: 40px;} ' +
			'.sidebar_part {display: none;}' +
			'.art, .images {margin-left: 45px;}',
		head = document.getElementsByTagName('head')[0],
		style = document.createElement('style');

	style.type = 'text/css';
	if (style.styleSheet){
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}

	head.appendChild(style);
}