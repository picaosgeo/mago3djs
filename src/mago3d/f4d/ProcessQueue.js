'use strict';

/**
 * ProcessQueue
 * 
 * @alias ProcessQueue
 * @class ProcessQueue
 */
var ProcessQueue = function() 
{
	if (!(this instanceof ProcessQueue)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	this.nodesToDeleteMap = {};
	this.nodesToDeleteModelReferencesMap = {};
	this.nodesToDeleteLessThanLod3Map = {};
};

ProcessQueue.prototype.putNodeToDeleteLessThanLod3 = function(node, aValue)
{
	// provisionally "aValue" can be anything.
	if (aValue === undefined)
	{ aValue = 0; }

	if (node.data === undefined || node.data.neoBuilding === undefined)
	{ return; }
	
	var key = node.data.neoBuilding.buildingId;
	this.nodesToDeleteLessThanLod3Map[key] = node;
	
	//this.nodesToDeleteLessThanLod3Map.set(node, aValue);
};

ProcessQueue.prototype.eraseNodeToDeleteLessThanLod3 = function(node)
{
	// this erases the node from the "nodesToDeleteLessThanLod3Map".
	if (node.data === undefined || node.data.neoBuilding === undefined)
	{ return; }
	
	var key = node.data.neoBuilding.buildingId;
	if (this.nodesToDeleteLessThanLod3Map.hasOwnProperty(key)) 
	{
		delete this.nodesToDeleteLessThanLod3Map[key];
		return true;
	}
	return false;
	//return this.nodesToDeleteLessThanLod3Map.delete(node);
};

ProcessQueue.prototype.putNodeToDeleteModelReferences = function(node, aValue)
{
	// this puts the node to the "nodesToDeleteModelReferencesMap".
	// provisionally "aValue" can be anything.
	if (aValue === undefined)
	{ aValue = 0; }

	if (node.data === undefined || node.data.neoBuilding === undefined)
	{ return; }
	
	var key = node.data.neoBuilding.buildingId;
	this.nodesToDeleteModelReferencesMap[key] = node;
	//this.nodesToDeleteModelReferencesMap.set(node, aValue);
};

ProcessQueue.prototype.eraseNodeToDeleteModelReferences = function(node)
{
	// this erases the node from the "nodesToDeleteModelReferencesMap".
	if (node.data === undefined || node.data.neoBuilding === undefined)
	{ return; }
	
	var key = node.data.neoBuilding.buildingId;
	if (this.nodesToDeleteModelReferencesMap.hasOwnProperty(key)) 
	{
		delete this.nodesToDeleteModelReferencesMap[key];
		return true;
	}
	return false;
	//return this.nodesToDeleteModelReferencesMap.delete(node);
};

ProcessQueue.prototype.putNodeToDelete = function(node, aValue)
{
	// this puts the node to the "nodesToDeleteMap".
	// provisionally "aValue" can be anything.
	if (aValue === undefined)
	{ aValue = 0; }

	if (node.data === undefined || node.data.neoBuilding === undefined)
	{ return; }
	
	var key = node.data.neoBuilding.buildingId;
	this.nodesToDeleteMap[key] = node;
};

ProcessQueue.prototype.putNodesArrayToDelete = function(nodesToDeleteArray, aValue)
{
	if (nodesToDeleteArray === undefined)
	{ return; }
	
	// this puts the nodesToDeleteArray to the "nodesToDeleteArray".
	// provisionally "aValue" can be anything.
	if (aValue === undefined)
	{ aValue = 0; }
	
	var nodesToDeleteCount = nodesToDeleteArray.length;
	for (var i=0; i<nodesToDeleteCount; i++)
	{
		this.putNodeToDelete(nodesToDeleteArray[i], aValue);
	}
};

ProcessQueue.prototype.eraseNodeToDelete = function(node)
{
	// this erases the node from the "nodesToDeleteMap".
	var key = node.data.neoBuilding.buildingId;
	if (this.nodesToDeleteMap.hasOwnProperty(key)) 
	{
		delete this.nodesToDeleteMap[key];
		return true;
	}
	return false;
};

ProcessQueue.prototype.clearAll = function()
{
	this.nodesToDeleteMap = {};
	this.nodesToDeleteModelReferencesMap = {};
};


