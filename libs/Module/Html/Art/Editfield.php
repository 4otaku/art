<?php

namespace Otaku\Art\Module;

class HtmlArtEditfield extends HtmlArtAbstract
{
	protected $css = ['edit'];
	protected $js = ['external/wysibb', 'external/upload',
		'form', 'edit', 'wysibb'];
}
