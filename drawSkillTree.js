let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.lineWidth = .3;
ctx.font = 'bold 12px serif';
let scale = Math.min(window.innerHeight / 3748, window.innerWidth / 7700);
let clearRect = [ passiveSkillTreeData.min_x * scale, passiveSkillTreeData.min_y * scale, (Math.abs(passiveSkillTreeData.min_x) + passiveSkillTreeData.max_x) * scale, (Math.abs(passiveSkillTreeData.min_y) + passiveSkillTreeData.max_y) * scale ];
let shouldMoveCanvas = false;
const xOffset = Math.abs(passiveSkillTreeData.min_x * scale);
const yOffset = Math.abs(passiveSkillTreeData.min_y * scale);
let sockets = {
	'21984': [44102,32345,45608,52031,44824,55114,9567,47306,12143,6615,22535,41476,16243,10153,38849], // witch right LCJ
	'61419': [38246,9432 ,21460 ,24362 ,21958 ,44955 ,22972 ,34506 ,10115 ,37403 ,15400 ,11645 ,35233 ,62577 ,20528 ,56716 ,8833 ,7918 ,18174 ,11924 ,27163 ,27611], // witch center
	'7960': [65273,63944,64395,19897,5456,39986,50029,35685,56029,22702,25970,6770,26620], // witch left LCJ
	'36634': [53493,7688,53802,11820,23690,11420,34661,4854,21330], // witch left bot
	'41263': [27929,10511,18865,11784,25439,61982,9788], // witch right bot
	
	'61834': [32176,46965,41989,42443,36490,25411,27788,46408,47065,60737,54791,33903,15614,42804,47484,24050,8001,1405,42686,18707,8920], // shadow right TOP
	'33989': [44988,7136,62094,32227,9015,47471,50690,30471,48698,50338,6799,53114], // shadow left center
	'32763': [17608,21228,24133,63251,65502,9535,31359,8001,1405,7069,4481,45329,31585,], // shadow right LCJ
	'60735': [31508,17608,49459,2715,43385,37504,24133,63251,65502,7263,51881,7085,19858,49621,48614,17171,45329,31585,], // shadow right bot
	
	'34483': [36736,48807,40743,42720,52230,36687,42041,63727,48823,], // duelist right top
	'46882': [57199,570,41595,63921,65093,19069,8458,54268,6,52090,], // duelist right bot LCJ
	'54127': [49416,49538,34666,48807,34009,59766,25456,24721,544,1325,23066,34973,15437,32059,4833,48438,60002,54776,44207,14813,21435,19730,], // duelist center
	'28475': [50858,26294,60031,27301,57900,12809,2225,], // duelist left top
	'2491': [13922,65107,57839,30439,10016,27119,], // duelist left bot LCJ
	
	'26725': [56359,53118,37326,64077,4940,33287,35663,26023,24858,65308,31033,58831,10542,23038,30302,861,63422,], // templar left bot
	'55190': [53757,39761,27137,42917,16703,58831,51559,26564,40645,], // templar center LCJ
	'26196': [54694,51108,27137,21389,51559,36949,34173,35958,11730,33435,30693,14665,44347,13164,], // templar left top
	'33631': [36859,50197,27308,20832,49445,26866,46471,24256,21413,32245,55772,], //templar center right
	
	'6230': [45317,44788,10835,55485,63933,34591,45803,63976,37078,12702,3452,1006,28878,21973,26960,], //scion top left
	'48768': [44788,53042,33545,19506,30471,65097,37078,49379,4207,45067,3452,1006,44103,21602,],// scion top right
	'31683': [53042,55485,63933,5289,19506,34591,19144,49379,4207,12702,44103,21634,], // scion bot center
};
let diffColors = ['red', 'orange', 'green','blue','indigo','violet','pink','gold','brown','purple'];
let currentCenterNode = '58833';
let searchSeed = '';
ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
applyScale(scale);
drawSkillTree();

