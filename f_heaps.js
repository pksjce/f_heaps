function FHeap(){}

FHeap.prototype = {
	min:null,
	maxRank:0
}

FHeap.prototype.insert = function(data){
	var item = new FHeap.Node(data);
	item.rank = 1;
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

FHeap.Node = function(data){
	this.data = data;
	this.parent = null;
	this.child = null;
	this.prev = null;
	this.next = null;
	this.mark = false;
	this.rank = 0;
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
	return cloned;

}

window.FHeap = FHeap;

