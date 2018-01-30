'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class GlobeTile
 */
var GlobeTile = function() 
{
	if (!(this instanceof GlobeTile)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	this.globeTileOwner;
	this.depth;
	this.numberName;
	this.minGeographicCoord;
	this.maxGeographicCoord;
	this.subTilesArray;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns subTile
 */
GlobeTile.prototype.newSubTile = function() 
{
	var subTilesCount = this.subTilesArray.length;
	var subTile = new GlobeTile();
	subTile.depth = this.depth + 1;
	subTile.numberName = this.numberName*10 + subTilesCount + 1;
	this.subTilesArray.push(subTile);
	return subTile;
};

