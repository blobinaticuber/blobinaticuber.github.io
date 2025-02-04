
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n\
  attribute vec4 a_Color;\n\
  varying vec4 v_Color;\n\
  void main() {\n\
    gl_Position = a_Position;\n\
    gl_PointSize = 6.0;\n\
    v_Color = a_Color;\n\
  }\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n\
  varying vec4 v_Color;\n\
  void main() {\n\
    gl_FragColor = v_Color;\n\
  }\n';



function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 100;

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var n = initVertexBuffers(gl);

    // Clear the canvas
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    //   }
}









function initVertexBuffers(gl) {
    var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    var n = 3;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // var FSIZE = vertices.BYTES_PER_ELEMENT;

    // does the position stuff with the buffer
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // // does the colour stuff with the buffer
    // var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    // gl.enableVertexAttribArray(a_Color);  // Enable the assignment of the buffer object

    return n;
}
