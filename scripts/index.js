var fields = [];
var primaryKeys = [];
addTransactionOutput = {}
deleteTransactionOutput = {}
getTransactionOutput = {}
updateTransactionOutput = {}
var enableAddDownload = false;
var enableDeleteDownload = false;
var enableGetDownload = false;
var enableUpdateDownload = false;
window.onload = function () {
    console.log("Hello World!");
}

function openCustomTable() {
    var element = document.createElement("a")
    element.setAttribute("href", "custom-table.html")
    // element.setAttribute("target", "_blank")
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function openM3Table() {
    var element = document.createElement("a")
    element.setAttribute("href", "m3-table.html")
    // element.setAttribute("target", "_blank")
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}