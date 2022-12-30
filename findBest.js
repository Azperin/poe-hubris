let weightIDs = {
	'118': { mult: 10, id: 'best_frenzy' },
	'121': { mult: 10, id: 'best_power' },
	'115': { mult: 10, id: 'best_endurance' },
	'131': { mult: 80, id: 'best_minion' },
	'133': { mult: 80, id: 'best_spell' },
	'135': { mult: 80, id: 'best_fireAttack' },
	'136': { mult: 80, id: 'best_coldAttack' },
	'137': { mult: 80, id: 'best_lightAttack' },
	'138': { mult: 80, id: 'best_physDmg' },
	'139': { mult: 80, id: 'best_meleePhysDmg' },
	'141': { mult: 80, id: 'best_projAttack' },
};
bestWeights.innerHTML = '';
let weightedDataFilters = {};

Object.keys(weightIDs).forEach(sid => {
	bestWeights.innerHTML += `<input id="${weightIDs[sid].id}" class="best_input" value="0" type="text" /><label for="${weightIDs[sid].id}">${legionjewelsinfo[sid].sd['1']}</label><br>`;
});

let filteredSockets = JSON.parse(localStorage.getItem('bestsocketfilters') ?? '[]');

bestSocketsFilter.innerHTML = '';
Object.keys(socketsNames).forEach(socket => {
	bestSocketsFilter.innerHTML += `<input id="best_sock_${socket}" onchange="bestFilterSocket(${socket})" type="checkbox" ${filteredSockets.includes(parseInt(socket)) ? '':'checked'} /><label for="best_sock_${socket}">${socketsNames[socket]}</label><br>`;
});
function findBest() {
	// сначала берем веса
	let minIncrease = (parseInt(document.getElementById('bestMinIncreased').value, 10) || 0); // минимальное увелечение дамаги
	
	// это множители, например если мы добавляем 8 к френзи = это тоже самое что взять 1 к спелл дамагу. Если нас не интересует спелл дамаг, то просто ставим 0 или ничего
	let weights = {
		'118': 10 * (parseFloat(document.getElementById('best_frenzy').value, 10) || 0),
		'121': 10 * (parseFloat(document.getElementById('best_power').value, 10) || 0),
		'115': 10 * (parseFloat(document.getElementById('best_endurance').value, 10) || 0),
		'131': 80 * (parseFloat(document.getElementById('best_minion').value, 10) || 0),
		'133': 80 * (parseFloat(document.getElementById('best_spell').value, 10) || 0),
		'135': 80 * (parseFloat(document.getElementById('best_fireAttack').value, 10) || 0),
		'136': 80 * (parseFloat(document.getElementById('best_coldAttack').value, 10) || 0),
		'137': 80 * (parseFloat(document.getElementById('best_lightAttack').value, 10) || 0),
		'138': 80 * (parseFloat(document.getElementById('best_physDmg').value, 10) || 0),
		'139': 80 * (parseFloat(document.getElementById('best_meleePhysDmg').value, 10) || 0),
		'141': 80 * (parseFloat(document.getElementById('best_projAttack').value, 10) || 0),
	};
	
	weightedDataFilters = JSON.parse(JSON.stringify(filters));
	weightedDataFilters.min = 1;
	weightedDataFilters.tIgnore = false;
	
	Object.keys(weightedDataFilters.skills).forEach(skill => {
		weightedDataFilters.skills[skill].min = 1;
		weightedDataFilters.skills[skill].show = weights[skill] > 0;
	});
	
	Object.keys(weights).forEach(skill => {
		if (weights[skill] > 0) {
			weightedDataFilters.skills[skill] = { min: 1, show: true };
		} else {
			
		};
	});
	
	let result = [];
	
	Object.keys(seedsInfo).forEach(seed => {
		// каждый сид обрабатываем по каждому сокету
		
		Object.keys(seedsInfo[seed]).forEach(socket => {
			if (filteredSockets.includes(parseInt(socket, 10))) return;
			
			let totalSocketWeight = 0;
			seedsInfo[seed][socket].forEach(skill => {
				totalSocketWeight += (weights[skill] ?? 0);
			});
			
			if (totalSocketWeight < minIncrease) return;
			result.push({
				seed: seed,
				socket: socket,
				weight: totalSocketWeight
			});
		});
	});
	
	let resultEL = document.getElementById('bestResult');
	resultEL.innerHTML = '';
	if (result.length === 0) {
		resultEL.innerHTML = 'NO RESULT';
	} else {
		result.sort((a,b) => {
			return  b.weight - a.weight; 
		}).slice(0, 20).forEach(x => {
			resultEL.innerHTML += `<div onclick="showBestSeed(${x.seed},${x.socket}, this)">${ x.seed }<br>Summary damage: ${x.weight}</div>`;
		});
		
	};
};

function bestFilterSocket(socket) {
	let idx = filteredSockets.indexOf(socket);
	if (idx === -1) {
		filteredSockets.push(socket);
	} else {
		filteredSockets.splice(idx, 1);
	};
	localStorage.setItem('bestsocketfilters', JSON.stringify(filteredSockets));
};

function showBestSeed(seed, sock, e) {
	copySeedForTrade(seed);
	moveToNode(sock);
	seedinput.value = seed;
	
	document.querySelectorAll('.bestchoosed').forEach((z) => z.classList.remove("bestchoosed"));
	e.classList.add("bestchoosed");
	
	// фильтры поиска нужно также поставить в соответствии, либо сделать игнор всего
	let oldFilters = JSON.stringify(filters);
	filters = weightedDataFilters;
	seedSearch();
	filters = JSON.parse(oldFilters);
};
