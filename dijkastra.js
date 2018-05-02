var cols = 25;
var rows = 25;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var nodeW;
var nodeH;
var nosolution = false;
var path = [];

function removeFromSet(openSet , current) {
	for (var i = 0; i<openSet.length; i++) {
		if (openSet[i] === current) {
			openSet.splice(i , 1);
		}
	}
}

function Vertex(i,j) {
	this.xpos = i;
	this.ypos = j;
	this.g = 0;
	this.previous = undefined;
	this.neighbours = [];
	this.walls = false;

	if (random(1) < 0.3) {
		this.walls = true;
	}

	this.colorNode = function(mycolor) {
		fill(mycolor);
		if (this.walls) {
			fill(0);
			noStroke();
			ellipse(this.xpos * nodeW + nodeW / 2 , this.ypos * nodeH + nodeH / 2 , nodeW/2 , nodeH/2);
		}
		
		//rect(this.xpos * nodeW , this.ypos * nodeH , nodeW-1 , nodeH-1);
	}

	//To add neighbours
	this.addNeighbours = function(grid) {
		var tempX = this.xpos;
		var tempY = this.ypos;

		if (tempX > 0) {
			this.neighbours.push(grid[tempX-1][tempY]);
		}

		if (tempX < cols-1) {
			this.neighbours.push(grid[tempX+1][tempY]);
		}

		if (tempY > 0) {
			this.neighbours.push(grid[tempX][tempY-1]);
		}

		if (tempY < rows-1) {
			this.neighbours.push(grid[tempX][tempY+1]);
		}
	}
}

function setup() {
	createCanvas(400,400);
	nodeW = width/cols;
	nodeH = height/rows;
	console.log('Dijkastra');
	
	for (var i=0; i<cols; i++) {
		grid[i] = new Array(rows);
	}

	for (var i=0; i<cols; i++) {
		for (var j=0; j<rows; j++) {
			grid[i][j] = new Vertex(i,j);
		}
	}

	for (var i=0; i<cols; i++) {
		for (var j=0; j<rows; j++) {
			grid[i][j].addNeighbours(grid);
		}
	}
	start = grid[0][0];
	end = grid[cols-1][rows-1];
	start.walls = false;
	end.walls = false;
	openSet.push(start);

}

function draw() {
	//console.log(grid);
	if(openSet.length > 0) {
		var smallest = 0;
		for (var i=0; i<openSet.length; i++) {
			if (openSet[i].g < openSet[smallest].g) {
				smallest = i;
			}
		}

		var current = openSet[smallest];
		removeFromSet(openSet , current);
		closedSet.push(current);
		var neighboursOfCurrent = current.neighbours;
		for (var i = 0; i < neighboursOfCurrent.length; i++) {
			var neighbour = neighboursOfCurrent[i];

			if (!neighbour.walls) {
				if (closedSet.includes(neighbour)) {
				continue;
				}

				else {

					var tempG = current.g + 1;
					if (openSet.includes(neighbour)) {
						if (tempG < neighbour.g) {
							neighbour.g = tempG;
						}
					}

					else {
						neighbour.g = tempG;
						openSet.push(neighbour);
					}
				}
			}

			neighbour.previous = current;
		}
		//console.log(neighboursOfCurrent);

		if (current === end) {
			console.log(current.g);
			console.log('We are done');
			noLoop();
		}
	}

	else {
		console.log('No Solution');
		nosolution = true;
		noLoop();
	}
	background(255);

	for (var i=0; i<cols; i++) {
		for (var j=0; j<rows; j++) {
			grid[i][j].colorNode(color(255));
		}
	}

	for (var i=0; i<openSet.length; i++) {
		//openSet[i].colorNode(color(0,255,0));
	}

	for (var i=0; i<closedSet.length; i++) {

		//closedSet[i].colorNode(color(255,0,0));
	}

	if (!nosolution) {
		path = [];
		var temp = current;
		path.push(current);
		while (temp.previous) {
			path.push(temp.previous);
			temp = temp.previous;
		}
	}
	for (var i=0; i<path.length; i++) {
		//path[i].colorNode(color(255,0,200));
	}

	noFill();
	stroke(255,0,200);
	strokeWeight(nodeW/2);
	beginShape();
	for (var i=0; i<path.length; i++) {
		vertex(path[i].xpos * nodeW + nodeW/2 , path[i].ypos * nodeH + nodeH/2);
	}
	endShape();
	//noLoop();
}