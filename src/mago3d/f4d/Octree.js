'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class Octree
 *
 * @param octreeOwner 변수
 */
var Octree = function(octreeOwner) 
{
	if (!(this instanceof Octree)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	// Note: an octree is a cube, not a box.***
	this.centerPos = new Point3D();
	this.half_dx = 0.0; // half width.***
	this.half_dy = 0.0; // half length.***
	this.half_dz = 0.0; // half height.***

	this.octree_owner;
	this.octree_level = 0;
	this.octree_number_name = 0;
	this.neoBuildingOwnerId;
	this.octreeKey;
	this.distToCamera;
	this.triPolyhedronsCount = 0; // no calculated. Readed when parsing.***
	this.fileLoadState = CODE.fileLoadState.READY;

	if (octreeOwner) 
	{
		this.octree_owner = octreeOwner;
		this.octree_level = octreeOwner.octree_level + 1;
	}

	this.subOctrees_array = [];
	this.neoReferencesMotherAndIndices; // Asimetric mode.***
	this.lowestOctrees_array; // pre extract lowestOctrees for speedUp, if this is motherOctree.***

	// now, for legoStructure.***
	this.lego;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns subOctree 변수
 */
Octree.prototype.new_subOctree = function() 
{
	var subOctree = new Octree(this);
	subOctree.octree_level = this.octree_level + 1;
	this.subOctrees_array.push(subOctree);
	return subOctree;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.deleteObjectsModelReferences = function(gl, vboMemManager) 
{
	if (this.neoReferencesMotherAndIndices)
	{ this.neoReferencesMotherAndIndices.deleteObjects(gl, vboMemManager); }

	this.neoReferencesMotherAndIndices = undefined;

	// delete the blocksList.***
	if (this.neoRefsList_Array !== undefined) 
	{
		for (var i=0, neoRefListsCount = this.neoRefsList_Array.length; i<neoRefListsCount; i++) 
		{
			if (this.neoRefsList_Array[i]) 
			{
				this.neoRefsList_Array[i].deleteObjects(gl, vboMemManager);
			}
			this.neoRefsList_Array[i] = undefined;
		}
		this.neoRefsList_Array = undefined;
	}

	if (this.subOctrees_array !== undefined) 
	{
		for (var i=0, subOctreesCount = this.subOctrees_array.length; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].deleteObjectsModelReferences(gl, vboMemManager);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.deleteObjects = function(gl, vboMemManager) 
{
	if (this.lego !== undefined) 
	{
		this.lego.deleteObjects(gl, vboMemManager);
		this.lego = undefined;
	}
	
	this.legoDataArrayBuffer = undefined;
	if (this.centerPos)
	{ this.centerPos.deleteObjects(); }
	this.centerPos = undefined;
	this.half_dx = undefined; // half width.***
	this.half_dy = undefined; // half length.***
	this.half_dz = undefined; // half height.***

	this.octree_owner = undefined;
	this.octree_level = undefined;
	this.octree_number_name = undefined;
	this.distToCamera = undefined;
	this.triPolyhedronsCount = undefined; // no calculated. Readed when parsing.***
	this.fileLoadState = undefined; // 0 = no started to load. 1 = started loading. 2 = finished loading. 3 = parse started. 4 = parse finished.***

	this.neoBuildingOwner = undefined;

	if (this.neoReferencesMotherAndIndices)
	{ this.neoReferencesMotherAndIndices.deleteObjects(gl, vboMemManager); }

	this.neoReferencesMotherAndIndices = undefined;

	// delete the blocksList.***
	if (this.neoRefsList_Array !== undefined) 
	{
		for (var i=0, neoRefListsCount = this.neoRefsList_Array.length; i<neoRefListsCount; i++) 
		{
			if (this.neoRefsList_Array[i]) 
			{
				this.neoRefsList_Array[i].deleteObjects(gl, vboMemManager);
			}
			this.neoRefsList_Array[i] = undefined;
		}
		this.neoRefsList_Array = undefined;
	}

	if (this.subOctrees_array !== undefined) 
	{
		for (var i=0, subOctreesCount = this.subOctrees_array.length; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].deleteObjects(gl, vboMemManager);
			this.subOctrees_array[i] = undefined;
		}
		this.subOctrees_array = undefined;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.deleteLod0GlObjects = function(gl, vboMemManager) 
{
	if (this.neoReferencesMotherAndIndices)
	{ this.neoReferencesMotherAndIndices.deleteObjects(gl, vboMemManager); }

	if (this.subOctrees_array !== undefined) 
	{
		for (var i=0, subOctreesCount = this.subOctrees_array.length; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].deleteLod0GlObjects(gl, vboMemManager);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.deleteLod2GlObjects = function(gl, vboMemManager) 
{
	if (this.lego !== undefined) 
	{
		this.lego.deleteObjects(gl, vboMemManager);
		this.lego = undefined;
	}
	
	if (this.neoReferencesMotherAndIndices)
	{ this.neoReferencesMotherAndIndices.deleteObjects(gl, vboMemManager); }

	if (this.subOctrees_array !== undefined) 
	{
		for (var i=0, subOctreesCount = this.subOctrees_array.length; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].deleteLod2GlObjects(gl, vboMemManager);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.setRenderedFalseToAllReferences = function() 
{
	if (this.neoReferencesMotherAndIndices)
	{
		this.neoReferencesMotherAndIndices.setRenderedFalseToAllReferences();
		var subOctreesCount = this.subOctrees_array.length;
		for (var i=0; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].setRenderedFalseToAllReferences();
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param treeDepth 변수
 */
Octree.prototype.makeTree = function(treeDepth) 
{
	if (this.octree_level < treeDepth) 
	{
		for (var i=0; i<8; i++) 
		{
			var subOctree = this.new_subOctree();
			subOctree.octree_number_name = this.octree_number_name * 10 + (i+1);
			subOctree.neoBuildingOwnerId = this.neoBuildingOwnerId;
			subOctree.octreeKey = this.neoBuildingOwnerId + "_" + subOctree.octree_number_name;
		}

		this.setSizesSubBoxes();

		for (var i=0; i<8; i++) 
		{
			this.subOctrees_array[i].makeTree(treeDepth);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param intNumber 변수
 * @returns numDigits
 */
Octree.prototype.getNumberOfDigits = function(intNumber) 
{
	if (intNumber > 0) 
	{
		var numDigits = Math.floor(Math.log10(intNumber)+1);
		return numDigits;
	}
	else 
	{
		return 1;
	}
};

/**
 * 어떤 일을 하고 있습니까?
 */
Octree.prototype.getMotherOctree = function() 
{
	if (this.octree_owner === undefined) { return this; }

	return this.octree_owner.getMotherOctree();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param octreeNumberName 변수
 * @param numDigits 변수
 * @returns subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1)
 */
Octree.prototype.getOctree = function(octreeNumberName, numDigits) 
{
	if (numDigits === 1) 
	{
		if (octreeNumberName === 0) { return this.getMotherOctree(); }
		else { return this.subOctrees_array[octreeNumberName-1]; }
	}

	// determine the next level octree.***
	var exp = numDigits-1;
	var denominator = Math.pow(10, exp);
	var idx = Math.floor(octreeNumberName /denominator) % 10;
	var rest_octreeNumberName = octreeNumberName - idx * denominator;
	return this.subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param octreeNumberName 변수
 * @returns motherOctree.subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1)
 */
Octree.prototype.getOctreeByNumberName = function(octreeNumberName) 
{
	var motherOctree = this.getMotherOctree();
	var numDigits = this.getNumberOfDigits(octreeNumberName);
	if (numDigits === 1) 
	{
		if (octreeNumberName === 0) { return motherOctree; }
		else { return motherOctree.subOctrees_array[octreeNumberName-1]; }
	}

	if (motherOctree.subOctrees_array.length === 0) { return undefined; }

	// determine the next level octree.***
	var exp = numDigits-1;
	var denominator = Math.pow(10, exp);
	var idx = Math.floor(octreeNumberName /denominator) % 10;
	var rest_octreeNumberName = octreeNumberName - idx * denominator;
	return motherOctree.subOctrees_array[idx-1].getOctree(rest_octreeNumberName, numDigits-1);
};

/**
 * 어떤 일을 하고 있습니까?
 */
Octree.prototype.setSizesSubBoxes = function() 
{
	// Octree number name.********************************
	// Bottom                      Top
	// |---------|---------|     |---------|---------|
	// |         |         |     |         |         |       Y
	// |    3    |    2    |     |    7    |    6    |       ^
	// |         |         |     |         |         |       |
	// |---------+---------|     |---------+---------|       |
	// |         |         |     |         |         |       |
	// |    0    |    1    |     |    4    |    5    |       |
	// |         |         |     |         |         |       |-----------> X
	// |---------|---------|     |---------|---------|

	if (this.subOctrees_array.length > 0) 
	{
		var half_x = this.centerPos.x;
		var half_y = this.centerPos.y;
		var half_z = this.centerPos.z;

		var min_x = this.centerPos.x - this.half_dx;
		var min_y = this.centerPos.y - this.half_dy;
		var min_z = this.centerPos.z - this.half_dz;

		var max_x = this.centerPos.x + this.half_dx;
		var max_y = this.centerPos.y + this.half_dy;
		var max_z = this.centerPos.z + this.half_dz;

		this.subOctrees_array[0].setBoxSize(min_x, half_x, min_y, half_y, min_z, half_z);
		this.subOctrees_array[1].setBoxSize(half_x, max_x, min_y, half_y, min_z, half_z);
		this.subOctrees_array[2].setBoxSize(half_x, max_x, half_y, max_y, min_z, half_z);
		this.subOctrees_array[3].setBoxSize(min_x, half_x, half_y, max_y, min_z, half_z);

		this.subOctrees_array[4].setBoxSize(min_x, half_x, min_y, half_y, half_z, max_z);
		this.subOctrees_array[5].setBoxSize(half_x, max_x, min_y, half_y, half_z, max_z);
		this.subOctrees_array[6].setBoxSize(half_x, max_x, half_y, max_y, half_z, max_z);
		this.subOctrees_array[7].setBoxSize(min_x, half_x, half_y, max_y, half_z, max_z);

		for (var i=0; i<8; i++) 
		{
			this.subOctrees_array[i].setSizesSubBoxes();
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param Min_x 변수
 * @param Max_x 변수
 * @param Min_y 변수
 * @param Max_y 변수
 * @param Min_z 변수
 * @param Max_z 변수
 */
Octree.prototype.setBoxSize = function(Min_X, Max_X, Min_Y, Max_Y, Min_Z, Max_Z) 
{
	this.centerPos.x = (Max_X + Min_X)/2.0;
	this.centerPos.y = (Max_Y + Min_Y)/2.0;
	this.centerPos.z = (Max_Z + Min_Z)/2.0;

	this.half_dx = (Max_X - Min_X)/2.0; // half width.***
	this.half_dy = (Max_Y - Min_Y)/2.0; // half length.***
	this.half_dz = (Max_Z - Min_Z)/2.0; // half height.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns centerPos
 */
Octree.prototype.getCenterPos = function() 
{
	return this.centerPos;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns Math.abs(this.half_dx*1.2);
 */
Octree.prototype.getRadiusAprox = function() 
{
	return this.half_dx*1.7;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_CRefListsArray 변수
 */
Octree.prototype.getCRefListArray = function(result_CRefListsArray) 
{
	if (result_CRefListsArray === undefined) { result_CRefListsArray = []; }

	if (this.subOctrees_array.length > 0) 
	{
		for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getCRefListArray(result_CRefListsArray);
		}
	}
	else 
	{
		if (this.compRefsListArray.length>0) 
		{
			result_CRefListsArray.push(this.compRefsListArray[0]); // there are only 1.***
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_NeoRefListsArray 변수
 */
Octree.prototype.getNeoRefListArray = function(result_NeoRefListsArray) 
{
	if (result_NeoRefListsArray === undefined) { result_NeoRefListsArray = []; }

	var subOctreesArrayLength = this.subOctrees_array.length;
	if (subOctreesArrayLength > 0) 
	{
		for (var i=0; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getNeoRefListArray(result_NeoRefListsArray);
		}
	}
	else 
	{
		if (this.neoRefsList_Array.length>0) // original.***
		//if(this.triPolyhedronsCount>0)
		{
			result_NeoRefListsArray.push(this.neoRefsList_Array[0]); // there are only 1.***
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param cesium_boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.getFrustumVisibleNeoRefListArray = function(cesium_cullingVolume, result_NeoRefListsArray, cesium_boundingSphere_scratch, eye_x, eye_y, eye_z) 
{
	var visibleOctreesArray = [];
	var sortedOctreesArray = [];
	var distAux = 0.0;

	//this.getAllSubOctrees(visibleOctreesArray); // Test.***
	this.getFrustumVisibleOctreesNeoBuilding(cesium_cullingVolume, visibleOctreesArray, cesium_boundingSphere_scratch); // Original.***

	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = visibleOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		visibleOctreesArray[i].setDistToCamera(cameraPosition);
		this.putOctreeInEyeDistanceSortedArray(sortedOctreesArray, visibleOctreesArray[i]);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		sortedOctreesArray[i].getNeoRefListArray(result_NeoRefListsArray);
	}

	visibleOctreesArray = null;
	sortedOctreesArray = null;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.getBBoxIntersectedLowestOctreesByLOD = function(bbox, visibleObjControlerOctrees, globalVisibleObjControlerOctrees,
	bbox_scratch, cameraPosition, squaredDistLod0, squaredDistLod1, squaredDistLod2 ) 
{
	var visibleOctreesArray = [];
	var distAux = 0.0;
	var find = false;

	this.getBBoxIntersectedOctreesNeoBuildingAsimetricVersion(bbox, visibleOctreesArray, bbox_scratch);
	//this.getFrustumVisibleOctreesNeoBuildingAsimetricVersion(cullingVolume, visibleOctreesArray, boundingSphere_scratch); // Original.***

	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = visibleOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		visibleOctreesArray[i].setDistToCamera(cameraPosition);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		if (visibleOctreesArray[i].distToCamera < squaredDistLod0) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles0, visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles0.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].distToCamera < squaredDistLod1) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles1, visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles1.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].distToCamera < squaredDistLod2) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles2, visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles2.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles3, visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles3.push(visibleOctreesArray[i]);
				find = true;
			}
		}
	}

	visibleOctreesArray = null;
	return find;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.getFrustumVisibleLowestOctreesByLOD = function(cullingVolume, visibleObjControlerOctrees, globalVisibleObjControlerOctrees,
	boundingSphere_scratch, cameraPosition, squaredDistLod0, squaredDistLod1, squaredDistLod2) 
{
	var visibleOctreesArray = [];
	var find = false;

	//this.getAllSubOctrees(visibleOctreesArray); // Test.***
	this.getFrustumVisibleOctreesNeoBuildingAsimetricVersion(cullingVolume, visibleOctreesArray, boundingSphere_scratch); // Original.***

	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = visibleOctreesArray.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		visibleOctreesArray[i].setDistToCamera(cameraPosition);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		if (visibleOctreesArray[i].distToCamera < squaredDistLod0) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles0, visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles0.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].distToCamera < squaredDistLod1) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles1, visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles1.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else if (visibleOctreesArray[i].distToCamera < squaredDistLod2) 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles2, visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles2.push(visibleOctreesArray[i]);
				find = true;
			}
		}
		else 
		{
			if (visibleOctreesArray[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ globalVisibleObjControlerOctrees.currentVisibles3.push(visibleOctreesArray[i]); }
				visibleObjControlerOctrees.currentVisibles3.push(visibleOctreesArray[i]);
				find = true;
			}
		}
	}

	visibleOctreesArray = undefined;
	return find;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 * @returns intersects
 */
Octree.prototype.intersectsWithPoint3D = function(x, y, z) 
{
	//this.centerPos = new Point3D();
	//this.half_dx = 0.0; // half width.***
	//this.half_dy = 0.0; // half length.***
	//this.half_dz = 0.0; // half height.***
	var minX = this.centerPos.x - this.half_dx;
	var minY = this.centerPos.y - this.half_dz;
	var minZ = this.centerPos.z - this.half_dz;
	var maxX = this.centerPos.x + this.half_dx;
	var maxY = this.centerPos.y + this.half_dz;
	var maxZ = this.centerPos.z + this.half_dz;
	
	var intersects = false;
	if (x> minX && x<maxX) 
	{
		if (y> minY && y<maxY) 
		{
			if (z> minZ && z<maxZ) 
			{
				intersects = true;
			}
		}
	}
	
	return intersects;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 * @returns intersectedSubBox
 */
Octree.prototype.getIntersectedSubBoxByPoint3D = function(x, y, z) 
{
	if (this.octree_owner === undefined) 
	{
		// This is the mother_cell.***
		if (!this.intersectsWithPoint3D(x, y, z)) 
		{
			return false;
		}
	}
	
	var intersectedSubBox = undefined;
	var subBoxes_count = this.subOctrees_array.length;
	if (subBoxes_count > 0) 
	{
		var center_x = this.centerPos.x;
		var center_y = this.centerPos.y;
		var center_z = this.centerPos.z;
		
		var intersectedSubBox_aux = undefined;
		var intersectedSubBox_idx;
		if (x<center_x) 
		{
			// Here are the boxes number 0, 3, 4, 7.***
			if (y<center_y) 
			{
				// Here are 0, 4.***
				if (z<center_z) { intersectedSubBox_idx = 0; }
				else { intersectedSubBox_idx = 4; }
			}
			else 
			{
				// Here are 3, 7.***
				if (z<center_z) { intersectedSubBox_idx = 3; }
				else { intersectedSubBox_idx = 7; }
			}
		}
		else 
		{
			// Here are the boxes number 1, 2, 5, 6.***
			if (y<center_y) 
			{
				// Here are 1, 5.***
				if (z<center_z) { intersectedSubBox_idx = 1; }
				else { intersectedSubBox_idx = 5; }
			}
			else 
			{
				// Here are 2, 6.***
				if (z<center_z) { intersectedSubBox_idx = 2; }
				else { intersectedSubBox_idx = 6; }
			}
		}
		
		intersectedSubBox_aux = this.subOctrees_array[intersectedSubBox_idx];
		intersectedSubBox = intersectedSubBox_aux.getIntersectedSubBoxByPoint3D(x, y, z);
		
	}
	else 
	{
		intersectedSubBox = this;
	}
	
	return intersectedSubBox;
};

/**
 * 어떤 일을 하고 있습니까?
 */
Octree.prototype.getMinDistToCamera = function(cameraPosition)
{
	// this function returns the minDistToCamera of the lowestOctrees.***
	var minDistToCam = 1000000.0;
	
	if (this.lowestOctrees_array === undefined)
	{
		this.lowestOctrees_array = [];
		this.extractLowestOctreesIfHasTriPolyhedrons(this.lowestOctrees_array);
	}
	
	var distToCamera;
	var lowestOctree;
	var lowestOctreesCount = this.lowestOctrees_array.length;
	for (var i=0; i<lowestOctreesCount; i++)
	{
		lowestOctree = this.lowestOctrees_array[i];
		distToCamera = lowestOctree.centerPos.distToPoint(cameraPosition) - this.getRadiusAprox();
		if (distToCamera < minDistToCam)
		{ minDistToCam = distToCamera; }
	}
	
	return minDistToCam;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cullingVolume 변수
 * @param result_NeoRefListsArray 변수
 * @param boundingSphere_scratch 변수
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.extractLowestOctreesByLOD = function(visibleObjControlerOctrees, globalVisibleObjControlerOctrees,
	boundingSphere_scratch, cameraPosition, squaredDistLod0, squaredDistLod1, squaredDistLod2 ) 
{
	var distAux = 0.0;
	var find = false;
	
	var eye_x = cameraPosition.x;
	var eye_y = cameraPosition.y;
	var eye_z = cameraPosition.z;
	if (this.lowestOctrees_array === undefined)
	{
		this.lowestOctrees_array = [];
		this.extractLowestOctreesIfHasTriPolyhedrons(this.lowestOctrees_array);
	}
	
	// Now, we must sort the subOctrees near->far from eye.***
	var visibleOctrees_count = this.lowestOctrees_array.length;
	for (var i=0; i<visibleOctrees_count; i++) 
	{
		this.lowestOctrees_array[i].setDistToCamera(cameraPosition);
	}

	for (var i=0; i<visibleOctrees_count; i++) 
	{
		if (this.lowestOctrees_array[i].distToCamera < squaredDistLod0) 
		{
			if (this.lowestOctrees_array[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles0, this.lowestOctrees_array[i]); }
				visibleObjControlerOctrees.currentVisibles0.push(this.lowestOctrees_array[i]);
				find = true;
			}
		}
		else if (this.lowestOctrees_array[i].distToCamera < squaredDistLod1) 
		{
			if (this.lowestOctrees_array[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles1, this.lowestOctrees_array[i]); }
				visibleObjControlerOctrees.currentVisibles1.push(this.lowestOctrees_array[i]);
				find = true;
			}
		}
		else if (this.lowestOctrees_array[i].distToCamera < squaredDistLod2) 
		{
			if (this.lowestOctrees_array[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ this.putOctreeInEyeDistanceSortedArray(globalVisibleObjControlerOctrees.currentVisibles2, this.lowestOctrees_array[i]); }
				visibleObjControlerOctrees.currentVisibles2.push(this.lowestOctrees_array[i]);
				find = true;
			}
		}
		else 
		{
			if (this.lowestOctrees_array[i].triPolyhedronsCount > 0) 
			{
				if (globalVisibleObjControlerOctrees)
				{ globalVisibleObjControlerOctrees.currentVisibles3.push(this.lowestOctrees_array[i]); }
				visibleObjControlerOctrees.currentVisibles3.push(this.lowestOctrees_array[i]);
				find = true;
			}
		}
	}

	return find;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param cesium_boundingSphere_scratch 변수
 */
Octree.prototype.getFrustumVisibleOctreesNeoBuilding = function(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch) 
{
	if (this.subOctrees_array.length === 0 && this.neoRefsList_Array.length === 0) // original.***
	//if(this.subOctrees_array.length === 0 && this.triPolyhedronsCount === 0)
	//if(this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }

	// this function has Cesium dependence.***
	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (cesium_boundingSphere_scratch === undefined) { cesium_boundingSphere_scratch = new Cesium.BoundingSphere(); } // Cesium dependency.***

	cesium_boundingSphere_scratch.center.x = this.centerPos.x;
	cesium_boundingSphere_scratch.center.y = this.centerPos.y;
	cesium_boundingSphere_scratch.center.z = this.centerPos.z;

	if (this.subOctrees_array.length === 0) 
	{
	//cesium_boundingSphere_scratch.radius = this.getRadiusAprox()*0.7;
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}
	else 
	{
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}

	var frustumCull = cesium_cullingVolume.computeVisibility(cesium_boundingSphere_scratch);
	if (frustumCull === Cesium.Intersect.INSIDE ) 
	{
		//result_octreesArray.push(this);
		this.getAllSubOctreesIfHasRefLists(result_octreesArray);
	}
	else if (frustumCull === Cesium.Intersect.INTERSECTING  ) 
	{
		if (this.subOctrees_array.length === 0) 
		{
			//if(this.neoRefsList_Array.length > 0) // original.***
			//if(this.triPolyhedronsCount > 0)
			result_octreesArray.push(this);
		}
		else 
		{
			for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++ ) 
			{
				this.subOctrees_array[i].getFrustumVisibleOctreesNeoBuilding(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch);
			}
		}
	}
	// else if(frustumCull === Cesium.Intersect.OUTSIDE) => do nothing.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param boundingSphere_scratch 변수
 */
Octree.prototype.getFrustumVisibleOctreesNeoBuildingAsimetricVersion = function(cullingVolume, result_octreesArray, boundingSphere_scratch) 
{
	//if(this.subOctrees_array.length === 0 && this.neoRefsList_Array.length === 0) // original.***
	if (this.subOctrees_array === undefined) { return; }

	if (this.subOctrees_array.length === 0 && this.triPolyhedronsCount === 0)
	//if(this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }

	if (result_octreesArray === undefined) { result_octreesArray = []; }
	
	if (boundingSphere_scratch === undefined) 
	{ boundingSphere_scratch = new Sphere(); } 

	boundingSphere_scratch.centerPoint.x = this.centerPos.x;
	boundingSphere_scratch.centerPoint.y = this.centerPos.y;
	boundingSphere_scratch.centerPoint.z = this.centerPos.z;
	boundingSphere_scratch.r = this.getRadiusAprox();

	var frustumCull = cullingVolume.intersectionSphere(boundingSphere_scratch);
	if (frustumCull === Constant.INTERSECTION_INSIDE ) 
	{
		//result_octreesArray.push(this);
		this.getAllSubOctreesIfHasRefLists(result_octreesArray);
	}
	else if (frustumCull === Constant.INTERSECTION_INTERSECT  ) 
	{
		if (this.subOctrees_array.length === 0) 
		{
			//if(this.neoRefsList_Array.length > 0) // original.***
			//if(this.triPolyhedronsCount > 0)
			result_octreesArray.push(this);
		}
		else 
		{
			for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++ ) 
			{
				this.subOctrees_array[i].getFrustumVisibleOctreesNeoBuildingAsimetricVersion(cullingVolume, result_octreesArray, boundingSphere_scratch);
			}
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param boundingSphere_scratch 변수
 */
Octree.prototype.getBBoxIntersectedOctreesNeoBuildingAsimetricVersion = function(bbox, result_octreesArray, bbox_scratch) 
{
	//if(this.subOctrees_array.length === 0 && this.neoRefsList_Array.length === 0) // original.***
	if (this.subOctrees_array === undefined) { return; }

	if (this.subOctrees_array.length === 0 && this.triPolyhedronsCount === 0)
	//if(this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }

	if (result_octreesArray === undefined) { result_octreesArray = []; }
	
	if (bbox_scratch === undefined) 
	{ bbox_scratch = new BoundingBox(); } 
	

	bbox_scratch.minX = this.centerPos.x - this.half_dx;
	bbox_scratch.maxX = this.centerPos.x + this.half_dx;
	bbox_scratch.minY = this.centerPos.y - this.half_dy;
	bbox_scratch.maxY = this.centerPos.y + this.half_dy;
	bbox_scratch.minZ = this.centerPos.z - this.half_dz;
	bbox_scratch.maxZ = this.centerPos.z + this.half_dz;

	var intersects = bbox.intersectsWithBBox(bbox_scratch);
	if (intersects)
	{
		this.getAllSubOctreesIfHasRefLists(result_octreesArray);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param cesium_cullingVolume 변수
 * @param result_octreesArray 변수
 * @param cesium_boundingSphere_scratch 변수
 */
Octree.prototype.getFrustumVisibleOctrees = function(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch) 
{
	if (this.subOctrees_array.length === 0 && this.compRefsListArray.length === 0) // For use with ifc buildings.***
	{ return; }
	// old. delete this.***
	// this function has Cesium dependence.***
	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (cesium_boundingSphere_scratch === undefined) { cesium_boundingSphere_scratch = new Cesium.BoundingSphere(); } // Cesium dependency.***

	cesium_boundingSphere_scratch.center.x = this.centerPos.x;
	cesium_boundingSphere_scratch.center.y = this.centerPos.y;
	cesium_boundingSphere_scratch.center.z = this.centerPos.z;

	if (this.subOctrees_array.length === 0) 
	{
	//cesium_boundingSphere_scratch.radius = this.getRadiusAprox()*0.7;
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}
	else 
	{
		cesium_boundingSphere_scratch.radius = this.getRadiusAprox();
	}

	var frustumCull = cesium_cullingVolume.computeVisibility(cesium_boundingSphere_scratch);
	if (frustumCull === Cesium.Intersect.INSIDE ) 
	{
		//result_octreesArray.push(this);
		this.getAllSubOctrees(result_octreesArray);
	}
	else if (frustumCull === Cesium.Intersect.INTERSECTING ) 
	{
		if (this.subOctrees_array.length === 0 && this.neoRefsList_Array.length > 0) 
		{
			result_octreesArray.push(this);
		}
		else 
		{
			for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++ ) 
			{
				this.subOctrees_array[i].getFrustumVisibleOctrees(cesium_cullingVolume, result_octreesArray, cesium_boundingSphere_scratch);
			}
		}
	}
	// else if(frustumCull === Cesium.Intersect.OUTSIDE) => do nothing.***
};

/**
 * 어떤 일을 하고 있습니까?
 * @param eye_x 변수
 * @param eye_y 변수
 * @param eye_z 변수
 */
Octree.prototype.setDistToCamera = function(cameraPosition) 
{
	// distance to camera as a sphere.
	var distToCamera = this.centerPos.distToPoint(cameraPosition) - this.getRadiusAprox();
	this.distToCamera = distToCamera;
	return distToCamera;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param octreesArray 변수
 * @param octree 변수
 * @returns result_idx
 */
Octree.prototype.getIndexToInsertBySquaredDistToEye = function(octreesArray, octree, startIdx, endIdx) 
{
	// this do a dicotomic search of idx in a ordered table.
	// 1rst, check the range.
	
	var range = endIdx - startIdx;
	if (range < 6)
	{
		// in this case do a lineal search.
		var finished = false;
		var i = startIdx;
		var idx;
		var octreesCount = octreesArray.length;
		while (!finished && i<=endIdx)
		{
			if (octree.distToCamera < octreesArray[i].distToCamera)
			{
				idx = i;
				finished = true;
			}
			i++;
		}
		
		if (finished)
		{
			return idx;
		}
		else 
		{
			return endIdx+1;
		}
	}
	else 
	{
		// in this case do the dicotomic search.
		var middleIdx = startIdx + Math.floor(range/2);
		var newStartIdx;
		var newEndIdx;
		if (octreesArray[middleIdx].distToCamera > octree.distToCamera)
		{
			newStartIdx = startIdx;
			newEndIdx = middleIdx;
		}
		else 
		{
			newStartIdx = middleIdx;
			newEndIdx = endIdx;
		}
		return this.getIndexToInsertBySquaredDistToEye(octreesArray, octree, newStartIdx, newEndIdx);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 * @param octree 변수
 */
Octree.prototype.putOctreeInEyeDistanceSortedArray = function(result_octreesArray, octree) 
{
	// sorting is from minDist to maxDist.***
	if (result_octreesArray.length > 0)
	{
		var startIdx = 0;
		var endIdx = result_octreesArray.length - 1;
		var insert_idx= this.getIndexToInsertBySquaredDistToEye(result_octreesArray, octree, startIdx, endIdx);

		result_octreesArray.splice(insert_idx, 0, octree);
	}
	else 
	{
		result_octreesArray.push(octree);
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.getAllSubOctreesIfHasRefLists = function(result_octreesArray) 
{
	if (this.subOctrees_array === undefined) { return; }

	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (this.subOctrees_array.length > 0) 
	{
		for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getAllSubOctreesIfHasRefLists(result_octreesArray);
		}
	}
	else 
	{
		//if(this.neoRefsList_Array.length > 0)
		if (this.triPolyhedronsCount > 0) { result_octreesArray.push(this); } // there are only 1.***
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.getAllSubOctrees = function(result_octreesArray) 
{
	if (result_octreesArray === undefined) { result_octreesArray = []; }

	if (this.subOctrees_array.length > 0) 
	{
		for (var i=0, subOctreesArrayLength = this.subOctrees_array.length; i<subOctreesArrayLength; i++) 
		{
			this.subOctrees_array[i].getAllSubOctrees(result_octreesArray);
		}
	}
	else 
	{
		result_octreesArray.push(this); // there are only 1.***
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.extractLowestOctreesIfHasTriPolyhedrons = function(lowestOctreesArray) 
{
	if (this.subOctrees_array === undefined)
	{ return; }
	
	var subOctreesCount = this.subOctrees_array.length;

	if (subOctreesCount === 0 && this.triPolyhedronsCount > 0) 
	{
		lowestOctreesArray.push(this);
	}
	else 
	{
		for (var i=0; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].extractLowestOctreesIfHasTriPolyhedrons(lowestOctreesArray);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.multiplyKeyTransformMatrix = function(idxKey, matrix) 
{
	var subOctreesCount = this.subOctrees_array.length;

	if (subOctreesCount === 0 && this.triPolyhedronsCount > 0) 
	{
		if (this.neoReferencesMotherAndIndices)
		{ this.neoReferencesMotherAndIndices.multiplyKeyTransformMatrix(idxKey, matrix); }
	}
	else 
	{
		for (var i=0; i<subOctreesCount; i++) 
		{
			this.subOctrees_array[i].multiplyKeyTransformMatrix(idxKey, matrix);
		}
	}
};

/**
 * 어떤 일을 하고 있습니까?
 * @param result_octreesArray 변수
 */
Octree.prototype.parseAsimetricVersion = function(arrayBuffer, readerWriter, bytesReaded, neoBuildingOwner) 
{
	var octreeLevel = readerWriter.readInt32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

	if (octreeLevel === 0) 
	{
		// this is the mother octree, so read the mother octree's size.***
		var minX = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var maxX = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var minY = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var maxY = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var minZ = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		var maxZ = readerWriter.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

		this.setBoxSize(minX, maxX, minY, maxY, minZ, maxZ );
		this.octree_number_name = 0;
	}

	var subOctreesCount = readerWriter.readUInt8(arrayBuffer, bytesReaded, bytesReaded+1); bytesReaded += 1; // this must be 0 or 8.***
	this.triPolyhedronsCount = readerWriter.readInt32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
	if (this.triPolyhedronsCount > 0)
	{ this.neoBuildingOwner = neoBuildingOwner; }

	// 1rst, create the 8 subOctrees.***
	for (var i=0; i<subOctreesCount; i++) 
	{
		var subOctree = this.new_subOctree();
		subOctree.octree_number_name = this.octree_number_name * 10 + (i+1);
		subOctree.neoBuildingOwnerId = this.neoBuildingOwnerId;
		subOctree.octreeKey = this.neoBuildingOwnerId + "_" + subOctree.octree_number_name;
	}

	// now, set size of subOctrees.***
	this.setSizesSubBoxes();

	for (var i=0; i<subOctreesCount; i++) 
	{
		var subOctree = this.subOctrees_array[i];
		bytesReaded = subOctree.parseAsimetricVersion(arrayBuffer, readerWriter, bytesReaded, neoBuildingOwner);
	}

	return bytesReaded;
};
