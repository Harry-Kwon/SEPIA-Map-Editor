// randomize button
document.getElementById("randomize").addEventListener("click", event => {
  let density = document.getElementById("randomize-density").value;
  randomizeMap(mapData, density);
  renderMap();
});

// randomize the map with node density
function randomizeMap(map, density=0.5) {
  // traverse through each tile and generate a resource node with probability P=density

  console.log(map);
  for(let x=0; x<map.xExtent; x++) {
    for(let y=0; y<map.yExtent; y++) {
      // clear the tile
      map.removeResourceNode(x, y);

      // generate with probability P=density
      if(Math.random() < density) {
        map.addResourceNode(x, y);
      }
    }
  }
}