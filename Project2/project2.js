// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
	var matrix = Array( 1, 0, 0, 0, 1, 0, 0, 0, 1 );
	matrix[6] = positionX;
	matrix[7] = positionY;
	matrix[0] = scale * Math.cos(rotation * Math.PI/180);
	matrix[1] = scale * Math.sin(rotation * Math.PI/180);
	matrix[3] = -scale * Math.sin(rotation * Math.PI/180);
	matrix[4] = scale * Math.cos(rotation * Math.PI/180);
	return matrix;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	var matrix = Array(9);
	for(var i = 0; i < 3; i++) {
		for(var j = 0; j < 3; j++) {
			matrix[i * 3 + j] = trans1[i * 3] * trans2[j] + trans1[i * 3 + 1] * trans2[3 + j] + trans1[i * 3 + 2] * trans2[6 + j];
		}
	}
	return matrix;
}
