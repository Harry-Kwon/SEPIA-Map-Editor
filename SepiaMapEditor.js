var mapData = {
  xmlDocument : undefined,
  rootElement : undefined, 
  xExtent : 0,
  yExtent : 0,
  resourceNodes : undefined,
  resourceNodePrototype : undefined,
  maxResourceNodeID : 0,
  removeResourceNode : function(x, y) {
    console.log(`remove node ${x}, ${y}`);
    let node = this.resourceNodes[x+y*this.xExtent];
    if(node) {
      // remove the node from the XML document
      node.parentNode.removeChild(node);
      // clear the position
      this.resourceNodes[x+y*this.xExtent] = undefined;
    }
  },
  addResourceNode : function(x, y) {
    console.log(`add node ${x}, ${y}`);
    if(this.resourceNodePrototype) {
      // clone a node
      let addedNode = this.resourceNodePrototype.cloneNode(true); // deep copy
      // update position
      addedNode.getElementsByTagName("xPosition")[0].textContent = ""+x;
      addedNode.getElementsByTagName("yPosition")[0].textContent = ""+y;
      // update ID
      this.maxResourceNodeID += 8;
      addedNode.getElementsByTagName("ID")[0].textContent = ""+this.maxResourceNodeID;
      // add the node to the position table
      this.resourceNodes[x+y*this.xExtent] = addedNode;
      // attach the created node to the DOM
      this.rootElement.appendChild(addedNode);
    }
  },
}

// canvas setup
const canvas = document.getElementById("map-canvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const rescaleCanvas = () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
rescaleCanvas();
// handle click events
canvas.addEventListener("click", (event) => {
  // get coordinates of click
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const tileWidth = Math.min(Math.floor(canvas.width/mapData.xExtent), Math.floor(canvas.height/mapData.yExtent));
  const tileX = Math.floor(x/tileWidth);
  const tileY = Math.floor(y/tileWidth);

  if([tileX+1, tileY+1, mapData.xExtent-tileX, mapData.yExtent-tileY].every((i) => (i>0))) {
    if(mapData.resourceNodes[tileX+tileY*mapData.xExtent]) {
      mapData.removeResourceNode(tileX, tileY);
    } else {
      mapData.addResourceNode(tileX, tileY);
    }
    renderMap();
  }
});

// re-render the map on resize
canvas.addEventListener("resize", (event) => renderMap());
// render the map from updated mapData
const renderMap = () => {
  const context = canvas.getContext("2d");
  console.log("render map");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const tileWidth = Math.min(Math.floor(canvas.width/mapData.xExtent), Math.floor(canvas.height/mapData.yExtent));
  for(let x=0; x<mapData.xExtent; x++) {
    for(let y=0; y<mapData.yExtent; y++) {
      if(mapData.resourceNodes[x+mapData.xExtent*y]){
        context.fillRect(x*tileWidth, y*tileWidth, tileWidth, tileWidth);
      }
      context.strokeRect(x*tileWidth, y*tileWidth, tileWidth, tileWidth);
    }
  }
}

window.addEventListener("resize", () => {
  rescaleCanvas();
  renderMap();
})