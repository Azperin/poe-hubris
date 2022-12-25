let canvas = document.getElementById("treeCanvas");
let ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.lineWidth = .3;
ctx.font = 'bold 12px serif';
let scale = 0.2;
// let scale = Math.min(window.innerHeight / 3748, window.innerWidth / 7700);
let clearRect = [ passiveSkillTreeData.min_x * scale, passiveSkillTreeData.min_y * scale, (Math.abs(passiveSkillTreeData.min_x) + passiveSkillTreeData.max_x) * scale, (Math.abs(passiveSkillTreeData.min_y) + passiveSkillTreeData.max_y) * scale ];
let shouldMoveCanvas = false;
const xOffset = Math.abs(passiveSkillTreeData.min_x * scale);
const yOffset = Math.abs(passiveSkillTreeData.min_y * scale);
let sockets = passiveSkillTreeData.jewelSockets;
let searchSeed = '';
let diffColors = ['red', 'orange', 'green','blue','indigo','violet','pink','gold','brown','purple'];
let currentCenterNode = '58833';
ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
applyScale(scale);
drawSkillTree();

function drawSkillTree() {
	ctx.font = '12px serif';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = .3;
	// ctx.clearRect( ...clearRect );
	
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	ctx.fillStyle = 'black';
	Object.values(passiveSkillTreeData.nodes).forEach((node, i) => {
		ctx.beginPath();
		ctx.fillStyle = node.inRadiusOfJewels.length > 0 ? 'red':'black';
		ctx.arc(node.pos.x, node.pos.y , 2, 0, 2 * Math.PI);
		ctx.fill();
		// ctx.fillText(`${node.skill}`, node.pos.x - 15 , node.pos.y - 10);
		ctx.fillStyle = 'black';
		
		if (node.isJewelSocket) {
			ctx.strokeStyle = 'blue';
			ctx.beginPath();
			ctx.arc(node.pos.x, node.pos.y , 1800 * scale, 0, 2 * Math.PI);
			ctx.stroke();
		};
		ctx.strokeStyle = 'black';
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

function moveToNode(nodeId, e) {
	if (currentCenterNode == nodeId) return;
	if (e) {
		document.querySelectorAll('.cursocket').forEach((z) => z.classList.remove("cursocket"));
		e.classList.add("cursocket");
	};
	
	let x = passiveSkillTreeData.nodes[currentCenterNode].pos.x - passiveSkillTreeData.nodes[nodeId].pos.x;
	let y = passiveSkillTreeData.nodes[currentCenterNode].pos.y - passiveSkillTreeData.nodes[nodeId].pos.y;
	currentCenterNode = nodeId;
	ctx.translate(x, y);
	drawSkillTree();
};

function distanceBetweenDots(dot1, dot2) {
	return Math.sqrt( Math.pow( (dot1.x - dot2.x) ,2) + Math.pow( (dot1.y - dot2.y) ,2) );
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
	
	console.log(s);
	if (seedsInfo.hasOwnProperty(s)) {
		searchSeed = s;
		seedinput.value = s;
	} else {
		searchSeed = '';
		seedinput.value = '';
	};
	
	drawSkillTree();
};

