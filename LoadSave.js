// load map data
const onFileLoad = (xmlDocument) => {
  // reset saved map data on loading a new file
  mapData.xmlDocument = xmlDocument;

  mapData.rootElement = mapData.xmlDocument.getElementsByTagName("state")[0];
  // parse root variables
  mapData.xExtent = parseInt(mapData.rootElement.getAttribute("xExtent"));
  mapData.yExtent = parseInt(mapData.rootElement.getAttribute("yExtent"));

  // parse resource nodes
  mapData.resourceNodes = new Array(mapData.xExtent*mapData.yExtent);
  let resourceNodeElements = mapData.xmlDocument.getElementsByTagName("resourceNode");
  for(let i=0; i<resourceNodeElements.length; i++) {
    let node = resourceNodeElements[i];
    // define a prototype for a resource node
    if(!(mapData.resourceNodePrototype)) {
      mapData.resourceNodePrototype = node.cloneNode(true); // deep clone
    }

    // load element to position map
    let x = parseInt(node.getElementsByTagName("xPosition")[0].textContent)
    let y = parseInt(node.getElementsByTagName("yPosition")[0].textContent)
    let ID = parseInt(node.getElementsByTagName("ID")[0].textContent)
    if(ID > mapData.maxResourceNodeID) {
      mapData.maxResourceNodeID = ID;
    }
    mapData.resourceNodes[x+mapData.xExtent*y] = node;
  }

  rescaleCanvas();
  renderMap();
}

// File Selector - Load a SEPIA map xml file
const fileSelector = document.getElementById("file-selector");
fileSelector.addEventListener('input', (event) => {
  // get the file
  const file = event.target.files[0];

  // reader contents from file
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    let xmlContentString = event.target.result;
    const parser = new DOMParser();
    xmlDocument = parser.parseFromString(xmlContentString, "application/xml")
    onFileLoad(xmlDocument);
  })
  const text = reader.readAsText(file);
});

// File Download - Create download link for modified map file
const downloadLink = document.getElementById("download");
downloadLink.addEventListener('click', () => {
  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(mapData.xmlDocument);

  const file = new Blob([xmlStr], {type: "application/xml"});

  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = "map.xml";
})