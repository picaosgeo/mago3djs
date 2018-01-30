'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class FBO
 * @param gl 변수
 * @param width 변수
 * @param height 변수
 */
var FBO = function(gl, width, height) 
{
	if (!(this instanceof FBO)) 
	{
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.gl = gl;
	this.width = width;
	this.height = height;
	this.fbo = gl.createFramebuffer();
	this.depthBuffer = gl.createRenderbuffer();
	this.colorBuffer = gl.createTexture();
	this.dirty = true;
  
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.colorBuffer);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //LINEAR_MIPMAP_LINEAR
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	//gl.generateMipmap(gl.TEXTURE_2D)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); 
  
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorBuffer, 0);
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) 
	{
		throw "Incomplete frame buffer object.";
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};    

/**
 * 어떤 일을 하고 있습니까?
 */
FBO.prototype.bind = function() 
{
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
};

/**
 * 어떤 일을 하고 있습니까?
 */
FBO.prototype.unbind = function() 
{
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
};

