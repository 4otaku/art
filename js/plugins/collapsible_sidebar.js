// ==UserScript==
// @name       4otaku.org Art Sidebar
// @namespace  https://gist.github.com/shtrih/5756421
// @version    0.4
// @match      http://art.4otaku.org/*
// @copyright  2013+, shtrih
// ==/UserScript==

$(function(){
	var    version = 0.4,
		icons = {
			'arrow-left':  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACz0lEQVRIS8VWy3EaQRD1cICjcARGEViKwEsEkiIwjsCrA5+b0Y3PQRCBUQSGCIQikIjA6wzgCAfwe1MzU72zs+wKqUpbRbE709OvX/+m1acST7vdvlBKXeEXHQ6HOv4veAzvL3hf43+J32I8Hr8UqVPHBHq9XguKfkGmUaTI7CeQ749Go4c8+SAggBo4+BuHIu/ghqzkmmF75sktsf5jMBgkPnAGEGDRfr//gwN1ITzF2izPZXR5pVJpQf6nPQPD6OqmfyYFSDAIPQqgBYDjkKUhlxnPTLB3Zfdh6KUEdYAUxuazZQbgO8Si7yuO47heq9Xuub7dbm8nk8nal+l0On3oYeyZWGuwv7RGO0AI0e/fjFAuWLVafRRZ+gCj6MrMI0GxuRwOh00KaUCTjUwSPgtsXoeYSTBjWC4g97vd7ty6F0xvYNxcA8KaBFZ/0RYode7HjG70wSC6gkujkEutsSamf813AiLnymTYs1mcYjGW7E4FszpAZgYS3/nNBFLS135GvRWMIJIQE5GANlk2YOdq7z3ALEvEkpl8BsAnhQ92jq/8QFAjCuWAud7pJ1TgO5ElY0np3gvAg8k4Byizq4TyoAiUuwyWJfchgEGXopss6WrP/BU7RwnWyW63i23JCIYrlzRUhBh+tspMC0uBMgZQ1DxWeyFj/KRhs9VdPlQWPtPXgmbKokzhvwUU7FKESre2U0Bla4Nn/iFkjUzzxsYcGzd+LHJielrzpvKy15NkKmvNN9C7E12Npy5gM6/o+cQMQ3c5TGdcRzdpFV3AENvw/sxcwFTgjxh0L27r29eMGMj0ewC4+xTvTZxneeknOEQRCHtyEptB0bRgiGJptYRHyOxaggUBDVPON7zH9MhhHzYHrKXGRKxxSJYTHsPxxCmu1JgoATh6AJgDkZ4Gih6mPmRijhJ5skcnb3vIjPqMS2TY2B5reytH/XmZUf8/deFYj8EYQ4QAAAAASUVORK5CYII=',
			'arrow-right': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACz0lEQVRIS7VWy3EaQRDVcICjcARGEUiKwEsEkiIwjsCrA5+b0Y3PQRCBUQSGCLSOQCIC4wzgCAfwe1s9U7PDDLOoyltFsdvTPW9ed093q4sST7vdvlFK3eGXHA6HOv5vaIb3d7yv8Z/htxiPx++x7dQphV6v18JGP6DTiG0k6yvo90ej0UtI3wsIoAYMf8IocQw3ZGXLhO2lo5dB/m0wGKxc4CNAgCX7/f4XDOqW8hSyWchldHmlUmlB/7u2wcHo6qZrUwAkGJReLaAFgFPfSX0uE89MsHan13HQWxvUAFIZi2+aGYCfEIu+u3GapvVarfZM+Xa7fZxMJmtXp9Pp9LEPY8/EWoP9rT60AYQS/f5FlLxgXOt2u3PNgPHc7XbNGCj0s+Fw2KR9DijZyCThs8Divc9lLqAcLgjqHO4BHpvngGC3ArvP+QmUujoVM3FpBtVrfagQU4npH9FbgciVkgx7E+EUwjTETsvPAQWZGUh8pS0TSNkBdjPqFHBZUJsQE5GAOlk2YGffvRjRi7KgiCUz+RKAvxU+WDmu+YGgJkSxUr8RQ7VrayimmlReewF4kGwzgLbfY4ChdWz+AgItSUpz5byAdjr/D0CvS6vVKktU1KVSmcwVkQMuUYUSXRCsPFmapGEJggs+ncOIscbBXnV/9IFR5iYNmeRV/txrUQbs6Fp89OKXARN2BUIfKm1lwezShpD9RcgaR8UbC3MsPIRi6cngQoLYdsHi7d6VUC8UF5n2hO8gmNMTzR0vNGCZV/L5RIahJ5epVKEZ5Uj9VoleuGEWHzVgbuCOGHQvuvXjOSMGMv0ZAKaf4r0J+0wf3DtEEQgK9iQ2w0bTyBDFq5WXMnnI7N4Gozw4JnJK0yOH3oHFAbLCmAgZh+RCl2Ej4BRXaky0Y8bRA8AciPJpIPYw9aGTcpQI6Z6cvLWRjPqMS+LUziVZQ85Rf15m1P8Hvilej5nlQtEAAAAASUVORK5CYII=',
			'bubbles':     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACkElEQVRIS72WzXHaQBTHvTADxzgVWKkgdgWRK4hdgaGC6MLHLeTGx8FyBYYKDBVErsC4guAKgm/ADJD/X9FqnpaVhAz2zuiyu3q/9/1WnXzwUkV57XbbWa/XZ/yvXC6/dLvdWREZuUAAatvt9huEuvicFOGEBrgX9Pv9UZYCqcBms+kppX5kQNLkEu73er0724UdYKPROAfoHt95EVeZd2HtFF99MBhM5VkCGLnv3gbCz490W6lUogU6bs5ms6GbXShIt+8s7NcR56E+iIEpsFeA/NVq5WPNsyz2PO+0UqkwDB7ufUpYJaAhkJkHTZ9w+VRcnCyXy1oeyFSC4Gq1Sou+6zMoPYdnLpjRIRAJEkiX4MII2VY7JIaQOYTMGyEjQCJdKiYJ6E9Cm0fA3ENg+l/TEHjxQpmaQKsvRYs5TTmGCt76I4wZESjd+QyzDyoHE95qtVgWX7nPTFfY2IpLdwAyy462IN+HMDYQAucJIDZ+IX6do9H+J2QHYfqpZRIYm4zNCSy8OiYQ8se6RGDQC4HxBkGovc9Fay9Nwagm/4rzCZPmCiY/vEccZfyiGF7rwp8BGs44LrP/vcXFZqukO5EfjgaaVpLhpY2YPAWi0XYr78GIS9R3EDdvM5uiy0NA63kAfQ6rXFjCjHSNf+JyS4wnS/9j7VzDFUysEyaBTCj93ID2BNBLO03D7Ms7A9ji+xHGk4cJwMQyNc8ynqOtA2VZ+PGyPjFkuwu7Q3Js7ePhCeeirSdbgUhnDtvEEM2jhEWt1Bifn9X8bS5l4H/bAIwH9mf6TDw3ZvtOmAQw6gycjY4BfI1cNMyzNO9cvmlcDMhbI9MY+DEs6exrwV5AMfWfoySZAjxdLBbjY/VVrcg/cBBkna9i7QcAAAAASUVORK5CYII=',
			'info':        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAClUlEQVRIS7VW23EaQRD0kgA4AkMEoAgMEUiKQCgC4w8ef0Z/PD5sIjBEIIhAEIFEBD5nAAmAu7dmr4Zl7/ZOJV8Vxd3OzPbOc9t8KvD0+/2WMeYWv/b5fK7hv0UzvL/h/YD/LX6b+Xz+FtvO5CmMRqMuNvoBnXpsI5En0B/PZrNVln4QEEB1GP6GUdszPNIrvSbeVj29LdYfJ5NJ4gNfAQKsfTqdnmFQU8oLrC2zQsaQVyqVLvS/ORscjKHu+DYXgASD0osC2gC4FzppKGQSmV+Q3To5DnqjQVNAKkP46jwD8BNyMS6Yuwu1wWAwxj7MPQvrAO9v3KFTQCgx7l9F6d1gDlmDYm07nU47lFlAqUYWCZ8NhHdZnnkH2yEKfmGlpsPhcO3CC0/vobu2gNgkgXdf7AmMaeTlrAyg5PSPnCCBIw0jFfYqiwss9vLyVgZQnFnCiQe+s4CMjrVfUSFghh96dcpQDAmiscw7oHaIhUhAVyxHeKd7L2+fUjLk8gCDKgB3Bh+cHE1+5BWAFJYNjXr2sRRIWK1TdvYC8MzFGKBX5hYzZuMOpvNeGDBk/F7AQiH9IMB9WjQcQcjh51g1lG0L7ucXDYetnfJF2qIs4FVb/O/Gh3cXDhUeba4tEHrSDduvTAPeSTNWoQGgRxt0/yJl9avhDcEagns/l6G2cDpZV1nm8NbNKSf/0OtJt8/FBSx8xfITIUNPsaoNyb1oHMl7ri5gGvoUg+HFgP5ehmKg0n8CIL1P8d6B/dYdLEiiCAQFzcSW2GgRIVFsra7ymJ7daTDKMmkiWZqjHKo4bFXqMOqqVXo7srhCNFFvJncfCZFlA7GHpQ+dHqlElm4u83ZGQvWZl7b0YFNke/Yi3kn110Wo/j+twBiPOof77AAAAABJRU5ErkJggg==',
			'pencil':      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACE0lEQVRIS7WVy1XCQBSGHRawlA7EDrQCsQOsgFgBccFjJ+wILEwHYgWGCogdQAVgBcIOWID/zcnEyWQmTB7mnBxI5s798t/XsKsCV6/XmzHG2qKL8/n8MZlMLJ1blpdnCrNtu+667pZzcgFNYd1u9w4RWFQqlZfxeDwjaGZgVhiA9QDE2C2gm0zAArDnzArLgBmHtCyYEbBM2GAwsFJzWDYMPfquBf4HTBvSfr/vYrEjTZARJshQfMf7TCj9qBq5HYWRlGkbnyZDrVb74QYw/kLjWtRDRWFKheIXAfYEVZ48/vIoC32sEjkUcjd3HKdVJuxwODQTQOSPBu21Sh2Fu1qtrrPkjCsjGA3xGBDhbAK0gNEO6oIZKF5QPwTsldbxa/NxpSsQGZbIIa9O1ZkWqlti0+x4POJj/44cciRXowqWAELBBl9+czqd7qfTKTmPLjhs7Pf7rQzKAosBySGUrXF/ozIbcjh1z3yftL7iOZP3RTmEOhvq3gBMNHgaHPt87HsQbLSwmEJhIzkYoSD8SyqxpwXbT1NYBJSnS7DAWGJMcccEwv82bMQ+TVXG9wYh1VQYQR+5UpouGHEdhJxUyS0zR84sVUEpc6g6GUJDHwAKsYVnsZB2eO/hA3xUrmcCiink0yUtZ1S9AHt0m+RX54sJ0yVhQycFXpISgmwuFZHJOpPOvtyhMoEFxRi2w7JoqEyBv4ON2xnXrw2aAAAAAElFTkSuQmCC',
			'settings':    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAABj0lEQVRIS+1Wy1HDMBBFdgPpADqIqQDTASWkA+Dgz41ws33BdOCUQAWkg1CC6SBcPWObt4zk8UfyJKuEC/jisaTdt/t291ni4pcfYcKL49iv67rt77uu+5kkSWkToxYwiqIcTu/Hjtu23TuOc20DKsIwXMPxIBMhxAprVwB47oH6WL/Bd4F1dpYC2QzA+lmladoxQIEB8MmGTrL9A4A6ikDfVtZrso31WzTNlkuttkuDIPDgmDp18GDtA3V94IL91NDGmGNrDQj67wC8HINXVfWa5/l+whInSmVD1EMIdgYfb6CfghmWRTaIcRbnAoIALFBXD+8NgAt1Ft/vpEpU8wng3OAfmj0pUpZla3V+zufs4J8FkCg91LFmTBayYYqmaTpKQS/5/ELmU0q5YGTHahobQLKVY+FpxgJTceKx4ARrlDbU4WXskGqCbnzkACkbLeBZxfv/B6y4P9kVQ16ixn2wgg5eokk6ucK3j0M+6SbeJbdxjromknqQWFtdE02R0kVYs1fagJE/6x/wsdR+Azewv0asjJgIAAAAAElFTkSuQmCC',
			'tags':        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAABq0lEQVRIS8XWzVGDQBQHcJcZ4GjSQTowHRg70ApCKhAPfNzMMcBBrEBKSAnpQK3AsQM9cgD8PwZ2NiSEZcFkZxiSZef92N3HA3Z1gcZUTdu2J7quz6Io+hBj+L6/yLKsaIn7S+N7oxS0KIpnBJ2mabqI4/gHfbOqz+qaBMb1Qz3PixH0EcenAFp5nr8wxiZdYH1deqau6yYIvGyCuPM3WawXqgi+4ia3WIU5zmuA19KoCojZP4VhSFtRNsdx5pqmvUuhKiAFxn5PKcHEZUc+UJbfUF/rnqqCyugQsJpdEgTBqp4pHilLTLiDmY4AlhY9jzhtcVAi3YtLvYeOBXY9Qhw9F8gT6Zwglv2bCZssljaqpV9dy6RyHXEfGGa5w0bf4rjbbDY7CoS+Nf5TUR+1IeYKRkJoXVN5mjdTfAy5Bss9rV5LlN5UGzksVpChqAjyRKpqIy0th+klbZom9ZWlS7U1QY7Sj/+Aj4F76NhwG3iAjgWfAo+iQ+EusBVVhWXAk2hfWBbsRGsYAWOqWvVnCD1OhmFQ35JqKcbZ+Dyh15hUk/4alIomOegi6B9ky305CR7W2gAAAABJRU5ErkJggg=='
		},
		sidebar = $('.sidebar'),
		art_container = $('.art,.images').first(),
		art_icons = {
			'art': [
				'pencil',
				'info',
				'tags',
				'bubbles'
			],
			'images': [
				'pencil',
				'tags',
				'bubbles'
			]
		},
		sidebar_collapse_link = $('<a/>', {
			'href':  '#',
			'text':  'Свернуть панель',
			'title': 'Свернуть панель',
			'class': 'collapse-link',
			'css': {
				'background-image':   'url('+ icons['arrow-left'] +')',
			},
			'click': function () {
				if(localStorage.getItem('art-sidebar-collapsed')) {
					expand_sidebar();

					localStorage.setItem('art-sidebar-collapsed', '');
				}
				else {
					collapse_sidebar();

					localStorage.setItem('art-sidebar-collapsed', true);
				}

				return false;
			}
		}),
		side_button_list = $('<ul/>', {
			'class': 'collapsed-sidebar'
		}),
		side_button_list_item = $('<li/>', {
			'css': {
				'background-image': 'url('+ icons.info +')',
			},
			'mouseenter': function () {
				$(this)
					.css('opacity', '1')
					.children().fadeIn('fast')
				;
			},
		   'mouseleave': function () {
				$(this)
					.css('opacity', '0.6')
					.children().fadeOut('fast')
				;
			}
		});

	// добавляем линк в сайдбар
	sidebar.prepend(
		sidebar_collapse_link
	);

	// если на странице арта всего три блока в сайдбаре, значит нет блока с тегами
	// удаляем лишнюю иконку тегов
	if (art_container.attr('class') === 'art' && sidebar.children('.sidebar_part').length === 3) {
		art_icons.art.splice(2,1);
	}

	// восстанавливаем состояние сайдбара
	if(localStorage.getItem('art-sidebar-collapsed')) {
		collapse_sidebar();
	}

	function expand_sidebar() {
		sidebar_collapse_link
			.attr('title', 'Свернуть панель')
			.text('Свернуть панель')
			.css('background', 'url('+ icons['arrow-left'] +') no-repeat left center')
		;

		side_button_list.children().each(function () {
			$(this).children().appendTo(sidebar);
		});

		sidebar
			.children('div').show()
		.end()
			.css({
				'border-right': 'none'
			})
			.animate({'width': '250px'}, 'fast')
		;

		art_container.animate({'margin-left': '250px'}, 'fast');
		side_button_list.hide();
	}

	function collapse_sidebar() {
		sidebar_collapse_link
			.attr('title', 'Развернуть панель')
			.text('')
			.css('background', 'url('+ icons['arrow-right'] +') no-repeat left center')
		;

		sidebar
			.children('div').hide('fast')
		.end()
			.animate(
				{ 'width': '40px' },
				'fast',
				function () {
					$(this).css({
						'border-right': '#eee 1px solid'
					});
				}
			)
		;

		art_container.animate({'margin-left': '45px'}, 'fast');

		if (!side_button_list.children().length) {
			for (var i = 0, len = sidebar.children('.sidebar_part').length; i < len; i++) {
				side_button_list.append(
					side_button_list_item.clone(true)
						.css('background-image', 'url('+ icons[ art_icons[ art_container.attr('class') ][i] ] +')')
				);
			}

			sidebar.append(
				side_button_list
			);
		}

		side_button_list.children().each(function () {
			$(this).append(
				sidebar.children('.sidebar_part').eq(0)
			);
		});

		side_button_list.fadeIn('fast');
	}
});