function drawSkillTree() {
	ctx.font = '12px serif';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = .3;
	ctx.clearRect( ...clearRect );
	ctx.fillStyle = 'black';
	Object.values(passiveSkillTreeData.nodes).forEach((node, i) => {
		ctx.beginPath();		
		ctx.arc(node.pos.x, node.pos.y , 1.3, 0, 2 * Math.PI);
		ctx.fill();
		// ctx.fillText(`${node.skill}`, node.pos.x - 15 , node.pos.y - 10);
	});

	passiveSkillTreeData.edges.forEach(edge => {
		
		if (edge.isArc) {
			ctx.beginPath();
			ctx.arc(...edge.arc); 
			ctx.stroke();
		} else {
			ctx.beginPath();
			ctx.moveTo( ...edge.moveTo );
			ctx.lineTo( ...edge.lineTo );
			ctx.stroke();
		};
	});
	
	if (seedsInfo.hasOwnProperty(searchSeed) && seedsInfo[searchSeed].hasOwnProperty(currentCenterNode)) {
		// отрисовываем результаты поиска
		ctx.fillStyle = "white";
		let rectX = Math.floor(passiveSkillTreeData.nodes[currentCenterNode].pos.x + ctx.canvas.width / 2) - 350;
		let rectY = Math.floor(passiveSkillTreeData.nodes[currentCenterNode].pos.y - ctx.canvas.height / 2) - 2;
		ctx.fillRect(rectX, rectY, 350, ctx.canvas.height);
		
		ctx.fillStyle = "black";
		let s = seedsInfo[searchSeed][currentCenterNode].reduce((acc, v, i) => {
			if (!acc.hasOwnProperty(v)) {
				acc[v] = [];
			};
			acc[v].push( sockets[currentCenterNode][i] );
			
			return acc;
		}, {});
		
		ctx.strokeStyle = '#FF0000';
		ctx.lineWidth = .5;
		// ctx.setLineDash([25, 5]);
		Object.keys(s).sort((a,b) => {
			return s[b].length - s[a].length;
		}).filter(x => {
			if (comboMod) {
				return combo.skills.hasOwnProperty(x);
			} else {
				if (filters.tIgnore) return true;
				return s[x].length >= filters.min && s[x].length >= filters.skills[x].min && filters.skills[x].show;
			};
		}).forEach((x, i) => {
			let textX = rectX + 5;
			let textY = rectY + 20 + (i * 50);
			ctx.fillStyle = diffColors[i] ?? 'black';
			ctx.strokeStyle = diffColors[i] ?? 'black';
			
			ctx.font = 'bold 24px serif';
			ctx.fillText(`${legionjewelsinfo[x].sd['1']}`, textX, textY);
			ctx.font = '12px serif';
			ctx.fillText(`${legionjewelsinfo[x].name} (${s[x].length})`, textX, textY + 15);
			
			
			s[x].forEach(q => {
				ctx.beginPath();
				ctx.moveTo( textX, textY );
				ctx.lineTo( passiveSkillTreeData.nodes[q].pos.x, passiveSkillTreeData.nodes[q].pos.y );
				ctx.stroke();
				
				ctx.beginPath();		
				ctx.arc(passiveSkillTreeData.nodes[q].pos.x, passiveSkillTreeData.nodes[q].pos.y , 6, 0, 2 * Math.PI);
				ctx.fill();
			});
		});
		// ctx.setLineDash([]);
	};	
};

function degreesToRadians(degrees) {
   return degrees * (Math.PI/180);     
};

function radiansToDegrees(radians) {
   return radians * (180/Math.PI);
};

function drawOrbit(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
};

function distanceBetweenDots(dot1, dot2) {
	return Math.sqrt( Math.pow( (dot1.x - dot2.x) ,2) + Math.pow( (dot1.y - dot2.y) ,2) );
};

function drawPoint(x1, y1, r, angle, distance, label = ''){
	var x = x1 + r * Math.cos((angle - 90)*Math.PI/180) * distance;
	var y = y1 + r * Math.sin((angle - 90)*Math.PI/180) * distance;
	ctx.beginPath();
	ctx.arc(x, y, 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillText(label, x + 10, y);
};

function applyScale(scale) {
	Object.values(passiveSkillTreeData.nodes).forEach((node, i) => {
		node.pos.x *= scale;
		node.pos.y *= scale;
	});
	
	passiveSkillTreeData.edges.forEach(edge => {
		if (edge.isArc) {
			edge.arc = [ ...edge.arc.splice(0, 3).map(x => x * scale), ...edge.arc];
		} else {
			edge.moveTo = edge.moveTo.map(x => x * scale);
			edge.lineTo = edge.lineTo.map(x => x * scale);
		};
	});
	
	clearRect = [ passiveSkillTreeData.min_x * scale, passiveSkillTreeData.min_y * scale, (Math.abs(passiveSkillTreeData.min_x) + passiveSkillTreeData.max_x) * scale, (Math.abs(passiveSkillTreeData.min_y) + passiveSkillTreeData.max_y) * scale ];
	
	drawSkillTree();
};

function moveToNode(nodeId) {
	if (currentCenterNode == nodeId) return;
	let x = passiveSkillTreeData.nodes[currentCenterNode].pos.x - passiveSkillTreeData.nodes[nodeId].pos.x;
	let y = passiveSkillTreeData.nodes[currentCenterNode].pos.y - passiveSkillTreeData.nodes[nodeId].pos.y;
	currentCenterNode = nodeId;
	ctx.translate(x, y);
	drawSkillTree();
};

function seedSearch(e) {
	searchSeed = '';
	if (seedinput.value.length < 3) return;
	seedinput.value = seedinput.value.trim();
	let s = '';
	if (seedinput.value.length > 30) {
		s = seedinput.value.split('--------').map(x => x.trim()).filter(x => x.startsWith('Commissioned '));
		if (s.length === 0) {
			s = '';
		} else {
			s = s[0].replaceAll(/[^0-9]/gm, '');
		};
	} else {
		s = seedinput.value.replaceAll(/[^0-9]/gm, '');
	};
	
	if (seedsInfo.hasOwnProperty(s)) {
		searchSeed = s;
		seedinput.value = s;
	} else {
		searchSeed = '';
		seedinput.value = '';
	};
	
	drawSkillTree();
};