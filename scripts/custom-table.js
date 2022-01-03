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
        if (value.match("^[0-9a-zA-Z]{4}$") && fields.indexOf(value.toUpperCase()) == -1
            && ["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(value.trim().toUpperCase()) == -1) {
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
        if (value.match("^[0-9a-zA-Z]{4}$") && fields.indexOf(value.toUpperCase()) == -1
            && ["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(value.trim().toUpperCase()) == -1) {
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


    $("#lookupField").on("click", function () {
        var value = $("#fieldName").val();
        console.log(value)
        if (value.trim().length < 4 || ["RGDT", "RGTM", "LMDT", "LMTS", "CHID", "CHNO"].indexOf(value.trim().toUpperCase()) > -1) {
            $("#fieldName").addClass("is-invalid");
            $("#fieldName").removeClass("is-valid");
            return;
        } else {
            $("#fieldName").addClass("is-loading");
            var lookupData = {
                "url": "https://xtendm3-api.herokuapp.com/tables/lookupColumn?column=" + value,
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "data": JSON.stringify({}),
            };

            $.ajax(lookupData).done(function (response) {
                console.log(response);
                if (response["document"] != null) {
                    var columnData = response["document"];
                    var decimals = columnData["decimals"];
                    var length = columnData["length"];
                    var type = columnData["type"] == "CHAR" ? "String" : "Decimal";
                    var description = columnData["description"].replace("ï¿½", "'");

                    $("#fieldType").val(type);
                    $("#fieldLength").val(length);
                    $("#fieldDecimal").val(decimals);
                    $("#fieldDescription").val(description);

                    if (type.match("^Decimal$")) {
                        $(".fieldDecimalGroup").css({ "display": "block" });
                    } else {
                        $(".fieldDecimalGroup").css({ "display": "none" });
                        $("#fieldDecimal").removeClass("is-invalid");
                        $("#fieldDecimal").removeClass("is-valid");
                    }
                    $("#fieldLength").removeClass("is-invalid");
                    $("#fieldLength").addClass("is-valid");
                    if (type == "Decimal") {
                        $("#fieldDecimal").removeClass("is-invalid");
                        $("#fieldDecimal").addClass("is-valid");
                    } else {
                        $("#fieldDecimal").removeClass("is-valid");
                        $("#fieldDecimal").removeClass("is-invalid");
                    }
                    $("#fieldDescription").removeClass("is-invalid");
                    $("#fieldDescription").addClass("is-valid");

                    $("#fieldModalSubmit").prop("disabled", false);

                } else {
                    console.log("fail");
                }
                $("#fieldName").removeClass("is-loading");
            });
        }
    });


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
    if ($("#fieldModalSubmit").hasClass("disabled")) {
        return;
    }

    console.log("Clicked")
    var row = document.createElement("tr");
    row.className = "clickable-row";
    var fieldName = document.getElementById("fieldName").value.toUpperCase();
    var fieldType = document.getElementById("fieldType").value;
    var fieldLength = document.getElementById("fieldLength").value;
    var fieldDecimal = document.getElementById("fieldDecimal").value;
    var fieldDescription = document.getElementById("fieldDescription").value;
    var fieldprimaryKey = document.getElementById("fieldprimaryKey").checked;

    // if (!fieldType.match("^Decimal$")) {
    //     fieldDecimal = "";
    // }

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

    // if (!fieldType.match("^Decimal$")) {
    //     fieldDecimal = "";
    // }

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

    btn = document.getElementById('generate');

    $("#tableDownloadButton").prop("disabled", true);
    $("#addDownloadButton").prop("disabled", true);
    $("#deleteDownloadButton").prop("disabled", true);
    $("#getDownloadButton").prop("disabled", true);
    $("#updateDownloadButton").prop("disabled", true);

    // $("#updateDownloadButton").prop("disabled", true);

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
    var random = Math.floor(Math.random() * downloadMessages.length);

    document.getElementById("generateMessage").innerHTML = downloadMessages[random];

    // Set the spinner
    btn.innerHTML = '<i class = "fa fa-spinner fa-spin"></i> Generating Table and APIs...';

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

    var totalRequests = 4;

    $.ajax(addsettings).done(function (response) {
        setTimeout(function () {
            totalRequests--;
            if (totalRequests == 0) {
                btn.innerHTML = '<i class = "fa fa-check"></i> Generate Table and APIs';
                document.getElementById("generateMessage").innerHTML = "";
                $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 100);
            } else {
                var random = Math.floor(Math.random() * downloadMessages.length);
                document.getElementById("generateMessage").innerHTML = downloadMessages[random];
            }

            console.log(response);
            addTransactionOutput = response;
            enableAddDownload = true;
            $('#addDownloadButton').prop('disabled', false);
            $("#tableDownloadButton").prop('disabled', false);





            $.ajax(deletesettings).done(function (response) {
                setTimeout(function () {
                    totalRequests--;
                    if (totalRequests == 0) {
                        btn.innerHTML = '<i class = "fa fa-check"></i> Generate Table and APIs';
                        document.getElementById("generateMessage").innerHTML = "";
                        $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 100);
                    } else {
                        var random = Math.floor(Math.random() * downloadMessages.length);
                        document.getElementById("generateMessage").innerHTML = downloadMessages[random];
                    }

                    console.log(response);
                    deleteTransactionOutput = response;
                    enableDeleteDownload = true;
                    $('#deleteDownloadButton').prop('disabled', false);
                    $("#tableDownloadButton").prop('disabled', false);




                    $.ajax(getsettings).done(function (response) {
                        setTimeout(function () {
                            totalRequests--;
                            if (totalRequests == 0) {
                                btn.innerHTML = '<i class = "fa fa-check"></i> Generate Table and APIs';
                                document.getElementById("generateMessage").innerHTML = "";
                                $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 100);
                            } else {
                                var random = Math.floor(Math.random() * downloadMessages.length);
                                document.getElementById("generateMessage").innerHTML = downloadMessages[random];
                            }

                            console.log(response);
                            getTransactionOutput = response;
                            enableGetDownload = true;
                            $('#getDownloadButton').prop('disabled', false);
                            $("#tableDownloadButton").prop('disabled', false);




                            $.ajax(updatesettings).done(function (response) {
                                setTimeout(function () {
                                    totalRequests--;
                                    if (totalRequests == 0) {
                                        btn.innerHTML = '<i class = "fa fa-check"></i> Generate Table and APIs';
                                        document.getElementById("generateMessage").innerHTML = "";
                                        $("html, body").animate({ scrollTop: $(document).height() - $(window).height() }, 100);
                                    } else {
                                        var random = Math.floor(Math.random() * downloadMessages.length);
                                        document.getElementById("generateMessage").innerHTML = downloadMessages[random];
                                    }

                                    console.log(response);
                                    updateTransactionOutput = response;
                                    enableUpdateDownload = true;
                                    $('#updateDownloadButton').prop('disabled', false);
                                    $("#tableDownloadButton").prop('disabled', false);
                                    document.getElementById("generateMessage").innerHTML = "";
                                    btn.innerHTML = "Generate";
                                }, 3000);
                            });



                        }, 3000);




                    });

                }, 3000);




            });
        }, 3000);


    });






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
    createTablefromClipboard('` + tableOutputString.trim() + `')`













    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tableOutputString));
    element.setAttribute('download', 'tableOutput.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}