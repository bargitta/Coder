(function(){
var scene, camera, renderer; //these 3 elements are must for visualiztion
var geometry, material, mesh;

init();
render();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 800;

    geometry = new THREE.BoxGeometry(200, 200, 300);
    material = new THREE.MeshBasicMaterial({ color: 0xffddff, wireframe: false });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
    geometry.rotation.x += 0.1;
    geometry.rotation.y += 0.1;
}
render();
    
})();
