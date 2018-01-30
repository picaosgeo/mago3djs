'use strict';

/**
 * ??
 * @class SceneState
 */
var SceneState = function() 
{
	if (!(this instanceof SceneState)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.gl;

	// this contains the model matrices and camera position.***
	this.modelViewProjRelToEyeMatrix = new Matrix4(); // created as identity matrix.***
	this.modelViewRelToEyeMatrix = new Matrix4(); // created as identity matrix.***
	this.modelViewRelToEyeMatrixInv = new Matrix4(); // created as identity matrix.***
	this.modelViewMatrix = new Matrix4(); // created as identity matrix.***
	this.modelViewMatrixInv = new Matrix4(); // created as identity matrix.***
	this.projectionMatrix = new Matrix4(); // created as identity matrix.***
	this.modelViewProjMatrix = new Matrix4(); // created as identity matrix.***
	this.normalMatrix4 = new Matrix4(); // created as identity matrix.***
	this.identityMatrix4 = new Matrix4(); // created as identity matrix.***

	this.encodedCamPosHigh = new Float32Array([0.0, 0.0, 0.0]);
	this.encodedCamPosLow = new Float32Array([0.0, 0.0, 0.0]);
	
	this.camera = new Camera();
	this.drawingBufferWidth = new Int32Array([1000]);
	this.drawingBufferHeight = new Int32Array([1000]);
	
	this.bMust = false;
	
	// webWorldWind vars.***
	this.dc;
	
	// insertIssue states.***
	this.insertIssueState = 0; // 0 = no started. 1 = started.***
	
	// provisionally.***
	this.textureFlipYAxis = false;
};
