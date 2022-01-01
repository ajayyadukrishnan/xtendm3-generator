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

    $("#addTransaction").on("input", function () {
        var value = $(this).val().trim();
        if (value.match("^[a-zA-Z][a-zA-Z0-9]{0,14}$") && $("#deleteTransaction").val().trim() != value && $("#updateTransaction").val().trim() != value && $("#getTransaction").val().trim() != value) {
            $("#addTransaction").removeClass("is-invalid");
            $("#addTransaction").addClass("is-valid");
        } else {
            $("#addTransaction").removeClass("is-valid");
            $("#addTransaction").addClass("is-invalid");
        }
    });

    $("#deleteTransaction").on("input", function () {
        var value = $(this).val().trim();
        if (value.match("^[a-zA-Z][a-zA-Z0-9]{0,14}$") && $("#addTransaction").val().trim() != value && $("#updateTransaction").val().trim() != value && $("#getTransaction").val().trim() != value) {
            $("#deleteTransaction").removeClass("is-invalid");
            $("#deleteTransaction").addClass("is-valid");
        } else {
            $("#deleteTransaction").removeClass("is-valid");
            $("#deleteTransaction").addClass("is-invalid");
        }
    });

    $("#getTransaction").on("input", function () {
        var value = $(this).val().trim();
        if (value.match("^[a-zA-Z][a-zA-Z0-9]{0,14}$") && $("#addTransaction").val().trim() != value && $("#updateTransaction").val().trim() != value && $("#deleteTransaction").val().trim() != value) {
            $("#getTransaction").removeClass("is-invalid");
            $("#getTransaction").addClass("is-valid");
        } else {
            $("#getTransaction").removeClass("is-valid");
            $("#getTransaction").addClass("is-invalid");
        }
    });

    $("#updateTransaction").on("input", function () {
        var value = $(this).val().trim();
        if (value.match("^[a-zA-Z][a-zA-Z0-9]{0,14}$") && $("#addTransaction").val().trim() != value && $("#deleteTransaction").val().trim() != value && $("#getTransaction").val().trim() != value) {
            $("#updateTransaction").removeClass("is-invalid");
            $("#updateTransaction").addClass("is-valid");
        } else {
            $("#updateTransaction").removeClass("is-valid");
            $("#updateTransaction").addClass("is-invalid");
        }
    });

    $("#userName").on("input", function () {
        var value = $(this).val();
        if (value.match("^[a-zA-Z][a-zA-Z0-9]{0,9}$")) {
            $("#userName").removeClass("is-invalid");
            $("#userName").addClass("is-valid");
        } else {
            $("#userName").removeClass("is-valid");
            $("#userName").addClass("is-invalid");
        }
    });

    $("#xtendTable").on("input", function () {
        var value = $(this).val();
        if (value.match("^EXT[a-zA-Z0-9]{3}$")) {
            $("#xtendTable").removeClass("is-invalid");
            $("#xtendTable").addClass("is-valid");
        } else {
            $("#xtendTable").removeClass("is-valid");
            $("#xtendTable").addClass("is-invalid");
        }
    });

    $("#fieldName").on("input", function () {
        var value = $(this).val();
        if (value.match("^[0-9a-zA-Z]{4}$") && fields.indexOf(value.toUpperCase()) == -1) {
            $("#fieldName").removeClass("is-invalid");
            $("#fieldName").addClass("is-valid");
        } else {
            $("#fieldName").removeClass("is-valid");
            $("#fieldName").addClass("is-invalid");
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

    $("#fieldLength").on("input", function () {
        var value = $(this).val();
        var dataType = $("#fieldType").val();
        if (dataType.match("^Decimal$")) {
            if (value.match("^[1-9]{1}$|^[1]{1}[0-8]{1}$|18")) {
                $("#fieldLength").removeClass("is-invalid");
                $("#fieldLength").addClass("is-valid");
            } else {
                $("#fieldLength").removeClass("is-valid");
                $("#fieldLength").addClass("is-invalid");
            }
        } else {

            if (value.match("^([1-9][0-9]{0,3}|10000)$")) {
                $("#fieldLength").removeClass("is-invalid");
                $("#fieldLength").addClass("is-valid");
            } else {
                $("#fieldLength").removeClass("is-valid");
                $("#fieldLength").addClass("is-invalid");
            }
        }
    });

    $("#fieldDecimal").on("input", function () {
        var value = $(this).val();
        var dataType = $("#fieldType").val();
        if (dataType.match("^Decimal$")) {
            var length = $("#fieldLength").val();
            if (value.match("^\\d+$") && parseInt(value) < parseInt(length)) {
                $("#fieldDecimal").removeClass("is-invalid");
                $("#fieldDecimal").addClass("is-valid");
            } else {
                $("#fieldDecimal").removeClass("is-valid");
                $("#fieldDecimal").addClass("is-invalid");
            }
        } else {

        }
    });

    $("#fieldDescription").on("input", function () {
        var value = $(this).val();
        if (value.trim().match("^[0-9a-zA-Z ]+$")) {
            $("#fieldDescription").removeClass("is-invalid");
            $("#fieldDescription").addClass("is-valid");
        } else {
            $("#fieldDescription").removeClass("is-valid");
            $("#fieldDescription").addClass("is-invalid");
        }
    });

    $("#editfieldName").on("input", function () {
        var value = $(this).val();
        if (value.match("^[0-9a-zA-Z]{4}$") && fields.indexOf(value.toUpperCase()) == -1) {
            $("#editfieldName").removeClass("is-invalid");
            $("#editfieldName").addClass("is-valid");
        } else {
            $("#editfieldName").removeClass("is-valid");
            $("#editfieldName").addClass("is-invalid");
        }
    });

    $("#editfieldType").on("change", function () {
        var value = $(this).val();
        if (value.match("^Decimal$")) {
            $(".editfieldDecimalGroup").css({ "display": "block" });
        } else {
            $(".editfieldDecimalGroup").css({ "display": "none" });
            $("#editfieldDecimal").removeClass("is-invalid");
            $("#editfieldDecimal").removeClass("is-valid");
            $("#editfieldLength").val("");
        }
    });

    $("#editfieldLength").on("input", function () {
        var value = $(this).val();
        var dataType = $("#editfieldType").val();
        if (dataType.match("^Decimal$")) {
            if (value.match("^[1-9]{1}$|^[1]{1}[0-8]{1}$|18")) {
                $("#editfieldLength").removeClass("is-invalid");
                $("#editfieldLength").addClass("is-valid");
            } else {
                $("#editfieldLength").removeClass("is-valid");
                $("#editfieldLength").addClass("is-invalid");
            }
        } else {

            if (value.match("^([1-9][0-9]{0,3}|10000)$")) {
                $("#editfieldLength").removeClass("is-invalid");
                $("#editfieldLength").addClass("is-valid");
            } else {
                $("#editfieldLength").removeClass("is-valid");
                $("#editfieldLength").addClass("is-invalid");
            }
        }
    });

    $("#editfieldDecimal").on("input", function () {
        var value = $(this).val();
        var dataType = $("#editfieldType").val();
        if (dataType.match("^Decimal$")) {
            var length = $("#editfieldLength").val();
            // console.log(parseInt(length));
            // console.log(value)
            // console.log(value.match("^\\d+"))
            // console.log(value.match("^\\d+$") && parseInt(value) < parseInt(length))
            if (value.match("^\\d+$") && parseInt(value) < parseInt(length)) {
                $("#editfieldDecimal").removeClass("is-invalid");
                $("#editfieldDecimal").addClass("is-valid");
            } else {
                $("#editfieldDecimal").removeClass("is-valid");
                $("#editfieldDecimal").addClass("is-invalid");
            }
        } else {

        }
    });

    $("#editfieldDescription").on("input", function () {
        var value = $(this).val();
        if (value.trim().match("^[0-9a-zA-Z ]+$")) {
            $("#editfieldDescription").removeClass("is-invalid");
            $("#editfieldDescription").addClass("is-valid");
        } else {
            $("#editfieldDescription").removeClass("is-valid");
            $("#editfieldDescription").addClass("is-invalid");
        }
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


    });

    // $("#fieldModal").on('show.bs.modal', function () {
    //     document.getElementById("fieldForm").reset();
    //     var modal = document.getElementById("fieldModal");
    //     // console.log(modal.getElementsByClassName("is-invalid"))
    //     validClasses = modal.getElementsByClassName("is-valid");
    //     for (var i = 0; i < validClasses.length; i++) {
    //         validClasses.item(i).classList.remove("is-valid");
    //     };
    //     invalidClasses = modal.getElementsByClassName("is-invalid");
    //     for (var i = 0; i < invalidClasses.length; i++) {
    //         invalidClasses.item(i).classList.remove("is-invalid");
    //     };
    // });


    $(function () {
        setInterval(function () {
            // console.log("yes")
            var modal = document.getElementById("fieldModal");
            var editModal = document.getElementById("editModal");
            // console.log($('#fieldModal').hasClass('show'));
            if ($('#fieldModal').hasClass('show')) {
                // console.log(modal.getElementsByClassName("is-valid").length)
                var dataType = $("#fieldType").val();
                if (dataType.match("^Decimal$")) {
                    if (modal.getElementsByClassName("is-valid").length == 4) {
                        $("#fieldModalSubmit").removeClass("disabled");
                    } else {
                        $("#fieldModalSubmit").addClass("disabled");
                    }
                } else {
                    if (modal.getElementsByClassName("is-valid").length == 3) {
                        $("#fieldModalSubmit").removeClass("disabled");
                    } else {
                        $("#fieldModalSubmit").addClass("disabled");
                    }
                }
            }

            if ($('#editModal').hasClass('show')) {
                // console.log(modal.getElementsByClassName("is-valid").length)
                var editdataType = $("#editfieldType").val();
                // console.log(editdataType)
                // console.log(editModal.getElementsByClassName("is-valid").length)
                if (editdataType.match("^Decimal$")) {
                    if ($("#editModal .is-valid").length == 4) {
                        $("#editfieldModalSubmit").removeClass("disabled");
                    } else {
                        $("#editfieldModalSubmit").addClass("disabled");
                    }
                } else {
                    $("#editfieldDecimal").removeClass("is-invalid");
                    $("#editfieldDecimal").removeClass("is-valid");
                    if ($("#editModal .is-valid:not(#editfieldDecimal)").length == 3) {
                        $("#editfieldModalSubmit").removeClass("disabled");
                    } else {
                        $("#editfieldModalSubmit").addClass("disabled");
                    }
                }
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



            var miProgram = document.getElementById("miProgram").value;
            var addTransaction = document.getElementById("addTransaction").value;
            var deleteTransaction = document.getElementById("deleteTransaction").value;
            var getTransaction = document.getElementById("getTransaction").value;
            var updateTransaction = document.getElementById("updateTransaction").value;

            var username = document.getElementById("userName").value;
            var table = document.getElementById("xtendTable").value;

            if (miProgram != "" && addTransaction != "" && deleteTransaction != "" && getTransaction != "" && updateTransaction != "" && username != "" && table != "" && fields.length > 0 && primaryKeys.length > 0) {
                // $("#generate").removeClass("disabled");
            } else {
                $("#generate").addClass("disabled");
            }

            if ($("#mainForm .is-valid").length == 7 && $("#mainForm .is-invalid").length == 0 && fields.length > 0 && primaryKeys.length > 0) {
                $("#generate").removeClass("disabled");
            } else {
                $("#generate").addClass("disabled");
            }

            // console.log(miProgram, miTable, username, table);


        }, 100);
    });

    $('#fieldsTable tbody tr').click(function () {
        // $(this).addClass('active bg-success').siblings().removeClass('active bg-success');
        if ($(this).hasClass('active bg-secondary')) {
            $(this).removeClass('active bg-secondary').siblings().removeClass('active bg-secondary');
        } else {
            $(this).addClass('active bg-secondary').siblings().removeClass('active bg-secondary');
        }
    });
};

function addField() {
    console.log("Clicked")
    var row = document.createElement("tr");
    row.className = "clickable-row";
    var fieldName = document.getElementById("fieldName").value.toUpperCase();
    var fieldType = document.getElementById("fieldType").value;
    var fieldLength = document.getElementById("fieldLength").value;
    var fieldDecimal = document.getElementById("fieldDecimal").value;
    var fieldDescription = document.getElementById("fieldDescription").value;
    var fieldprimaryKey = document.getElementById("fieldprimaryKey").checked;

    if (!fieldType.match("^Decimal$")) {
        fieldDecimal = "";
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
    fields.push(fieldName);
    if (fieldprimaryKey) {
        primaryKeys.push(fieldName);
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
    for (var i = 0; i < selectedRows.length; i++) {
        var row = selectedRows[i]
        console.log(row.parentNode.parentNode)
        row.parentNode.parentNode.remove();
        var index = fields.indexOf(row.parentNode.parentNode.childNodes[1].innerHTML);
        if (index !== -1) {
            fields.splice(index, 1);
        }
        var primaryKeyIndex = primaryKeys.indexOf(row.parentNode.parentNode.childNodes[1].innerHTML);
        if (primaryKeyIndex !== -1) {
            primaryKeys.splice(primaryKeyIndex, 1);
        }
    }
    $("#deleteFieldModal").modal('toggle')

}

function editField() {
    $("#editModal").modal('toggle')
}

function saveChanges() {
    $("#editModal").modal('toggle')

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
    var fieldprimaryKey = document.getElementById("editfieldprimaryKey").checked;

    if (!fieldType.match("^Decimal$")) {
        fieldDecimal = "";
    }

    var row = selectedRows[0].parentNode.parentNode;
    row.childNodes[1].innerHTML = fieldName;
    row.childNodes[2].innerHTML = fieldType;
    row.childNodes[3].innerHTML = fieldLength;
    row.childNodes[4].innerHTML = fieldDecimal;
    row.childNodes[5].innerHTML = fieldDescription;
    row.childNodes[6].innerHTML = fieldprimaryKey;

    var primaryKeyIndex = primaryKeys.indexOf(row.childNodes[1].innerHTML);
    if (primaryKeyIndex !== -1 && !fieldprimaryKey) {
        primaryKeys.splice(primaryKeyIndex, 1);
    } else if (primaryKeyIndex === -1 && fieldprimaryKey) {
        primaryKeys.push(fieldName);
    } else if (fieldprimaryKey) {
        primaryKeys.push(fieldName);
    }


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
    var getTransaction = $("#getTransaction").val()
    var deleteTransaction = $("#deleteTransaction").val()
    var addTransaction = $("#addTransaction").val()
    var updateTransaction = $("#updateTransaction").val()

    var addJSON = {
        "MIProgram": $("#miProgram").val(),
        "Transaction": addTransaction,
        "Description": "Add data to " + $("#xtendTable").val(),
        "UserName": $("#userName").val(),
        "Table": $("#xtendTable").val(),
    };

    var deleteJSON = {
        "MIProgram": $("#miProgram").val(),
        "Transaction": deleteTransaction,
        "Description": "Delete data from " + $("#xtendTable").val(),
        "UserName": $("#userName").val(),
        "Table": $("#xtendTable").val(),
    };

    var updateJSON = {
        "MIProgram": $("#miProgram").val(),
        "Transaction": updateTransaction,
        "Description": "Update data in " + $("#xtendTable").val(),
        "UserName": $("#userName").val(),
        "Table": $("#xtendTable").val(),
        "TableIndex": "00",
    };

    var getJSON = {
        "MIProgram": $("#miProgram").val(),
        "Transaction": getTransaction,
        "Description": "Get data from " + $("#xtendTable").val(),
        "UserName": $("#userName").val(),
        "Table": $("#xtendTable").val(),
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
    addJSON.fields = fieldsArray;
    deleteJSON.fields = fieldsArray;
    updateJSON.fields = fieldsArray;
    getJSON["fields"] = fieldsArray;

    console.log(getTransaction, deleteTransaction, addTransaction, updateTransaction)

    console.log(getTransaction)


    // getJSON["Transaction"] = getTransaction
    // getJSON["Description"] = "Get data from " + $("#xtendTable").val()
    // addJSON["Transaction"] = addTransaction
    // addJSON["Description"] = "Add data to " + $("#xtendTable").val()
    // updateJSON["Transaction"] = updateTransaction
    // updateJSON["Description"] = "Update data in " + $("#xtendTable").val()
    // deleteJSON["Transaction"] = deleteTransaction
    // deleteJSON["Description"] = "Delete data from " + $("#xtendTable").val()

    console.log(getJSON)
    console.log(addJSON)
    console.log(updateJSON)
    console.log(deleteJSON)

    var addsettings = {
        "url": "https://xtendm3-api.herokuapp.com/transactions/add",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "data": JSON.stringify(addJSON),
    };
    var deletesettings = {
        "url": "https://xtendm3-api.herokuapp.com/transactions/delete",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "data": JSON.stringify(deleteJSON),
    };
    var getsettings = {
        "url": "https://xtendm3-api.herokuapp.com/transactions/get",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "data": JSON.stringify(getJSON),
    };
    var updatesettings = {
        "url": "https://xtendm3-api.herokuapp.com/transactions/update",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "data": JSON.stringify(updateJSON),
    };

    $.ajax(addsettings).done(function (response) {
        console.log(response);
        addTransactionOutput = response;
        enableAddDownload = true;
        $('#addDownloadButton').prop('disabled', false);
        $("#tableDownloadButton").prop('disabled', false);

    });
    $.ajax(deletesettings).done(function (response) {
        console.log(response);
        deleteTransactionOutput = response;
        enableDeleteDownload = true;
        $('#deleteDownloadButton').prop('disabled', false);
        $("#tableDownloadButton").prop('disabled', false);
    });
    $.ajax(getsettings).done(function (response) {
        console.log(response);
        getTransactionOutput = response;
        enableGetDownload = true;
        $('#getDownloadButton').prop('disabled', false);
        $("#tableDownloadButton").prop('disabled', false);
    });
    $.ajax(updatesettings).done(function (response) {
        console.log(response);
        updateTransactionOutput = response;
        enableUpdateDownload = true;
        $('#updateDownloadButton').prop('disabled', false);
        $("#tableDownloadButton").prop('disabled', false);
    });

    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() }, 100);

    // var done = 4;
    // $([addsettings, deletesettings, getsettings, updatesettings]).each(function () {
    //     var settings = this;
    //     // $.getJSON("/values/" + number, function (data) {
    //     //     sum += data.value;
    //     //     done -= 1;
    //     //     if (done == 0) $("#mynode").html(sum);
    //     // });
    //     $.ajax(settings).done(function (response) {
    //         console.log(response);

    //         done -= 1;
    //     });
    // });
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
    element.setAttribute('download', 'TRANSACTION-' + $("#miProgram").val() + "-" + $("#updateTransaction").val() + '.json');

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
    var tableOutputString = JSON.stringify(tableOutput)




    var tableOutputString = `
    function getCSRF() {
        const req = {
            method: 'GET',
            url: '/m3api-rest/csrf',
            cache: false
        }
        
        return new Promise((resolve, reject) => {
            $.ajax(req).then(
                function (resp) {
                    console.log(resp)
                    resolve(resp)
                },
                function (err) {
                    reject(err)
                }
            )
        })
    }
    function copyToClipboard(text) {
       var textArea = document.createElement( "textarea" );
       textArea.value = text;
       document.body.appendChild( textArea );       
       textArea.select();
       try {
          var successful = document.execCommand( 'copy' );
          console.log('Table export copied to clipboard. Do not copy any other text!!!');
       } catch (err) {
          console.log('Oops, unable to copy!',err);
       }    
       document.body.removeChild( textArea );
    }
    function getTableDetails(tableName) {
        tableName = tableName.trim()
        var csrf = ""
        getCSRF().then(function(response) {
            console.log(response)
            csrf = response
            console.log(csrf)
            fetch('https://m3prduse1.m3.inforcloudsuite.com/foundation-rest/tenant/extensibility/dynamicdb/tables/' + tableName, {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'fnd-csrf-token': csrf
                }
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log(data);
                copyToClipboard(JSON.stringify(data))
            });
        }).catch(function(error) {
            console.log(error)
        })
    }
    function createTablefromClipboard(tableJSON) {
        tableName = JSON.parse(tableJSON).tableName
        var csrf = ""
        getCSRF().then(function(response) {
            console.log(response)
            csrf = response
            console.log(csrf)
            fetch('https://m3prduse1.m3.inforcloudsuite.com/foundation-rest/tenant/extensibility/dynamicdb/tables/' + tableName + "/create", {
                method: 'POST',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'fnd-csrf-token': csrf
                }
            }).then(function(response) {
                console.log(response)
                setTimeout(function(){
                    fetch('https://m3prduse1.m3.inforcloudsuite.com/foundation-rest/tenant/extensibility/dynamicdb/tables', {
                        method: 'PUT',
                        headers: {
                            'accept': 'application/json, text/plain, */*',
                            'fnd-csrf-token': csrf,
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: tableJSON
                    }).then(function(response) {
                        console.log(response)
                    }).catch(function(error) {
                        console.log(error);
                    });
                }, 5000);
            }).catch(function(error) {
                console.log(error);
            });
        }).catch(function(error) {
            console.log(error)
        })
    }
    function disableTable(tableName){
        tableName = tableName.trim()
        var csrf = ""
        getCSRF().then(function(response) {
            console.log(response)
            csrf = response
            console.log(csrf)
            fetch('https://m3prduse1.m3.inforcloudsuite.com/foundation-rest/tenant/extensibility/dynamicdb/tables/' + tableName + "/active?active=false", {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'fnd-csrf-token': csrf
                },
                "method": "POST"
            }).then(function(response) {
                console.log(response)
                return response.json();
            }).catch(function(error) {
                console.log(error);
            });
        }).catch(function(error) {
            console.log(error)
        })
    }
    function deleteTable(tableName){
        tableName = tableName.trim()
        var csrf = ""
        getCSRF().then(function(response) {
            console.log(response)
            csrf = response
            console.log(csrf)
            fetch('https://m3prduse1.m3.inforcloudsuite.com/foundation-rest/tenant/extensibility/dynamicdb/tables/' + tableName, {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'fnd-csrf-token': csrf
                },
                "method": "DELETE"
            }).then(function(response) {
                console.log(response)
                return response.json();
            }).catch(function(error) {
                console.log(error);
            });
        }).catch(function(error) {
            console.log(error)
        })
    }createTablefromClipboard('` + tableOutputString.trim() + `')`













    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tableOutputString));
    element.setAttribute('download', 'tableOutput.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}