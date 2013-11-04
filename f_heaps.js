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
	var returnObj = this.min.data;
	this._removeMin();
	if(this.min.next !== this.min){
		this._consolidateHeaps();
	};
	
};

FHeap.prototype._getUnlinkedRoot = function(root){
	var testRoot = root;
	var nextRoot = testRoot.next;
	///TODO: Should have a better test here to determine. Think more.
	while(testRoot.linked == true && root.data !== nextRoot.data){
		testRoot = nextRoot;
		nextRoot = testRoot.next;
	}
	if(root.data == nextRoot.data && testRoot.linked == true){
		return null;
	}
	return testRoot;
}

FHeap.prototype._consolidateHeaps = function(){
	this.traverse(this.min.prev, true);
	var root = this.min.prev;
	var nextRoot = this._getUnlinkedRoot(root.next);
	var linkArray = new Array();
	while(nextRoot != null){
		if(linkArray[nextRoot.rank] == null){
			linkArray[nextRoot.rank] = nextRoot;
			nextRoot.linked = true;
		} else {
			var compareItem = linkArray[nextRoot.rank];
			linkArray[nextRoot.rank] = null;
			var newrank = this._makeLink(compareItem, nextRoot);
			if(newrank > this.maxRank){
				this.maxRank = newrank;
			}

		};
		nextRoot = this._getUnlinkedRoot(nextRoot.next);
	};
	//scan array and create new rootlist and find new min
	var min = linkArray[1];
	var prevNode = null;
	for(var i =1;i <=linkArray.length;i++){
		var rootNode = linkArray[i];
		if(rootNode != undefined){
			if(min == null || min.data > rootNode.data){
				min = rootNode;
			}
			if(prevNode != null){
				prevNode.next.prev = rootNode;
				rootNode.next = prevNode.next;
				prevNode.next = rootNode;
				rootNode.prev = prevNode;
			} else {
				rootNode.next = rootNode.prev = rootNode;
			}
		}	
		prevNode = rootNode;
	};
	this.min = min;
};

FHeap.prototype._makeLink = function(item1, item2){
	var greater = item1;
	var lesser = item2;
	if(item1.data < item2.data){
		greater = item2;
		lesser = item1;
	};
	greater.prev.next = greater.next;
	greater.next.prev = greater.prev;
	var firstchild = lesser.child;
	greater.parent = lesser;
	lesser.rank = lesser.rank + greater.rank;
	if(firstchild != null){
		var lastchild = firstchild.prev;
		lastchild.next = greater;
		greater.prev = lastchild;
		firstchild.prev = greater;
		greater.next = firstchild;
	} else {
		lesser.child = greater;
		greater.prev = greater.next = greater;
	}
	lesser.linked = false;
	return lesser.rank;
};

FHeap.prototype._removeMin = function(){
	var min = this._clone(this.min);
	var right = min.next;
	var left = min.prev;
	if(right ===left){
		if(min.child){
			min.child.parent = null;
			this.min = min.child;
		} else if(right.data === min.data){
			this.min = null;
			this.maxRank =0;
			console.log('fheap emptied');
		} else {
			this.min = right;
			right.prev = right.next = right;
		}
		return;
	}
	if(min.child){
		min.child.parent = null;
		var firstchild = min.child;
		var lastchild = firstchild.prev;
		left.next = firstchild;
		firstchild.prev = left;
		right.prev = lastchild;
		lastchild.next = right;
	} else {
		right.prev = left;
		left.next = right;
	};
	
};

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

