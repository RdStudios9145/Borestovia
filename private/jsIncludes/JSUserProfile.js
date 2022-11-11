module.exports = {
	generateHTML: function(data) {
		console.log(data)
		let cookies = data.cookies, subHeader = data.renderSubHeader

		let loggedIn = false
		if (cookies.l == "1")
			loggedIn = true
		
		return (subHeader && loggedIn) ? `<div id="header_button_user_submenu" style="position: fixed; top: 60px; right: 100px; width: 240px;
			background-color: #0051ff; box-shadow: 0 0 1px #000000c0">
		<ul style="list-style-type: none;">
			<li class="header_list_elem" style="width: 100%">
				<div>
					<button class="header_button header_button_hover" style="width: 100%; text-align: left;">
						<span>hello</span>
					</button>
				</div>
			</li>
			<li class="header_list_elem" style="width: 100%">
				<div>
					<button class="header_button header_button_hover" style="width: 100%; text-align: left;">
						<span>hello</span>
					</button>
				</div>
			</li>
			<li class="header_list_elem" style="width: 100%">
				<div>
					<button class="header_button header_button_hover" style="width: 100%; text-align: left;">
						<span>hello</span>
					</button>
				</div>
			</li>
		</ul>
	</div><style>
		div#header_button_user_submenu_container[data-show_child_nav="0"] div#header_button_user_submenu {
			display: none;
		}
	</style>` : (loggedIn ? `<div style="display: flex;">
			<div style="width: 3rem; box-sizing: border-box; margin-right: 1rem; height: 3rem;"><img src="public/images/icon.png"></div>
			<div style="overflow: hidder; text-overflow: ellipsis; white-space: nowrap; align-self: center; margin-right: 1.5rem;">You</div>
			<div style="align-self: center; word-wrap: bread-word">	
				<svg viewBox="0 0 15 10" style="box-sizing: border-box; width: 1.5rem; vertical-align: middle; overflow: hidden; height: 1.5rem;">
					<use xlink:href="#icon-caret-v2"></use>
				</svg>
			</div>
		</div>` : `<span>Login</span>`)
	}
}