
$(function () {
    $('#button').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/admin/report/update',
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify({ data: 'test' }),
            success: function (data) {
                console.log("data : ", data);
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