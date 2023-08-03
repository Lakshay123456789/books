$(document).ready(function () {
    if (localStorage.getItem("userBook") == null) {
        storeData();

    }
    else {
        showData();
    }

    $("#myTable").DataTable();
});

function storeData() {
    $.ajax({
        type: "GET",
        dataType: "JSON",
        url: "./local.json",
        success: successFn,
        error: errorFn,
    });
}

function successFn(data) {
    const myData = JSON.stringify(data);
    localStorage.clear();
    localStorage.setItem("userBook", myData);
    //  console.log(myData);
    showData();

}
function errorFn(error) {
    console.log(error);
}
// get local data 
function getLocalData() {
    const data = localStorage.getItem("userBook");
    const parseData = JSON.parse(data);
    return parseData;
}
// set local data
function setLocalData(jsonData) {
    const myData = JSON.stringify(jsonData);
    localStorage.clear();
    localStorage.setItem("userBook", myData);
    showData();
}

//  show Data
function showData() {
    const parseData = getLocalData();
    //console.log(parseData);
    $("#tbody").empty();
    for (let i = 0; i < parseData.length; i++) {
        let bookId = $(`<td>${parseData[i].id}</td>`);
        let bookName = $(`<td >${parseData[i].name}</td>`);
        let bookImage = $(`<td></td>`);
        let imgUrl = $('<img>')
        imgUrl.attr({
            "src": `${parseData[i].url}`,
            "class": "img-fluid",
            "height": "200px",
            "width": "200px",
            "alt": "image not upload",
        });
        bookImage.append(imgUrl);
        let bookPrices = $(`<td>${parseData[i].price}</td>`);
        let bookCopies = $(`<td>${parseData[i].copies}</td>`);
        let bookDetails = $(`<td><button  class="btn btn-success" onclick='detailsButton(${parseData[i].id})' data-bs-toggle="modal" data-bs-target="#staticBackdrop1">Details</button></td>`);
        let bookEdit = $(`<td><button  class="btn btn-primary" onclick='editButton(${parseData[i].id})' data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</button></td>`);
        let bookDelete = $(`<td><button class="btn btn-danger" onclick='deleteButton(${parseData[i].id})'>Delete</button></td>`);
        let row = $("<tr></tr>");
        row.append(bookId);
        row.append(bookName);
        row.append(bookImage);
        row.append(bookPrices);
        row.append(bookCopies);
        row.append(bookDetails);
        row.append(bookEdit);
        row.append(bookDelete);
        $("#tbody").append(row);
    }

}
//  add button
$("#newbookadd").click(function(){
           $("#staticBackdropLabel").text("Add New book");
           $("#submitbtn").text("Submit");
           $("#exampleInputName").val(undefined);
           $("#exampleInputPrice").val(undefined);
           $("#exampleInputCopies").val(undefined);

});
//add  and edit
$("#submitbtn").click(function () {
    let parseData = getLocalData();
    let bookName = $("#exampleInputName").val();
    let bookPrices = $("#exampleInputPrice").val();
    let bookCopies = $("#exampleInputCopies").val();
    let bookUrl = $("#exampleInputFile").attr("src");
    let value = $("#buttonOperation").val(); // edit or add
    if (value == "") {
        if (bookName && bookCopies && bookPrices && bookUrl) {
            $("#staticBackdrop").modal('hide');
            let bookId = Number(parseData[parseData.length - 1].id);
            const bookNewObject = {
                id: `${bookId + 1}`,
                name: $("#exampleInputName").val(),
                url: $("#exampleInputFile").attr("src"),
                price: $("#exampleInputPrice").val(),
                copies: $("#exampleInputCopies").val(),
            }
            parseData.push(bookNewObject);
        }
    }
    else {
        if (bookName && bookCopies && bookPrices) {
            $("#staticBackdrop").modal('hide');
            for (let i = 0; i < parseData.length; i++) {
                if (parseData[i].id == value) {
                    parseData[i].name = bookName;
                    parseData[i].price = bookPrices;
                    parseData[i].copies = bookCopies;
                    if (bookUrl) {
                        parseData[i].url = bookUrl;
                    }
                }

            }
            $("#buttonOperation").val("");
        }
    }
    setLocalData(parseData);

});

// file  input
$('#exampleInputFile').change(function () {
    let file = $('#exampleInputFile')[0].files[0];
    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        $("#exampleInputFile").attr({
            "src": `${contents}`
        });
    };
    reader.readAsDataURL(file);
});

// delete operation
function deleteButton(bookId) {
    let text = "Are you delete this book entry";
    if (confirm(text) == true) {
        const parseData = getLocalData();
        for (let i = 0; i < parseData.length; i++) {
            if (parseData[i].id == bookId) {
                parseData.splice(i, 1);
            }

        }
        setLocalData(parseData);
    }
    else {

    }
}
// edit operation
function editButton(bookId) {
    $("#staticBackdropLabel").text("Update book record");
    $("#submitbtn").text("Save Changes");

    const value = $("#buttonOperation").val(bookId);
    
    const parseData = getLocalData();
    for (let i = 0; i < parseData.length; i++) {
        if (parseData[i].id == bookId) {
            $("#exampleInputName").val(parseData[i].name);
            $("#exampleInputPrice").val(parseData[i].price);
            $("#exampleInputCopies").val(parseData[i].copies);
        }

    }
}
function detailsButton(bookId){
    let parseData=getLocalData();
    console.log(parseData);
    console.log(bookId);
    for(let i=0;i<parseData.length;i++){
        if(parseData[i].id==bookId){
            $("#bookId").append(parseData[i].id);
            $("#bookName").append(parseData[i].name);
            $("#bookImage").attr({
                "src":`${parseData[i].url}`,
                "alt":"image not upload correct",
            });
            $("#bookPrices").append(parseData[i].price);
            $("#bookCopies").append(parseData[i].copies);
        }
    }
}