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

    $("#miProgram").on("input", function () {
        var value = $(this).val().toUpperCase();
        $(this).val(value.toUpperCase());
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
        $(this).val(value.toUpperCase());
        // console.log(value)
        $("#m3Table").removeClass("is-valid");
        $("#m3Table").addClass("is-invalid");
    });

    $("#userName").on("input", function () {
        var value = $(this).val().toUpperCase();
        $(this).val(value.toUpperCase());
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
        var value = $(this).val().toUpperCase();
        $(this).val(value.toUpperCase());
        // console.log(value)
        $("#fieldName").removeClass("is-valid");
        $("#fieldName").addClass("is-invalid");
        $("#fieldModalSubmit").addClass("disabled");
        $("#fieldModalSubmit").prop("disabled", true);
    });

    $("#editfieldName").on("input", function () {
        var value = $(this).val().toUpperCase();
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
        // $.LoadingOverlay("show", {
        //     image: "",
        //     fontawesome: "fa fa-cog fa-spin"
        // });
        $("#m3Table").addClass("is-loading");
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
                $("#m3Table").removeClass("is-loading");
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

                // $("#fieldDataList").empty();
                // console.log(fields);
                // for (var i = 0; i < response["columns"].length; i++) {
                //     var column = response["columns"][i];
                //     var columnName = column["name"].substring(2);
                //     var columnDescription = column["description"];
                //     if (["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(columnName.trim().toUpperCase()) > -1 || fields.indexOf(tablePrefix + columnName.trim().toUpperCase()) > -1) {
                //         continue;
                //     }

                //     $("#fieldDataList").append("<option value='" + columnName + "'>" + columnDescription + "</option>");
                // }
            } else {
                $("#fieldModalSubmit").prop("disabled", true);
                $("#m3Table").removeClass("is-valid");
                $("#m3Table").addClass("is-invalid");
                $("#m3Table").removeClass("is-loading");
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

        $("#fieldDataList").empty();

        for (var i = 0; i < tableMetadata["columns"].length; i++) {
            var column = tableMetadata["columns"][i];
            var columnName = column["name"].substring(2);
            var columnDescription = column["description"];
            if (["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(columnName.trim().toUpperCase()) > -1 || fields.indexOf(tablePrefix + columnName.trim().toUpperCase()) > -1) {
                continue;
            }

            $("#fieldDataList").append("<option class='fieldOption' value='" + columnName + "'>" + columnDescription + "</option>");
        }
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

        $("#editfieldDataList").empty();

        for (var i = 0; i < tableMetadata["columns"].length; i++) {
            var column = tableMetadata["columns"][i];
            var columnName = column["name"].substring(2);
            var columnDescription = column["description"];
            if (["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(columnName.trim().toUpperCase()) > -1 || fields.indexOf(tablePrefix + columnName.trim().toUpperCase()) > -1) {
                continue;
            }

            $("#editfieldDataList").append("<option class='editfieldOption' value='" + columnName + "'>" + columnDescription + "</option>");
        }
    });

    $('#editModal').on('hidden.bs.modal', function () {
        // console.log("closed");
        var selectRowCheckbox = document.getElementsByClassName("selectRowCheckbox");
        var selectedRows = [];
        for (var i = 0; i < selectRowCheckbox.length; i++) {
            if (selectRowCheckbox.item(i).checked) {
                // selectedRows.push(selectRowCheckbox.item(i));
                selectRowCheckbox.item(i).checked = false;
            }
        }
    });

    $('#deleteFieldModal').on('hidden.bs.modal', function () {
        // console.log("closed");
        var selectRowCheckbox = document.getElementsByClassName("selectRowCheckbox");
        var selectedRows = [];
        for (var i = 0; i < selectRowCheckbox.length; i++) {
            if (selectRowCheckbox.item(i).checked) {
                // selectedRows.push(selectRowCheckbox.item(i));
                selectRowCheckbox.item(i).checked = false;
            }
        }
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

    btn = document.getElementById('generate');

    $("#updateDownloadButton").prop("disabled", true);

    var downloadMessages = [
        "Reticulating splines...",
        "Generating witty dialog...",
        "Swapping time and space...",
        "Spinning violently around the y-axis...",
        "Tokenizing real life...",
        "Bending the spoon...",
        "Filtering morale...",
        "Don't think of purple hippos...",
        "We need a new fuse...",
        "Have a good day.",
        "Upgrading Windows, your PC will restart several times. Sit back and relax.",
        "640K ought to be enough for anybody",
        "The architects are still drafting",
        "The bits are breeding",
        "We're building the buildings as fast as we can",
        "Would you prefer chicken, steak, or tofu?",
        "(Pay no attention to the man behind the curtain)",
        "...and enjoy the elevator music...",
        "Please wait while the little elves draw your map",
        "Don't worry - a few bits tried to escape, but we caught them",
        "Would you like fries with that?",
        "Checking the gravitational constant in your locale...",
        "Go ahead -- hold your breath!",
        "...at least you're not on hold...",
        "Hum something loud while others stare",
        "You're not in Kansas any more",
        "The server is powered by a lemon and two electrodes.",
        "Please wait while a larger software vendor in Seattle takes over the world",
        "We're testing your patience",
        "As if you had any other choice",
        "Follow the white rabbit",
        "Why don't you order a sandwich?",
        "While the satellite moves into position",
        "keep calm and npm install",
        "The bits are flowing slowly today",
        "Dig on the 'X' for buried treasure... ARRR!",
        "It's still faster than you could draw it",
        "The last time I tried this the monkey didn't survive. Let's hope it works better this time.",
        "I should have had a V8 this morning.",
        "My other loading screen is much faster.",
        "Testing on Timmy... We're going to need another Timmy.",
        "Reconfoobling energymotron...",
        "(Insert quarter)",
        "Are we there yet?",
        "Have you lost weight?",
        "Just count to 10",
        "Why so serious?",
        "It's not you. It's me.",
        "Counting backwards from Infinity",
        "Don't panic...",
        "Embiggening Prototypes",
        "Do not run! We are your friends!",
        "Do you come here often?",
        "Warning: Don't set yourself on fire.",
        "We're making you a cookie.",
        "Creating time-loop inversion field",
        "Spinning the wheel of fortune...",
        "Loading the enchanted bunny...",
        "Computing chance of success",
        "I'm sorry Dave, I can't do that.",
        "Looking for exact change",
        "All your web browser are belong to us",
        "All I really need is a kilobit.",
        "I feel like im supposed to be loading something. . .",
        "What do you call 8 Hobbits? A Hobbyte.",
        "Should have used a compiled language...",
        "Is this Windows?",
        "Adjusting flux capacitor...",
        "Please wait until the sloth starts moving.",
        "Don't break your screen yet!",
        "I swear it's almost done.",
        "Let's take a mindfulness minute...",
        "Unicorns are at the end of this road, I promise.",
        "Listening for the sound of one hand clapping...",
        "Keeping all the 1's and removing all the 0's...",
        "Putting the icing on the cake. The cake is not a lie...",
        "Cleaning off the cobwebs...",
        "Making sure all the i's have dots...",
        "We need more dilithium crystals",
        "Where did all the internets go",
        "Connecting Neurotoxin Storage Tank...",
        "Granting wishes...",
        "Time flies when you’re having fun.",
        "Get some coffee and come back in ten minutes..",
        "Spinning the hamster…",
        "99 bottles of beer on the wall..",
        "Stay awhile and listen..",
        "Be careful not to step in the git-gui",
        "You edhall not pass! yet..",
        "Load it and they will come",
        "Convincing AI not to turn evil..",
        "There is no spoon. Because we are not done loading it",
        "Your left thumb points to the right and your right thumb points to the left.",
        "How did you get here?",
        "Wait, do you smell something burning?",
        "Computing the secret to life, the universe, and everything.",
        "When nothing is going right, go left!!...",
        "I love my job only when I'm on vacation...",
        "i'm not lazy, I'm just relaxed!!",
        "Never steal. The government hates competition....",
        "Why are they called apartments if they are all stuck together?",
        "Life is Short – Talk Fast!!!!",
        "Optimism – is a lack of information.....",
        "Save water and shower together",
        "Whenever I find the key to success, someone changes the lock.",
        "Sometimes I think war is God’s way of teaching us geography.",
        "I’ve got problem for your solution…..",
        "Where there’s a will, there’s a relative.",
        "User: the word computer professionals use when they mean !!idiot!!",
        "Adults are just kids with money.",
        "I think I am, therefore, I am. I think.",
        "A kiss is like a fight, with mouths.",
        "You don’t pay taxes—they take taxes.",
        "Coffee, Chocolate, Men. The richer the better!",
        "I am free of all prejudices. I hate everyone equally.",
        "git happens",
        "May the forks be with you",
        "A commit a day keeps the mobs away",
        "This is not a joke, it's a commit.",
        "Constructing additional pylons...",
        "Roping some seaturtles...",
        "Locating Jebediah Kerman...",
        "We are not liable for any broken screens as a result of waiting.",
        "Hello IT, have you tried turning it off and on again?",
        "If you type Google into Google you can break the internet",
        "Well, this is embarrassing.",
        "What is the airspeed velocity of an unladen swallow?",
        "Hello, IT... Have you tried forcing an unexpected reboot?",
        "They just toss us away like yesterday's jam.",
        "They're fairly regular, the beatings, yes. I'd say we're on a bi-weekly beating.",
        "The Elders of the Internet would never stand for it.",
        "Space is invisible mind dust, and stars are but wishes.",
        "Didn't know paint dried so quickly.",
        "Everything sounds the same",
        "I'm going to walk the dog",
        "I didn't choose the engineering life. The engineering life chose me.",
        "Dividing by zero...",
        "Spawn more Overlord!",
        "If I’m not back in five minutes, just wait longer.",
        "Some days, you just can’t get rid of a bug!",
        "We’re going to need a bigger boat.",
        "Chuck Norris never git push. The repo pulls before.",
        "Web developers do it with <style>",
        "I need to git pull --my-life-together",
        "Java developers never RIP. They just get Garbage Collected.",
        "Cracking military-grade encryption...",
        "Simulating traveling salesman...",
        "Proving P=NP...",
        "Entangling superstrings...",
        "Twiddling thumbs...",
        "Searching for plot device...",
        "Trying to sort in O(n)...",
        "Laughing at your pictures-i mean, loading...",
        "Sending data to NS-i mean, our servers.",
        "Looking for sense of humour, please hold on.",
        "Please wait while the intern refills his coffee.",
        "A different error message? Finally, some progress!",
        "Hold on while we wrap up our git together...sorry",
        "Please hold on as we reheat our coffee",
        "Kindly hold on as we convert this bug to a feature...",
        "Kindly hold on as our intern quits vim...",
        "Winter is coming...",
        "Installing dependencies",
        "Switching to the latest JS framework...",
        "Distracted by cat gifs",
        "Finding someone to hold my beer",
        "BRB, working on my side project",
        "@todo Insert witty loading message",
        "Let's hope it's worth the wait",
        "Aw, snap! Not..",
        "Ordering 1s and 0s...",
        "Updating dependencies...",
        "Whatever you do, don't look behind you...",
        "Please wait... Consulting the manual...",
        "It is dark. You're likely to be eaten by a grue.",
        "Loading funny message...",
        "It's 10:00pm. Do you know where your children are?",
        "Waiting Daenerys say all her titles...",
        "Feel free to spin in your chair",
        "What the what?",
        "format C: ...",
        "Forget you saw that password I just typed into the IM ...",
        "What's under there?",
        "Your computer has a virus, its name is Windows!",
        "Go ahead, hold your breath and do an ironman plank till loading complete",
        "Bored of slow loading spinner, buy more RAM!",
        "Help, I'm trapped in a loader!",
        "What is the difference btwn a hippo and a zippo? One is really heavy, the other is a little lighter",
        "Please wait, while we purge the Decepticons for you. Yes, You can thanks us later!",
        "Chuck Norris once urinated in a semi truck's gas tank as a joke....that truck is now known as Optimus Prime.",
        "Chuck Norris doesn’t wear a watch. HE decides what time it is.",
        "Mining some bitcoins...",
        "Downloading more RAM..",
        "Updating to Windows Vista...",
        "Deleting System32 folder",
        "Hiding all ;'s in your code",
        "Alt-F4 speeds things up.",
        "Initializing the initializer...",
        "When was the last time you dusted around here?",
        "Optimizing the optimizer...",
        "Last call for the data bus! All aboard!",
        "Running swag sticker detection...",
        "Never let a computer know you're in a hurry.",
        "A computer will do what you tell it to do, but that may be much different from what you had in mind.",
        "Some things man was never meant to know. For everything else, there's Google.",
        "Unix is user-friendly. It's just very selective about who its friends are.",
        "Shovelling coal into the server",
        "Pushing pixels...",
        "How about this weather, eh?",
        "Building a wall...",
        "Everything in this universe is either a potato or not a potato",
        "The severity of your issue is always lower than you expected.",
        "Updating Updater...",
        "Downloading Downloader...",
        "Debugging Debugger...",
        "Reading Terms and Conditions for you.",
        "Digested cookies being baked again.",
        "Live long and prosper.",
        "There is no cow level, but there's a goat one!",
        "Deleting all your hidden porn...",
        "Running with scissors...",
        "Definitely not a virus...",
        "You may call me Steve.",
        "You seem like a nice person...",
        "Coffee at my place, tommorow at 10A.M. - don't be late!",
        "Work, work...",
        "Patience! This is difficult, you know...",
        "Discovering new ways of making you wait...",
        "Your time is very important to us. Please wait while we ignore you...",
        "Time flies like an arrow; fruit flies like a banana",
        "Two men walked into a bar; the third ducked...",
        "Sooooo... Have you seen my vacation photos yet?",
        "Sorry we are busy catching em' all, we're done soon",
        "TODO: Insert elevator music",
        "Still faster than Windows update",
        "Composer hack: Waiting for reqs to be fetched is less frustrating if you add -vvv to your command.",
        "Please wait while the minions do their work",
        "Grabbing extra minions",
        "Doing the heavy lifting",
        "We're working very Hard .... Really",
        "Waking up the minions",
        "You are number 2843684714 in the queue",
        "Please wait while we serve other customers...",
        "Our premium plan is faster",
        "Feeding unicorns...",
    ]
    const random = Math.floor(Math.random() * downloadMessages.length);

    document.getElementById("generateMessage").innerHTML = downloadMessages[random];

    // Set the spinner
    btn.innerHTML = '<i class = "fa fa-spinner fa-spin"></i> Generating API...';


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
        // "url": "https://xtendm3-api.herokuapp.com/transactions/m3Update",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "data": JSON.stringify(updateJSON),
    };

    updatesettingsForError = {
        "url": "https://xtendm3-api.herokuapp.com/transactions/m3Update",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "data": updateJSON,
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
    $.ajax(updatesettings).then(function (response) {

        // Do the work. A sample method to wait for 3 second.
        setTimeout(function () {
            // When the work is done, reset the button to original state
            btn.innerHTML = 'Generate';
            console.log(response);
            updateTransactionOutput = response;
            enableUpdateDownload = true;
            $('#updateDownloadButton').prop('disabled', false);
            $("#tableDownloadButton").prop('disabled', false);
            $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 100);
            document.getElementById("generateMessage").innerHTML = "";
        }, 3000);
    }).catch(function (response) {
        console.log(response);
        btn.innerHTML = 'Generate';
        enableUpdateDownload = false;
        $('#updateDownloadButton').prop('disabled', true);
        $("#tableDownloadButton").prop('disabled', true);
        document.getElementById("generateMessage").innerHTML = "";
        $("#errorModal").modal('show');
        if(response.status == 422){
            $("#errorMessage").html("Failed to create the Update transaction. Please try again.<br/><br/>" + "<a href='https://github.com/ajayyadukrishnan/xtendm3-generator/issues/new?title=New+bug+report&body=%23+API+Failure%0AUpdate+M3+Transaction%0A%0A%23%23+API+Request%0A%0A```javascript%0A%0A" + encodeURIComponent(JSON.stringify(updatesettingsForError, null, "\t")) + "%0A%0A```%0A%0A%23%23+API+Response:%0A%0A" + response.responseJSON.error + "&labels=API+Failure,bug' target='_blank'>Raise an issue.</a>");
        } else {
            $("#errorMessage").html("Failed to create the Update transaction. Please try again.<br/><br/>" + "<a href='https://github.com/ajayyadukrishnan/xtendm3-generator/issues/new?title=New+bug+report&body=%23+API+Failure%0AUpdate+M3+Transaction%0A%0A%23%23+API+Request%0A%0A```javascript%0A%0A" + encodeURIComponent(JSON.stringify(updatesettingsForError, null, "\t")) + "%0A%0A```%0A%0A%23%23+API+Response:%0A%0A" + response.statusText + "&labels=API+Failure,bug' target='_blank'>Raise an issue.</a>");
        }
    
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