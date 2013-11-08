//TODO: Handle data as object
function FHeap(){}

FHeap.prototype = {
	min:null,
	maxRank:0
}

FHeap.prototype.traverse = function(start, deleteLink){
	var root = start;
	var nextRoot = start.next;	
	while(nextRoot != start){
		console.log(root.data);
		if(deleteLink){
			root.linked = false;
		}
		//showChildren
		if(root.child != null){
			this.traverse(root.child);
		}
		root = nextRoot;
		nextRoot = nextRoot.next;
	}
	if(start == nextRoot){
		console.log(root.data);
		if(deleteLink){
			root.linked = false;
		}
		if(root.child != null){
			this.traverse(root.child);
		}
	}
	return;
};

FHeap.prototype._showChildren = function(parent){

}

FHeap.prototype.insert = function(data){
	var item = new FHeap.Node(data);
	item.rank = 1;
	if(this.maxRank == 0){
		this.maxRank = 1;
	}
	if(this.min == null){
		this.min = item;
		this.min.next = this.min;
		this.min.prev = this.min;
	} else {
		item.prev = this.min;
		item.next = this.min.next;
		this.min.next = item;
		item.next.prev = item;
		this._checkIfMin(item);
	}
};

FHeap.prototype._checkIfMin = function(item){
	if(item.data < this.min.data){
		var prevItem = this._clone(this.min);
		this.min.prev.next = prevItem;
		this.min.next.prev = prevItem;
		if(this.min.child){
			this.min.child.parent = prevItem;	
		}
		this.min = item;
	}
};

FHeap.prototype.findMin = function(){
	return this._clone(this.min);
};

FHeap.prototype.deleteMin = function(){
	/*
		1.Find the minimum - it is there in the min pointer
		2.any children? bring them to rootlist.
		3. no children? connect left and right.
		4. no left and right? make children roots 
		5. no left and right? no children? empty heap
		6. Rootlist queue
		7. pop from queue and put in rank array
		8. if clash, link the heaps and push to queue.
		9. till queue is empty.
		10.scan the rank array, create new heap
		11. point min to right one.
	*/
	var min = this.findMin();
	this._removeMin();
	if(this.min == null){
		return min.data;
	}
	var rootlist = this._createRootList();
	this._consolidateHeap(rootlist);
	return min.data;
};

FHeap.prototype._removeMin = function(){
	var min = this.min;
	var prev = min.prev;
	var next = min.next;
	var firstChild = min.child;
	if(firstChild == null && prev == min && next == min){
		this.min = null;
		this.maxRank = 0;
		console.log('Empty Heap');
		return;
	}
	if(prev == min && next == min){
		this.min = firstChild;
		var child = this._clone(firstChild);
		while(child.next !== firstChild){
			child.parent = null;
			child = child.next;
		}
		firstChild.parent = null;
		return;
	} 
	if(firstChild == null){
		prev.next = next;
		next.prev = prev;
		return;
	}
	var lastChild = firstChild.prev;
	firstChild.prev = prev;
	lastChild.next = next;
	prev.next = firstChild;
	next.prev = lastChild;
	return;
};

FHeap.prototype._createRootList = function(){
	var rootlist = new FHeap.Queue();
	var loopItem = this.min.prev;
	var compareItem = loopItem;
	do{
		rootlist.pushItem(loopItem);
		loopItem = loopItem.next;
	}while(loopItem !== compareItem);
	return rootlist;
};

FHeap.prototype._makeLink = function(item, prevItem){
	var combinedRank = prevItem.rank + item.rank;
	var lesserItem = item;
	var greaterItem = prevItem;
	var firstChild = null;
	var lastChild = null;
	if(item.data > prevItem.data){
		lesserItem = prevItem;
		greaterItem = item;
	}
	lesserItem.rank = combinedRank;
	firstChild = lesserItem.child;
	if(firstChild == null){
		lesserItem.child = greaterItem;
		greaterItem.prev = greaterItem.next = greaterItem;
	}else{
		lastChild = firstChild.prev;
		lastChild.next = greaterItem;
		greaterItem.next = firstChild;
		greaterItem.prev = lastChild;
		firstChild.prev = greaterItem;
	}
	greaterItem.parent = lesserItem;
	return lesserItem;
};

FHeap.prototype._consolidateHeap = function(rootlist){
	var rankArray = [];
	while(rootlist.length != 0){
		var item = rootlist.popItem();
		var presentItem = rankArray[item.rank]
		if(presentItem != null && presentItem !== undefined){
			rankArray[item.rank] = null;
			var toInsert = this._makeLink(item, presentItem);
			if(toInsert.rank > this.maxRank){
				this.maxRank = toInsert.rank;
			}
			rootlist.pushItem(toInsert);
		} else{
			rankArray[item.rank] = item;
		}
	};
	this.min = null;
	//get a filled array from rankArray because rankArray will have gaps.
	var fillArray = [];
	var k = 0;
	for(var j = 1;j<rankArray.length;j++){
		item = rankArray[j];
		if(item !== null && item !== undefined){
			fillArray[k] = item;
			k = k+1;
		}
	}
	for(var i = 0;i<fillArray.length;i++){
		item = fillArray[i];
		//set min
		if(this.min == null){
			this.min = item;
		} else if(this.min.data > item.data){
			this.min = item;
		}
		prevItem = fillArray[i-1];
		nextItem = fillArray[i+1];
		if(prevItem == undefined && nextItem == undefined){
			item.prev = item;
			item.next = item;
			return;
		} else if(prevItem == undefined){
			prevItem = fillArray[fillArray.length -1];
		} else if(nextItem == undefined){
			nextItem = fillArray[1];
		}
		item.prev = prevItem;
		prevItem.next = item;
		item.next = nextItem;
		nextItem.prev = item;
	}
	return this.min;
};





FHeap.Queue = function(){};
FHeap.Queue.prototype = {
	length:0,
	first:null,
	last:null,
};

FHeap.Queue.prototype.pushItem = function(data){
	var qitem = new FHeap.QNode(data);
	if(this.first == null){
		this.first = this.last = qitem;
	} else {
		this.last.next = qitem;
		this.last = qitem;
	}
	this.length++;
	return qitem;
};

FHeap.Queue.prototype.popItem = function(){
	var data = this.first.data;
	if(this.first.next != null){
		this.first = this.first.next;	
	} else{
		this.first = this.last = null;
	}
	this.length--;
	return data;
};



FHeap.QNode = function(data){
	this.data = data;
	this.next = null;
}

FHeap.Node = function(data){
	this.data = data;
	this.parent = null;
	this.child = null;
	this.prev = null;
	this.next = null;
	this.mark = false;
	this.rank = 0;
	this.linked = false;
}

FHeap.prototype._clone = function(item){
	var cloned = new FHeap.Node();
	cloned.prev = item.prev;
	cloned.next = item.next;
	cloned.parent = item.parent;
	cloned.child = item.child;
	cloned.mark = item.mark;
	cloned.rank = item.rank;
	cloned.data = item.data;
	cloned.linked = item.linked;
	return cloned;

}

window.FHeap = FHeap;

