// [TO-DO] Complete the implementation of the following class and the vertex shader below.

class CurveDrawer {
	constructor()
	{
		this.prog   = InitShaderProgram( curvesVS, curvesFS );

		// Get the ids of the uniform variables in the shaders
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		
		// Get the ids of the vertex attributes in the shaders
		this.p = [];
		for ( var i=0; i<4; ++i ) {
			this.p[i] = gl.getUniformLocation( this.prog, 'p' + i );
		}
		this.p[0] = gl.getUniformLocation( this.prog, 'p0' );
		this.p[1] = gl.getUniformLocation( this.prog, 'p1' );
		this.p[2] = gl.getUniformLocation( this.prog, 'p2' );
		this.p[3] = gl.getUniformLocation( this.prog, 'p3' );
		// Initialize the attribute buffer
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}
		this.t = gl.getAttribLocation( this.prog, 't' );
		// Create and set the contents of the vertex buffer object
		// for the vertex attribute we need.
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
	}
	setViewport( width, height )
	{
		// Compute the orthographic projection matrix and send it to the shader
		var trans = [ 2/width,0,0,0,  0,-2/height,0,0, 0,0,1,0, -1,1,0,1 ];
		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, trans );
	}
	updatePoints( pt )
	{
		// The control points have changed
		gl.useProgram( this.prog );
		for ( var i=0; i<4; ++i ) {
			var x = pt[i].getAttribute("cx");
			var y = pt[i].getAttribute("cy");
			gl.uniform2f( this.p[i], x, y );
		}
	}
	draw()
	{
		// Draw the line segments
		gl.useProgram( this.prog );
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.vertexAttribPointer( this.t, 1, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.t );
		gl.drawArrays( gl.LINE_STRIP, 0, this.steps );
	}
}

// Vertex Shader
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{
		float tt = 1.0 - t;
		float x = p0.x * tt * tt * tt + 3.0 * p1.x * tt * tt * t + 3.0 * p2.x * tt * t * t + p3.x * t * t * t;
		float y = p0.y * tt * tt * tt + 3.0 * p1.y * tt * tt * t + 3.0 * p2.y * tt * t * t + p3.y * t * t * t;
		gl_Position = mvp * vec4(x,y,0,1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;