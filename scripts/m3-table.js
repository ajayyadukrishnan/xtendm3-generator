var fields = [];
var nonPrimaryKeyFields = [];
var primaryKeys = [];
addTransactionOutput = {}
deleteTransactionOutput = {}
getTransactionOutput = {}
updateTransactionOutput = {}
var enableAddDownload = false;
var enableDeleteDownload = false;
var enableGetDownload = false;
var enableUpdateDownload = false;
var oldTableIndex = "";
var oldFieldName = "";

var tableMetadata = {}
var tablePrefix = "";
window.onload = function () {
    console.log("Hello World!");

    $("#miProgram").on("input", function () {
        var value = $(this).val();
        if (value.match("^EXT[0-9]{3}MI$")) {
            $("#miProgram").removeClass("is-invalid");
            $("#miProgram").addClass("is-valid");
        } else {
            $("#miProgram").removeClass("is-valid");
            $("#miProgram").addClass("is-invalid");
        }
    });

    $("#transaction").on("input", function () {
        var value = $(this).val().trim();
        console.log(value)
        if (value.match("^[a-zA-Z][a-zA-Z0-9]{0,14}$")) {
            $("#transaction").removeClass("is-invalid");
            $("#transaction").addClass("is-valid");
        } else {
            $("#transaction").removeClass("is-valid");
            $("#transaction").addClass("is-invalid");
        }
    });

    $("#m3Table").on("input", function () {
        var value = $(this).val().trim();
        // console.log(value)
        $("#m3Table").removeClass("is-valid");
        $("#m3Table").addClass("is-invalid");
    });

    $("#userName").on("input", function () {
        var value = $(this).val();
        // console.log(value)
        if (value.match("^[a-zA-Z][a-zA-Z0-9]{0,9}$")) {
            $("#userName").removeClass("is-invalid");
            $("#userName").addClass("is-valid");
        } else {
            $("#userName").removeClass("is-valid");
            $("#userName").addClass("is-invalid");
        }
    });

    $("#fieldName").on("input", function () {
        var value = $(this).val();
        // console.log(value)
        $("#fieldName").removeClass("is-valid");
        $("#fieldName").addClass("is-invalid");
        $("#fieldModalSubmit").addClass("disabled");
        $("#fieldModalSubmit").prop("disabled", true);
    });

    $("#editfieldName").on("input", function () {
        var value = $(this).val();
        // console.log(value)
        $("#editfieldName").removeClass("is-valid");
        $("#editfieldName").addClass("is-invalid");
        $("#editfieldModalSubmit").addClass("disabled");
        $("#editfieldModalSubmit").prop("disabled", true);
    });

    $("#validateTable").on("click", function () {
        var value = $("#m3Table").val();
        console.log(value)
        if (value.trim() == "") {
            $("#m3Table").removeClass("is-valid");
            $("#m3Table").addClass("is-invalid");
            tablePrefix = "";
            return;
        }
        $.LoadingOverlay("show", {
            image: "",
            fontawesome: "fa fa-cog fa-spin"
        });
        $('#fieldsTableBody').empty();
        var getTableMetadataData = {
            "url": "https://xtendm3-api.herokuapp.com/tables/getTableMetadata?table=" + value,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "data": JSON.stringify({}),
        };

        $("#fieldModalSubmit").prop("disabled", true);
        nonPrimaryKeyFields = [];

        $.ajax(getTableMetadataData).done(function (response) {
            console.log(response);
            if (response["columns"].length > 0) {
                $("#fieldModalSubmit").prop("disabled", false);
                $("#fieldModalSubmit").removeClass("disabled");
                $("#m3Table").removeClass("is-invalid");
                $("#m3Table").addClass("is-valid");
                tablePrefix = response["table_prefix"];
                tableMetadata = response;
                $("#addButton").prop("disabled", false);
                $("#deleteButton").prop("disabled", false);

                // console.log(tableMetadata);
                // console.log(tablePrefix);
                var indices = {}
                indices = tableMetadata["indices"];
                indices = Object.keys(indices).sort().reduce(
                    (obj, key) => {
                        obj[key] = indices[key];
                        return obj;
                    },
                    {}
                );
                $("#tableIndex").empty();
                // $("#tableIndex").append("<option value=''>Select an index</option>");
                for (const key of Object.keys(indices).sort()) {
                    const indexDetails = indices[key].map(({ column }) => column.substring(2));
                    console.log(indexDetails.join([separator = ', ']));
                    $("#tableIndex").append("<option value='" + key + "'>" + key + " - " + indexDetails.join([separator = ', ']) + "</option>");
                }
                $("#tableIndex").prop("disabled", false);
                oldTableIndex = $("#tableIndex").val();
                updateIndexFields();
                // for (const index in indices) {
                //     console.log(index)
                // }
            } else {
                $("#fieldModalSubmit").prop("disabled", true);
                $("#m3Table").removeClass("is-valid");
                $("#m3Table").addClass("is-invalid");
                tablePrefix = "";
                tableMetadata = {};
            }
            $.LoadingOverlay("hide");
        });
    });


    $("#validateField").on("click", function () {
        var value = $("#fieldName").val();
        console.log(value)
        console.log(fields)
        if (value.trim() == "" || fields.indexOf(tablePrefix + value.trim().toUpperCase()) > -1
            || ["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(value.trim().toUpperCase()) > -1) {
            $("#fieldName").removeClass("is-valid");
            $("#fieldName").addClass("is-invalid");
            return;
        }

        var newArray = tableMetadata["columns"].filter(function (el) {
            return el.name == tablePrefix + value;
        });
        console.log(newArray);

        if (newArray.length < 1) {
            $("#fieldName").removeClass("is-valid");
            $("#fieldName").addClass("is-invalid");
            $("#fieldLength").val("");
            $("#fieldType").val("Decimal");
            $(".fieldDecimalGroup").css({ "display": "block" });
            $("#fieldDecimal").val("");
            $("#fieldDescription").val("");
            $("#fieldModalSubmit").prop("disabled", true);
            $("#fieldModalSubmit").addClass("disabled");
            return;
        }

        for (var i = 0; i < newArray.length; i++) {
            var column = newArray[i];
            if (column["name"].trim() === tablePrefix + value.toUpperCase()) {
                $("#fieldName").removeClass("is-invalid");
                $("#fieldName").addClass("is-valid");

                $("#fieldType").val(column["type"] == "CHAR" ? "String" : "Decimal");

                var fieldType = $("#fieldType").val();
                if (fieldType.match("^Decimal$")) {
                    $(".fieldDecimalGroup").css({ "display": "block" });
                    $("#fieldDecimal").val(column["decimals"]);
                } else {
                    $(".fieldDecimalGroup").css({ "display": "none" });
                    $("#fieldDecimal").removeClass("is-invalid");
                    $("#fieldDecimal").removeClass("is-valid");
                    $("#fieldDecimal").val("0");
                }
                $("#fieldLength").val(column["length"]);
                $("#fieldDescription").val(column["description"]);

                $("#fieldModalSubmit").prop("disabled", false);
                $("#fieldModalSubmit").removeClass("disabled");

                return;
            } else {
                console.log(column["name"] + " " + tablePrefix + value.toUpperCase());
                if (i == newArray.length - 1) {
                    $("#fieldName").removeClass("is-valid");
                    $("#fieldName").addClass("is-invalid");
                    $("#tableIndex").empty();
                    $("#tableIndex").prop("disabled", true);
                    $("#fieldModalSubmit").prop("disabled", true);
                    $("#fieldModalSubmit").addClass("disabled");
                }
            }
        }
    });


    $("#validateEditField").on("click", function () {
        var value = $("#editfieldName").val();
        console.log(value)
        console.log(fields)
        if (value.trim() == "" || fields.indexOf(tablePrefix + value.trim().toUpperCase()) > -1
            || ["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(value.trim().toUpperCase()) > -1) {
            $("#editfieldName").removeClass("is-valid");
            $("#editfieldName").addClass("is-invalid");
            return;
        }

        var newArray = tableMetadata["columns"].filter(function (el) {
            return el.name == tablePrefix + value;
        });
        console.log(newArray);

        if (newArray.length < 1) {
            $("#editfieldName").removeClass("is-valid");
            $("#editfieldName").addClass("is-invalid");
            $("#editfieldLength").val("");
            $("#editfieldType").val("Decimal");
            $(".editfieldDecimalGroup").css({ "display": "block" });
            $("#editfieldDecimal").val("");
            $("#editfieldDescription").val("");
            $("#editfieldModalSubmit").prop("disabled", true);
            $("#editfieldModalSubmit").addClass("disabled");
            return;
        }

        for (var i = 0; i < newArray.length; i++) {
            var column = newArray[i];
            if (column["name"].trim() === tablePrefix + value.toUpperCase()) {
                $("#editfieldName").removeClass("is-invalid");
                $("#editfieldName").addClass("is-valid");

                $("#editfieldType").val(column["type"] == "CHAR" ? "String" : "Decimal");

                var fieldType = $("#editfieldType").val();
                if (fieldType.match("^Decimal$")) {
                    $(".editfieldDecimalGroup").css({ "display": "block" });
                    $("#editfieldDecimal").val(column["decimals"]);
                } else {
                    $(".editfieldDecimalGroup").css({ "display": "none" });
                    $("#editfieldDecimal").removeClass("is-invalid");
                    $("#editfieldDecimal").removeClass("is-valid");
                    $("#editfieldDecimal").val("0");
                }
                $("#editfieldLength").val(column["length"]);
                $("#editfieldDescription").val(column["description"]);

                $("#editfieldModalSubmit").prop("disabled", false);
                $("#editfieldModalSubmit").removeClass("disabled");

                return;
            } else {
                console.log(column["name"] + " " + tablePrefix + value.toUpperCase());
                if (i == newArray.length - 1) {
                    $("#editfieldName").removeClass("is-valid");
                    $("#editfieldName").addClass("is-invalid");
                    $("#edittableIndex").empty();
                    $("#edittableIndex").prop("disabled", true);
                    $("#editfieldModalSubmit").prop("disabled", true);
                    $("#editfieldModalSubmit").addClass("disabled");
                }
            }
        }
    });

    $("#fieldType").on("change", function () {
        var value = $(this).val();
        if (value.match("^Decimal$")) {
            $(".fieldDecimalGroup").css({ "display": "block" });
        } else {
            $(".fieldDecimalGroup").css({ "display": "none" });
            $("#fieldDecimal").removeClass("is-invalid");
            $("#fieldDecimal").removeClass("is-valid");
        }
    });

    $("#tableIndex").on("change", function () {
        updateIndexFields();
    });

    $("#fieldModal").on('show.bs.modal', function () {
        document.getElementById("fieldForm").reset();
        var modal = document.getElementById("fieldModal");
        // console.log(modal.getElementsByClassName("is-invalid"))
        validClasses = modal.getElementsByClassName("is-valid");
        for (var i = 0; i < validClasses.length; i++) {
            validClasses.item(i).classList.remove("is-valid");
        };
        invalidClasses = modal.getElementsByClassName("is-invalid");
        for (var i = 0; i < invalidClasses.length; i++) {
            invalidClasses.item(i).classList.remove("is-invalid");
        };
        $("#fieldName").removeClass("is-invalid");
        $("#fieldName").removeClass("is-valid");
        $("#fieldType").removeClass("is-invalid");
        $("#fieldType").removeClass("is-valid");
        $("#fieldLength").removeClass("is-invalid");
        $("#fieldLength").removeClass("is-valid");
        $("#fieldDecimal").removeClass("is-invalid");
        $("#fieldDecimal").removeClass("is-valid");
        $("#fieldDescription").removeClass("is-invalid");
        $("#fieldDescription").removeClass("is-valid");
        $(".fieldDecimalGroup").css({ "display": "block" });
        $("#fieldModalSubmit").prop("disabled", true);
        $("#fieldModalSubmit").addClass("disabled");
    });

    $("#editModal").on('show.bs.modal', function () {
        document.getElementById("editfieldForm").reset();
        var modal = document.getElementById("editModal");
        // console.log(modal.getElementsByClassName("is-invalid"))
        validClasses = modal.getElementsByClassName("is-valid");
        for (var i = 0; i < validClasses.length; i++) {
            validClasses.item(i).classList.remove("is-valid");
        };
        invalidClasses = modal.getElementsByClassName("is-invalid");
        for (var i = 0; i < invalidClasses.length; i++) {
            invalidClasses.item(i).classList.remove("is-invalid");
        };

        var selectRowCheckbox = document.getElementsByClassName("selectRowCheckbox");
        var selectedRows = [];
        for (var i = 0; i < selectRowCheckbox.length; i++) {
            if (selectRowCheckbox.item(i).checked) {
                selectedRows.push(selectRowCheckbox.item(i).parentNode.parentNode);
            }
        }
        console.log(selectedRows);
        var cols = selectedRows[0].childNodes;
        console.log(cols)

        var fieldName = cols[1].innerHTML;
        var fieldType = cols[2].innerHTML;
        var fieldLength = cols[3].innerHTML;
        var fieldDecimal = cols[4].innerHTML;
        var fieldDescription = cols[5].innerHTML;
        var isPrimaryKey = cols[6].innerHTML == "true" ? true : false;

        console.log(fieldName, fieldType, fieldLength, fieldDecimal, fieldDescription, isPrimaryKey);

        $("#editfieldName").val(fieldName);
        $("#editfieldType").val(fieldType);
        $("#editfieldLength").val(fieldLength);
        $("#editfieldDecimal").val(fieldDecimal);
        $("#editfieldDescription").val(fieldDescription);
        $("#editfieldprimaryKey").prop("checked", isPrimaryKey);

        $("#editfieldName").removeClass("is-invalid");
        $("#editfieldName").addClass("is-valid");
        // $("#editfieldType").removeClass("is-invalid");
        // $("#editfieldType").addClass("is-valid");
        var dataType = $("#editfieldType").val();
        if (dataType.match("^Decimal$")) {
            $(".editfieldDecimalGroup").css({ "display": "block" });
        } else {
            $(".editfieldDecimalGroup").css({ "display": "none" });
            $("#editfieldDecimal").removeClass("is-invalid");
            $("#editfieldDecimal").removeClass("is-valid");
        }
        $("#editfieldLength").removeClass("is-invalid");
        $("#editfieldLength").addClass("is-valid");
        $("#editfieldDecimal").removeClass("is-invalid");
        $("#editfieldDecimal").addClass("is-valid");
        $("#editfieldDescription").removeClass("is-invalid");
        $("#editfieldDescription").addClass("is-valid");

        oldFieldName = document.getElementById("editfieldName").value.toUpperCase();

    });

};

function editField() {
    $("#editModal").modal('toggle')
}

//run every 1 second
setInterval(function () {
    //Run every 1 second

    var modal = document.getElementById("fieldModal");

    if (!$("#m3Table").hasClass("is-valid")) {
        // $('#addButton').attr('title', 'Table is not valid');
        // $('#addButton').attr('data-bs-toggle', 'tooltip');
        $("#addButton").prop("disabled", true);
        $("#tableIndex").empty();
        $("#tableIndex").prop("disabled", true);
        // $('[data-toggle="tooltip"]').tooltip();
    } else {
        $("#addButton").prop("disabled", false);
    }

    if ($('#fieldModal').hasClass('show')) {
        // console.log(modal.getElementsByClassName("is-valid").length)
        var dataType = $("#fieldType").val();
        if (dataType.match("^Decimal$")) {
            // if (modal.getElementsByClassName("is-valid").length == 4) {
            //     $("#fieldModalSubmit").removeClass("disabled");
            // } else {
            //     $("#fieldModalSubmit").addClass("disabled");
            // }
        } else {
            // if (modal.getElementsByClassName("is-valid").length == 3) {
            //     $("#fieldModalSubmit").removeClass("disabled");
            // } else {
            //     $("#fieldModalSubmit").addClass("disabled");
            // }
        }
    }

    if ($("#miProgram").hasClass("is-valid") && $("#transaction").hasClass("is-valid")
        && $("#m3Table").hasClass("is-valid") && $("#userName").hasClass("is-valid")
        && nonPrimaryKeyFields.length > 0) {
        $("#generate").prop("disabled", false);
        $("#generate").removeClass("disabled");
    } else {
        $("#generate").prop("disabled", true);
        $("#generate").addClass("disabled");
    }



    var selectRowCheckbox = document.getElementsByClassName("selectRowCheckbox");
    var selectedRows = [];
    for (var i = 0; i < selectRowCheckbox.length; i++) {
        if (selectRowCheckbox.item(i).checked) {
            selectedRows.push(selectRowCheckbox.item(i).value);
        }
    }
    if (selectedRows.length > 0) {
        $("#deleteButton").removeClass("disabled");
        $("#deleteButton").prop("disabled", false);
    } else {
        $("#deleteButton").addClass("disabled");
        $("#deleteButton").prop("disabled", true);
    }

    if (selectedRows.length == 1) {
        $("#editButton").removeClass("disabled");
        $("#editButton").prop("disabled", false);
    } else {
        $("#editButton").addClass("disabled");
        $("#editButton").prop("disabled", true);
    }


}, 100);

function updateIndexFields() {
    console.log(tableMetadata);
    var value = $("#tableIndex").val();
    console.log(value);

    // $('#fieldsTableBody tr:lt(' + tableMetadata["indices"][oldTableIndex].length + ')').remove();
    $("#fieldsTableBody").empty();
    fields = []

    oldTableIndex = value;
    for (var i = tableMetadata["indices"][value].length - 1; i >= 0; i--) {
        var index = tableMetadata["indices"][value][i];
        console.log(index);
        var columnDetails = tableMetadata["columns"].filter(function (el) {
            return el.name == index.column;
        });
        console.log(columnDetails);
        if (fields.indexOf(tablePrefix + columnDetails[0].name.trim().toUpperCase()) != -1) {
            continue;
        }
        var row = document.createElement("tr");
        row.className = "clickable-row";
        var checkboxCell = document.createElement("td");
        var fieldNameCell = document.createElement("td");
        var fieldTypeCell = document.createElement("td");
        var fieldLengthCell = document.createElement("td");
        var fieldDecimalCell = document.createElement("td");
        var fieldDescriptionCell = document.createElement("td");
        var fieldprimaryKeyCell = document.createElement("td");

        fieldNameCell.innerHTML = columnDetails[0].name.substring(2);
        fieldTypeCell.innerHTML = columnDetails[0].type == "CHAR" ? "String" : "Decimal";
        fieldLengthCell.innerHTML = columnDetails[0].length;
        fieldDecimalCell.innerHTML = columnDetails[0].decimals;
        fieldDescriptionCell.innerHTML = columnDetails[0].description;
        fieldprimaryKeyCell.innerHTML = true;

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input mt-0 selectRowCheckbox";
        checkbox.value = "";
        checkbox.id = "checkbox";
        checkbox.disabled = true;
        checkboxCell.appendChild(checkbox);

        // <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input"></input>

        row.appendChild(checkboxCell);
        row.appendChild(fieldNameCell);
        row.appendChild(fieldTypeCell);
        row.appendChild(fieldLengthCell);
        row.appendChild(fieldDecimalCell);
        row.appendChild(fieldDescriptionCell);
        row.appendChild(fieldprimaryKeyCell);

        document.getElementById("fieldsTableBody").prepend(row);
        fields.push(columnDetails[0].name.trim().toUpperCase());
    }
}

function addField() {
    if ($("#fieldModalSubmit").hasClass("disabled")) {
        return;
    }
    if (fields.indexOf(tablePrefix + document.getElementById("fieldName").value.toUpperCase()) != -1) {
        return;
    }
    console.log("Clicked")
    var row = document.createElement("tr");
    row.className = "clickable-row";
    var fieldName = document.getElementById("fieldName").value.toUpperCase();
    var fieldType = document.getElementById("fieldType").value;
    var fieldLength = document.getElementById("fieldLength").value;
    console.log(document.getElementById("fieldDecimal").value);
    var fieldDecimal = document.getElementById("fieldDecimal").value == "" ? 0 : document.getElementById("fieldDecimal").value;
    console.log(fieldDecimal);
    var fieldDescription = document.getElementById("fieldDescription").value;
    // var fieldprimaryKey = document.getElementById("fieldprimaryKey").checked;
    var fieldprimaryKey = false;

    if (!fieldType.match("^Decimal$")) {
        fieldDecimal = "0";
    }

    var checkboxCell = document.createElement("td");
    var fieldNameCell = document.createElement("td");
    var fieldTypeCell = document.createElement("td");
    var fieldLengthCell = document.createElement("td");
    var fieldDecimalCell = document.createElement("td");
    var fieldDescriptionCell = document.createElement("td");
    var fieldprimaryKeyCell = document.createElement("td");

    fieldNameCell.innerHTML = fieldName;
    fieldTypeCell.innerHTML = fieldType;
    fieldLengthCell.innerHTML = fieldLength;
    fieldDecimalCell.innerHTML = fieldDecimal;
    fieldDescriptionCell.innerHTML = fieldDescription;
    fieldprimaryKeyCell.innerHTML = fieldprimaryKey;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input mt-0 selectRowCheckbox";
    checkbox.value = "";
    checkbox.id = "checkbox";
    checkboxCell.appendChild(checkbox);

    // <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input"></input>

    row.appendChild(checkboxCell);
    row.appendChild(fieldNameCell);
    row.appendChild(fieldTypeCell);
    row.appendChild(fieldLengthCell);
    row.appendChild(fieldDecimalCell);
    row.appendChild(fieldDescriptionCell);
    row.appendChild(fieldprimaryKeyCell);

    document.getElementById("fieldsTableBody").appendChild(row);
    // document.getElementById("#fieldsTableBody").innerHTML = "";
    $("#fieldModal").modal('toggle');
    fields.push(tablePrefix + fieldName.trim().toUpperCase());
    nonPrimaryKeyFields.push(tablePrefix + fieldName.trim().toUpperCase());
}


function saveChanges() {
    $("#editModal").modal('toggle');

    // oldFieldName = document.getElementById("editfieldName").value.toUpperCase();
    console.log(oldFieldName);

    var selectRowCheckbox = document.getElementsByClassName("selectRowCheckbox");
    var selectedRows = [];
    for (var i = 0; i < selectRowCheckbox.length; i++) {
        if (selectRowCheckbox.item(i).checked) {
            selectedRows.push(selectRowCheckbox.item(i));
        }
    }
    console.log(selectedRows)

    var fieldName = document.getElementById("editfieldName").value.toUpperCase();
    var fieldType = document.getElementById("editfieldType").value;
    var fieldLength = document.getElementById("editfieldLength").value;
    var fieldDecimal = document.getElementById("editfieldDecimal").value;
    var fieldDescription = document.getElementById("editfieldDescription").value;
    // var fieldprimaryKey = document.getElementById("editfieldprimaryKey").checked;

    if (!fieldType.match("^Decimal$")) {
        fieldDecimal = "0";
    }

    var row = selectedRows[0].parentNode.parentNode;
    row.childNodes[1].innerHTML = fieldName;
    row.childNodes[2].innerHTML = fieldType;
    row.childNodes[3].innerHTML = fieldLength;
    row.childNodes[4].innerHTML = fieldDecimal;
    row.childNodes[5].innerHTML = fieldDescription;
    row.childNodes[6].innerHTML = false;

    console.log(fields.indexOf(tablePrefix + oldFieldName));

    if (fields.indexOf(tablePrefix + oldFieldName) != -1) {
        fields.splice(fields.indexOf(tablePrefix + oldFieldName), 1);
        fields.push(tablePrefix + fieldName.trim().toUpperCase());
        console.log("Removed field " + tablePrefix + oldFieldName);
    } else {
        fields.push(fieldName);
        console.log("Added field " + tablePrefix + fieldName);
    }

    if (nonPrimaryKeyFields.indexOf(tablePrefix + oldFieldName) != -1) {
        nonPrimaryKeyFields.splice(nonPrimaryKeyFields.indexOf(tablePrefix + oldFieldName), 1);
        nonPrimaryKeyFields.push(tablePrefix + fieldName.trim().toUpperCase());
    } else {
        nonPrimaryKeyFields.push(fieldName);
    }
}

function deleteField() {
    var selectRowCheckbox = document.getElementsByClassName("selectRowCheckbox");
    var selectedRows = [];
    for (var i = 0; i < selectRowCheckbox.length; i++) {
        if (selectRowCheckbox.item(i).checked) {
            selectedRows.push(selectRowCheckbox.item(i));
        }
    }
    console.log(selectedRows)
    if (selectedRows.length == 0) {
        return;
    }
    for (var i = 0; i < selectedRows.length; i++) {
        var row = selectedRows[i]
        console.log(row.parentNode.parentNode)
        row.parentNode.parentNode.remove();
        console.log(fields);

        var index = fields.indexOf(tablePrefix + row.parentNode.parentNode.childNodes[1].innerHTML);
        console.log(index);
        if (index !== -1) {
            fields.splice(index, 1);
        }
        // var primaryKeyIndex = primaryKeys.indexOf(row.parentNode.parentNode.childNodes[1].innerHTML);
        // if (primaryKeyIndex !== -1) {
        //     primaryKeys.splice(primaryKeyIndex, 1);
        // }
    }
    $("#deleteFieldModal").modal('toggle')

}

function deleteButtonModal() {
    $("#deleteFieldModal").modal('toggle')
    var selectRowCheckbox = document.getElementsByClassName("selectRowCheckbox");
    var selectedRows = [];
    for (var i = 0; i < selectRowCheckbox.length; i++) {
        if (selectRowCheckbox.item(i).checked) {
            selectedRows.push(selectRowCheckbox.item(i).parentNode.parentNode.childNodes[1].innerHTML);
        }
    }
    document.getElementById("deleteFields").innerHTML = selectedRows.join(", ");
    // $("#deleteFields").html(selectedRows.join(","));
}


function generateJSONs() {


    var updateJSON = {
        "MIProgram": $("#miProgram").val(),
        "Transaction": $("#transaction").val(),
        "Description": "Update data in " + $("#m3Table").val(),
        "UserName": $("#userName").val(),
        "Table": $("#m3Table").val(),
        "TableIndex": $("#tableIndex").val(),
        "TablePrefix": tablePrefix,
    };

    console.log($("#fieldsTableBody tr"))
    var rows = $("#fieldsTableBody tr");
    fieldsArray = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var fieldName = row.childNodes[1].innerHTML;
        var fieldType = row.childNodes[2].innerHTML;
        var fieldLength = row.childNodes[3].innerHTML;
        var fieldDecimal = row.childNodes[4].innerHTML;
        var fieldDescription = row.childNodes[5].innerHTML;
        var fieldprimaryKey = row.childNodes[6].innerHTML;
        fieldJSON = {
            "fieldName": fieldName,
            "dataType": fieldType.toLowerCase(),
            "length": parseInt(fieldLength),
            "description": fieldDescription,
            "isPrimaryKey": fieldprimaryKey == "true" ? true : false
        }
        if (fieldType == "Decimal") {
            fieldJSON["decimal"] = parseInt(fieldDecimal);
        }
        fieldsArray.push(fieldJSON)
    }
    updateJSON.fields = fieldsArray;

    // getJSON["Transaction"] = getTransaction
    // getJSON["Description"] = "Get data from " + $("#xtendTable").val()
    // addJSON["Transaction"] = addTransaction
    // addJSON["Description"] = "Add data to " + $("#xtendTable").val()
    // updateJSON["Transaction"] = updateTransaction
    // updateJSON["Description"] = "Update data in " + $("#xtendTable").val()
    // deleteJSON["Transaction"] = deleteTransaction
    // deleteJSON["Description"] = "Delete data from " + $("#xtendTable").val()


    var updatesettings = {
        "url": "https://xtendm3-api.herokuapp.com/transactions/m3Update",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "data": JSON.stringify(updateJSON),
    };

    // $.ajax(addsettings).done(function (response) {
    //     console.log(response);
    //     addTransactionOutput = response;
    //     enableAddDownload = true;
    //     $('#addDownloadButton').prop('disabled', false);
    //     $("#tableDownloadButton").prop('disabled', false);

    // });
    // $.ajax(deletesettings).done(function (response) {
    //     console.log(response);
    //     deleteTransactionOutput = response;
    //     enableDeleteDownload = true;
    //     $('#deleteDownloadButton').prop('disabled', false);
    //     $("#tableDownloadButton").prop('disabled', false);
    // });
    // $.ajax(getsettings).done(function (response) {
    //     console.log(response);
    //     getTransactionOutput = response;
    //     enableGetDownload = true;
    //     $('#getDownloadButton').prop('disabled', false);
    //     $("#tableDownloadButton").prop('disabled', false);
    // });
    $.ajax(updatesettings).done(function (response) {
        console.log(response);
        updateTransactionOutput = response;
        enableUpdateDownload = true;
        $('#updateDownloadButton').prop('disabled', false);
        $("#tableDownloadButton").prop('disabled', false);
    });
}


function downloadAddTransactionOutput() {
    console.log("Downloading...")
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(addTransactionOutput)));
    element.setAttribute('download', 'TRANSACTION-' + $("#miProgram").val() + "-" + $("#addTransaction").val() + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadDeleteTransactionOutput() {
    console.log("Downloading...")
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(deleteTransactionOutput)));
    // element.setAttribute('download', 'deleteTransactionOutput.json');
    element.setAttribute('download', 'TRANSACTION-' + $("#miProgram").val() + "-" + $("#deleteTransaction").val() + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadGetTransactionOutput() {
    console.log("Downloading...")
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(getTransactionOutput)));
    // element.setAttribute('download', 'getTransactionOutput.json');
    element.setAttribute('download', 'TRANSACTION-' + $("#miProgram").val() + "-" + $("#getTransaction").val() + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadUpdateTransactionOutput() {
    console.log("Downloading...")
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(updateTransactionOutput)));
    // element.setAttribute('download', 'updateTransactionOutput.json');
    element.setAttribute('download', 'TRANSACTION-' + $("#miProgram").val() + "-" + $("#transaction").val() + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadTableOutput() {
    console.log("Downloading...")

    var tableJSON = {};
    tableJSON["uuid"] = crypto.randomUUID()
    tableJSON["tableName"] = $("#xtendTable").val()
    tableJSON["active"] = "0"
    tableJSON["dbCreated"] = "0"
    tableJSON["modified"] = Date.now()
    tableJSON["modifiedBy"] = $("#userName").val()
    tableJSON["description"] = ""
    tableJSON["table"] = {}
    tableJSON["table"]["name"] = $("#xtendTable").val()
    tableJSON["table"]["description"] = "CUSTOM DATABASE TABLE"

    var index = []
    var indexJSON = {}
    indexJSON["name"] = "00"
    indexJSON["unique"] = true
    var indexKeys = []
    primaryKeys.forEach(element => {
        indexKeys.push({ "name": "EX" + element, "ascending": false })
    });
    indexJSON["keys"] = indexKeys
    index.push(indexJSON)
    tableJSON["table"]["indexes"] = index

    var tableFields = []
    var rows = $("#fieldsTableBody tr");
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var fieldName = "EX" + row.childNodes[1].innerHTML;
        var fieldType = row.childNodes[2].innerHTML == "String" ? "CHAR" : "DECIMAL";
        var fieldLength = parseInt(row.childNodes[3].innerHTML);
        var fieldDecimal = row.childNodes[4].innerHTML == "" ? 0 : parseInt(row.childNodes[4].innerHTML);
        // var fieldDescription = row.childNodes[5].innerHTML;
        // var fieldprimaryKey = row.childNodes[6].innerHTML;
        fieldJSON = {
            "name": fieldName,
            "length": fieldLength,
            "nrOfDecimals": fieldDecimal,
            "dataType": fieldType,
        }
        // if (fieldType == "Decimal") {
        //     fieldJSON["decimal"] = parseInt(fieldDecimal);
        // }
        tableFields.push(fieldJSON)
    }
    tableFields.push({ "name": "EXRGDT", length: 8, "nrOfDecimals": 0, "dataType": "DECIMAL" })
    tableFields.push({ "name": "EXRGTM", length: 6, "nrOfDecimals": 0, "dataType": "DECIMAL" })
    tableFields.push({ "name": "EXLMDT", length: 8, "nrOfDecimals": 0, "dataType": "DECIMAL" })
    tableFields.push({ "name": "EXLMTS", length: 18, "nrOfDecimals": 0, "dataType": "DECIMAL" })
    tableFields.push({ "name": "EXCHID", length: 10, "nrOfDecimals": 0, "dataType": "CHAR" })
    tableFields.push({ "name": "EXCHNO", length: 3, "nrOfDecimals": 0, "dataType": "DECIMAL" })
    tableJSON["table"]["fields"] = tableFields


    console.log(tableJSON)


    var tableOutput = tableJSON

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(tableOutput)));
    element.setAttribute('download', 'tableOutput.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}