module.exports = {
	generateHTML: function(data) {
		uProfile = require("./JSUserProfile.js").generateHTML(data)
		return `div id="navbar_container_div" style="height: 60px; display: block; position: relative; position: sticky; top: 0">
			<header style="background-color: #0051ff; width: 100%; margin: 0; color: white; position: relative; height: 60px;">
				<nav style="box-sizing: border-box; max-width: 146rem; display: flex; margin-left: auto; margin-right: auto; justify-content: space-between;">
					<ul id="navbar_left" style="list-style-type: none; display: flex;">
						<li class="header_list_elem"><a href="/~">
							<div>
								<button class="header_button">
									<span>Officially Knifty</span>
								</button>
							</div>
						</a></li>
						<li class="header_list_elem"><a href="/~">
							<div>
								<button class="header_button header_button_hover">
									<span>Home</span>
								</button>
							</div>
						</a></li>
						<li class="header_list_elem"><a href="/club">
							<div>
								<button class="header_button header_button_hover">
									<span>Club</span>
								</button>
							</div>
						</a></li>
						<li class="header_list_elem"><a href="/else">
							<div>
								<button class="header_button header_button_hover">
									<span>Something Else</span>
								</button>
							</div>
						</a></li>
					</ul>
					<ul id="navbar_right" style="list-style-type: none; display: flex;">
						<li class="header_list_elem">
							<div>
								<button class="header_button header_button_hover" onclick="function run() { var mode = document.body.dataset.mode; if (mode == 'dark') return document.body.dataset.mode = 'light'; return document.body.dataset.mode = 'dark' } run()">
									<span id="navbar_light_sun">☀️</span>
									<span id="navbar_dark_moon">🌙</span>
								</button>
							</div>
						</li>
						<li class="header_list_elem">
							<div id="header_button_user_submenu_container" data-show_child_nav="0">
								<button class="header_button header_button_hover" onclick="let elem = document.getElementById('header_button_user_submenu_container'); elem.dataset.show_child_nav = (1 - parseInt(elem.dataset.show_child_nav).toString())">
									${uProfile}
								</button>
								${require("./JSUserProfile.js").generateHTML({ cookies: data.cookies, renderSubHeader: true })}
							</div>
						</li>
					</ul>
				</nav>
			</header>
		</div>`
	}
}