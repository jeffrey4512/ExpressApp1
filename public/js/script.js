
$(function () {
    $('#button').on('click', function () {
        var fromtime = $("#FromTime").val();
        var totime = $("#ToTime").val();
        var optionFilter = $("#option-filter").val(); 
        var data = { fromtime: fromtime, totime: totime, optionFilter: optionFilter };
        $.ajax({
            type: 'get',
            url: '/admin/report/update',
            contentType: 'application/json', 
            data: data,
            success: function (data) {
                var obj = JSON.parse(data); 
                $('#product').empty(); 

                for (var productlist in obj) { 
                    $('#product').append(
                        '<tr><td> ' + obj[productlist].name + '</td> '
                        + '<td> ' + obj[productlist].quantity + '</td> '
                        + '<td> ' + obj[productlist].price + '</td> '
                        + '<td> ' + obj[productlist].rating + '</td> '
                        + '<td> ' + obj[productlist].created_at + '</td> '
                        + '<td> ' + obj[productlist].updated_at + '</td></tr> '
                    );
                } 
              
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    });
}); 