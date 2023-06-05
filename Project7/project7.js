// This function takes the translation and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// You can use the MatrixMult function defined in project5.html to multiply two 4x4 matrices in the same format.
function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var mv = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	trans = [
		1, 0, 0, 0,
		0, Math.cos(rotationX), Math.sin(rotationX), 0,
		0, -Math.sin(rotationX), Math.cos(rotationX), 0,
		0, 0, 0, 1
	];
	mv = MatrixMult( mv, trans );
	trans = [
		Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
		0, 1, 0, 0,
		Math.sin(rotationY), 0,  Math.cos(rotationY), 0,
		0, 0, 0, 1
	];
	mv = MatrixMult( mv, trans );
	return mv;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations
		this.prog   = InitShaderProgram( curvesVS, curvesFS );
		this.pos = gl.getAttribLocation( this.prog, 'pos' );
		this.txc = gl.getAttribLocation( this.prog, 'txc' );
		this.nor = gl.getAttribLocation( this.prog, 'nor' );
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		this.mv = gl.getUniformLocation( this.prog, 'mv' );
		this.mvn = gl.getUniformLocation( this.prog, 'mvn' );
		this.swap = gl.getUniformLocation( this.prog, 'swap' );
		this.show = gl.getUniformLocation( this.prog, 'show' );
		this.sampler = gl.getUniformLocation( this.prog, 'tex' );
		this.shininess = gl.getUniformLocation( this.prog, 'shininess' );
		this.light = gl.getUniformLocation( this.prog, 'light' );
		this.vertBuffer = gl.createBuffer();
		this.texBuffer = gl.createBuffer();
		this.norBuffer = gl.createBuffer();
		this.hasTex = false;
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions,
	// an array of 2D texture coordinates, and an array of vertex normals.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex and every three consecutive 
	// elements in the normals array form a vertex normal.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords, normals )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		this.numTriangles = vertPos.length / 3;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.norBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
		gl.useProgram( this.prog );
		gl.uniform1i( this.swap, swap );
	}
	
	// This method is called to draw the triangular mesh.
	// The arguments are the model-view-projection transformation matrixMVP,
	// the model-view transformation matrixMV, the same matrix returned
	// by the GetModelViewProjection function above, and the normal
	// transformation matrix, which is the inverse-transpose of matrixMV.
	draw( matrixMVP, matrixMV, matrixNormal )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, matrixMVP );
		gl.uniformMatrix4fv( this.mv, false, matrixMV );
		gl.uniformMatrix3fv( this.mvn, false, matrixNormal );
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.vertexAttribPointer( this.pos, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.pos );
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
		gl.vertexAttribPointer( this.txc, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.txc );
		gl.bindBuffer(gl.ARRAY_BUFFER, this.norBuffer);
		gl.vertexAttribPointer( this.nor, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.nor );
		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);

		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );

		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.useProgram( this.prog );
		gl.uniform1i(this.show, 1);
		this.hasTex= true;
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
		gl.useProgram( this.prog );
		gl.uniform1i(this.show, show && this.hasTex);
	}
	
	// This method is called to set the incoming light direction
	setLightDir( x, y, z )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify the light direction.
		gl.useProgram( this.prog );
		gl.uniform3f(this.light, x, y, z);
	}
	
	// This method is called to set the shininess of the material
	setShininess( shininess )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify the shininess.
		gl.useProgram( this.prog );
		gl.uniform1f(this.shininess, shininess);
	}
}

var curvesVS = `
	attribute vec3 pos;
	attribute vec3 nor;
	attribute vec2 txc;
	uniform mat4 mvp;
	uniform mat4 mv;
	uniform mat3 mvn;
	uniform int swap;
	varying vec2 texCoord;
	varying vec3 normal;
	void main()
	{
		if(bool(swap)) {
			gl_Position = mvp * vec4(pos.xzy, 1);
		}
		else {
			gl_Position = mvp * vec4(pos, 1);
		}
		texCoord = txc;
		normal = normalize( mvn * nor);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	uniform sampler2D tex;
	uniform int show;
	uniform float shininess;
	uniform vec3 light;
	varying vec2 texCoord;
	varying vec3 normal;
	void main()
	{
		vec3 kd;
		if(bool(show)) {
			kd = vec3(texture2D(tex, texCoord));
		}
		else {
			kd = vec3(1,1,1);
		}
		float cosa = max(dot(light - normal * 2.0 * dot(light, normal), vec3(0, 0, 1)), 0.0);
		gl_FragColor =  vec4(kd * max(dot(normal, light), 0.0) + vec3(1,1,1) * pow(cosa, shininess), 1);
	}
`;


// This function is called for every step of the simulation.
// Its job is to advance the simulation for the given time step duration dt.
// It updates the given positions and velocities.
function SimTimeStep( dt, positions, velocities, springs, stiffness, damping, particleMass, gravity, restitution )
{
	var forces = Array( positions.length ); // The total for per particle
    //console.log('before')
    console.log(dt, positions, velocities, springs, stiffness, damping, particleMass, gravity, restitution)
	// [TO-DO] Compute the total force of each particle
	for(var i = 0; i < positions.length; i++) {
        forces[i] = gravity;
    }
    
    for(var n = 0; n < springs.length; n++) {
        var i = springs[n].p0;
        var j = springs[n].p1;
        var lr = springs[n].rest;
        var d = positions[j].sub(positions[i]);
        var l = d.len();
        d.normalize();
        var ii = velocities[j].sub(velocities[i]).dot(d);
        var fs = d.mul(stiffness * (l - lr));
        var fd = d.mul(damping * ii);
        forces[i] = forces[i].add(fs).add(fd);
        forces[j] = forces[j].sub(fs).sub(fd);
    }
	// [TO-DO] Update positions and velocities
    for(var i = 0; i < positions.length; i++) {
        velocities[i] = velocities[i].add(forces[i].div(particleMass).mul(dt));
    }
    for(var i = 0; i < positions.length; i++) {
        positions[i] = positions[i].add(velocities[i].mul(dt));
    }
	
	// [TO-DO] Handle collisions
    for(var i = 0; i < positions.length; i++) {
        if(positions[i].x < -1.0) {
            positions[i].x = -1.0 + restitution * (-1.0 - positions[i].x);
            velocities[i].x = -velocities[i].x * restitution;
        }
        else if(positions[i].x > 1.0) {
            positions[i].x = 1.0 - restitution * (positions[i].x - 1.0);
            velocities[i].x = -velocities[i].x * restitution;
        }
        if(positions[i].y < -1.0) {
            positions[i].y = -1.0 + restitution * (-1.0 - positions[i].y);
            velocities[i].y = -velocities[i].y * restitution;
        }
        else if(positions[i].y > 1.0) {
            positions[i].y = 1.0 - restitution * (positions[i].y - 1.0);
            velocities[i].y = -velocities[i].y * restitution;
        }
        if(positions[i].z < -1.0) {
            positions[i].z = -1.0 + restitution * (-1.0 - positions[i].z);
            velocities[i].z = -velocities[i].z * restitution;
        }
        else if(positions[i].z > 1.0) {
            positions[i].z = 1.0 - restitution * (positions[i].z - 1.0);
            velocities[i].z = -velocities[i].z * restitution;
        }
    }
	
}

