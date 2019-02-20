var closeModal = document.getElementById("close");
var openModal = document.getElementById("add_mem");
var modal = document.getElementById("add_member_modal");

openModal.onclick = function () {
    modal.style.display = "block";
}
closeModal.onclick = function () {
    modal.style.display = "none";
}

$(document).ready(function () {
    $("#search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

$(document).ready(function () {
    $("#searchForLoan").on("keyup", function() {
        var valueLoan = $(this).val().toLowerCase();
        $("#myTableLoan tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(valueLoan) > -1);
        });
    });
});