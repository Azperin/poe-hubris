let filters = JSON.parse(localStorage.getItem('filters'));
let sidebars = ['#sidebar', '#sidebarComboResult', '#sidebarBestResult'];
let currentSidebarIdx = 0;
if (!filters) {
	filters = { min: 1, tIgnore: false, skills: {} };
	Object.keys(legionjewelsinfo).forEach(x => {
		filters.skills[x] = { min: 1, show: true };
	});
};

let filterTableEl = document.querySelector('.filtertable');

Object.keys(legionjewelsinfo).forEach((x,i) => {
	let row = filterTableEl.insertRow(0);
	
	let cellToggleShow = row.insertCell(0);
	cellToggleShow.innerHTML = `<input type="checkbox" ${ filters.skills[x].show ? 'checked':'' } onchange="togglefilterskill('${x}')" />`;
	
	let cellSkillName = row.insertCell(1);
	cellSkillName.innerHTML = `${ legionjewelsinfo[x].sd['1'] }`;
	
	let cellInputAmount = row.insertCell(2);
	cellInputAmount.innerHTML = `<input placeholder="1" oninput="filterSetMin('${x}',this)" type="text" value="${ filters.skills[x].min > 1 ? filters.skills[x].min : '' }" />`;
	
});

let r = filterTableEl.insertRow(0);
r.insertCell(0).innerHTML = `<input type="checkbox" ${ filters.tIgnore ? 'checked':'' } onchange="filterToggleTempIgnore()" />`;
r.insertCell(1).innerHTML = `Ignore ALL filters`;
r.insertCell(2).innerHTML = `<input placeholder="1" type="text" oninput="filterSetGlobalMin(this)" value="${ filters.min > 1 ? filters.min : '' }" />`;

function filterToggleTempIgnore() {
	filters.tIgnore = !filters.tIgnore;
	localStorage.setItem('filters', JSON.stringify(filters));
};

function filterSetGlobalMin(e) {
	let s = parseInt(e.value, 10);
	filters.min = s > 1 ? s : '';
	localStorage.setItem('filters', JSON.stringify(filters));
};

function filterSetMin(skillId, e) {
	let s = parseInt(e.value, 10);
	filters.skills[skillId].min = s > 1 ? s : '';
	localStorage.setItem('filters', JSON.stringify(filters));
};

function togglefilterskill(skillId) {
	filters.skills[skillId].show = !filters.skills[skillId].show;
	localStorage.setItem('filters', JSON.stringify(filters));
};

function togglefilterswin() {
	ignorefilters.style.display = (ignorefilters.style.display == 'none' || !ignorefilters.style.display) ? 'block' : 'none';
};

function toggleBestFilters() {
	bestFilters.style.display = (bestFilters.style.display == 'none' || !bestFilters.style.display) ? 'block' : 'none';
};

function toggleSidebar() {
	currentSidebarIdx = sidebars[currentSidebarIdx + 1] ? (currentSidebarIdx + 1) : 0;
	
	document.querySelectorAll('.sidebars').forEach(el => {
		el.style.display = 'none';
	});
	
	document.querySelector(`${sidebars[currentSidebarIdx]}`).style.display = 'block';
};

function copySeedForTrade(seed) {
	let s = {
		"query": {
			"name": "Elegant Hubris",
			"stats": [  { "disabled": true, "filters": [], "type": "and" },
				{
					"filters": [
						{ "disabled": false, "id": "explicit.pseudo_timeless_jewel_victario", "value": {
						"max": seed,
						"min": seed
						} },
						{ "disabled": false, "id": "explicit.pseudo_timeless_jewel_caspiro", "value": {
						"max": seed,
						"min": seed
						}  },
						{
						"disabled": false, "id": "explicit.pseudo_timeless_jewel_cadiro", "value": {
						"max": seed,
						"min": seed
						}
						},
						{
						"disabled": false, "id": "explicit.pseudo_timeless_jewel_chitus", "value": {
						"max": seed,
						"min": seed
						} },
					],
					"type": "count",
					"value": {
						"min": 1
					}
				}
			],
			"status": {
				"option": "online"
			},
			"type": "Timeless Jewel"
		}
	};
	
	let copyText = encodeURI(`https://www.pathofexile.com/trade/search/Necropolis/?q=${JSON.stringify(s)}`);
	navigator.clipboard.writeText(copyText).then(function() {
		
	}, function(err) {
		
	});
};
