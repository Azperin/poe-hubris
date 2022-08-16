let socketsNames = {
	'21984': 'Witch RIGHT LCJ','61419': 'Witch CENTER','7960': 'Witch LEFT LCJ','36634': 'Witch LEFT BOTTOM','41263': 'Witch RIGHT BOTTOM','61834': 'Shadow RIGHT TOP','33989': 'Shadow LEFT CENTER','32763': 'Shadow RIGHT LJS','60735': 'Shadow RIGHT BOTTOM','34483': 'Duelist RIGHT TOP','46882': 'Duelist RIGHT BOTTOM LJS','54127': 'Duelist CENTER','28475': 'Duelist LEFT TOP','2491': 'Duelist LEFT BOTTOM LJS','26725': 'Templar LEFT BOTTOM','55190': 'Templar CENTER LEFT LJS','26196': 'Templar LEFT TOP','33631': 'Templar CENTER RIGHT','6230': 'Scion LEFT','48768': 'Scion RIGHT','31683': 'Scion BOTTOM'
};
let combo = localStorage.getItem('combos');
if (combo) {
	combo = JSON.parse(combo);
	combo.sockets = new Set(combo.sockets);
} else {
	combo = {
		result: [],
		sockets: new Set([]),
		skills: {},
	};
};
Object.keys(legionjewelsinfo).forEach((x,i) => {
	comboSkillsList.innerHTML += `<option value="${x}">${legionjewelsinfo[x].sd['1']}</option>`;
});

Object.keys(socketsNames).sort((a, b) => socketsNames[a].localeCompare(socketsNames[b])).forEach((x) => {
	comboSocketsList.innerHTML += `<option value="${x}">${socketsNames[x]}</option>`;
});

renderComboFilters();

function showComboSeed(seed, sock) {
	moveToNode(sock);
	seedinput.value = seed;
	seedSearch();
};

function addComboSkillFilter() {
	let s = comboSkillsList.value;
	// if (combo.skills.hasOwnProperty(s)) return;
	let a =  parseInt(comboSkillAmount.value, 10);
	combo.skills[s] = a > 1 ? a : 1;
	renderComboFilters();
};

function toggleComboFilters() {
	comboFilters.style.display = (comboFilters.style.display === 'block' || !comboFilters.style.display) ? 'none':'block';
};

function addComboSocketFilter() {
	combo.sockets.add(comboSocketsList.value);
	renderComboFilters();
};

function addAllSockets() {
	Object.keys(socketsNames).forEach((x) => {
		combo.sockets.add(x);
	});
	renderComboFilters();
};

function delComboSocketFilter(s) {
	combo.sockets.delete(s);
	renderComboFilters();
};

function delComboSkillFilter(e) {
	delete combo.skills[e];
	renderComboFilters();
};

function searchCombos() {
	combo.result = [];
	let resLimit = 80;
	Object.keys(seedsInfo).forEach(seed => {
		if (combo.result.length > resLimit) return;
		Object.keys(seedsInfo[seed]).forEach(socket => {
			if (!combo.sockets.has(socket)) return;
			
			let counts = {};
			seedsInfo[seed][socket].forEach((x) => {
				counts[x] = (counts[x] || 0) + 1;
			});
			
			let pass = Object.keys(combo.skills).every(x => {
				return !!counts[x] && counts[x] >= combo.skills[x];
			});
			
			if (pass) {
				combo.result.push({ seed: seed, socket: socket });
			};
		});
	});
	if (combo.result.length > resLimit) {
		comboResult.innerHTML = 'TOO MUCH RESULTS';
	} else {
		renderComboResult();
	};
	
};

function renderComboResult() {
	comboResult.innerHTML = '';
	combo.result.sort((a, b) => a.socket.localeCompare(b.socket));
	if (combo.result.length == 0) {
		comboResult.innerHTML += `<div>NO RESULT</div>`;
	} else {
		combo.result.forEach(x => {
			comboResult.innerHTML += `<div onclick="showComboSeed(${x.seed},${x.socket})">Seed: ${x.seed} Socket: ${ x.socket }</div>`;
		});
	};
	
	comboFilters.style.display = 'none';
};

function renderComboFilters() {
	comboSkillsFilterList.innerHTML = '';
	comboSocketsFilterList.innerHTML = '';
	Object.keys(combo.skills).forEach(x => {
		comboSkillsFilterList.innerHTML += `<div><button onclick="delComboSkillFilter(${x})">DEL</button>${combo.skills[x]} x ${ legionjewelsinfo[x].sd['1'] }</div>`;
	});
	
	combo.sockets.forEach(x => {
		comboSocketsFilterList.innerHTML += `<div><button onclick="delComboSocketFilter('${x}')">DEL</button>${ socketsNames[x] }</div>`;
	});
	
	combo.sockets = [...combo.sockets];
	localStorage.setItem('combos', JSON.stringify(combo));
	combo.sockets = new Set(combo.sockets);
};