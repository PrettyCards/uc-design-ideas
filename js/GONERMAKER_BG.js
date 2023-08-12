
function addLayer(ele) {
    var layer = document.createElement("DIV");
    layer.className = "GONERMAKER_BG_LAYER";
    layer.innerHTML = `
        <div class="GONERMAKER_BG_CELL GONERMAKER_BG_CELL1"></div>
        <div class="GONERMAKER_BG_CELL GONERMAKER_BG_CELL2"></div>
        <div class="GONERMAKER_BG_CELL GONERMAKER_BG_CELL3"></div>
        <div class="GONERMAKER_BG_CELL GONERMAKER_BG_CELL4"></div>
    `;
    ele.prepend(layer);
}

var bgContainer = document.createElement("DIV");
bgContainer.className = "GONERMAKER_BG_CONTAINER";
document.body.prepend(bgContainer);

function processBG() {
    addLayer(bgContainer);
    if (bgContainer.children > 10) {
        bgContainer.lastElementChild.remove();
    }
    setTimeout(processBG, 500);
}

processBG();