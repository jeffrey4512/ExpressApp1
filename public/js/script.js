
$(function () {
    $('input').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/admin/test',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify({ data: 'test' }),
            success: function (data) {
                console.log("Successfully saved the matched beans to the user.");
            }
        }).done(function () {
            console.log("OK");
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    });
});
$(document).ready(function () {

    var user = null;
    


    /*
    $.ajax({
        type: 'GET',
        url: '', // This one is missing here
        dataType: 'json'
    }).done(function (data) {
        user = JSON.stringify(data);
        console.log(user.name); // log here 
    });
    */
});