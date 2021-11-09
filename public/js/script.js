$(function () { 
    $('.btn.delete_class_cart').click(function () {
        var id = $(this).attr('id'); 
        var data = { id: id };
        $.ajax({
            method: "POST",
            url: "/cart/removecartitem",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                $('#' + id).closest('tr.delete_tr_cart').remove(); 
                document.getElementById("carttotal").textContent = response.cartDetails.cartTotal;
                document.getElementById("totalcost").textContent = "$"+ response.cartDetails.totalPrice;

            }
        });
    });
    $('.delete_class').click(function () { 
        var id = $(this).attr('id');
        var data = { id: id };
        $.ajax({
            method: "POST",
            url: "/profile/removebookmark",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) { 
                $('#' + id).closest('div.card.mt-3').remove(); 
            }
        });
    });

    $('.btn.btn-info.bookmark').click(function () {
        var id = $(this).attr('id');
        var data = { id: id };
        console.log(id);
        $.ajax({
            method: "POST",
            url: "/item/bookmarkitem",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
               // console.log(response);
             
            }
        });
    });



    $('.itemQuantity.text-center').on('change',function () {
        var id = $(this).attr('id');
        var value = $(this).val();
        var data = { itemID: id, qty: value }; 
        $.ajax({
            method: "POST",
            url: "/cart/updateqty",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {

                document.getElementById("carttotal").textContent = response.cartDetails.cartTotal;
                document.getElementById("totalcost").textContent = "$" + response.cartDetails.totalPrice;
            }
        });
    });

    $('#productList-select').on('change', function (e) {
  
        var data = { productSelected: this.options[this.selectedIndex].value };
        $.ajax({
            type: 'get',
            url: '/admin/products/getproduct',
            contentType: 'application/json',
            data: data,
            success: function (data) {
                var obj = JSON.parse(data);
                 
                $("#summary").val(obj[0].summary);
                $("#update_category_select").val(obj[0].category);
                $("#price").val(obj[0].price);
                $("#quantity").val(obj[0].quantity);
                $("#image").val(obj[0].image); 
              }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    });

    $('#update_product').on('click', function () {
        var summary = $("#summary").val();
        var price = $("#price").val();
        var quantity = $("#quantity").val();
        var image = $("#image").val();
        var productSelected = $('#productList-select option:selected').val();
        var data = { summary: summary, price: price, quantity: quantity, image: image, productSelected: productSelected };
       
        $.ajax({
            type: 'post',
            url: '/admin/products/updateproduct',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) { 
                $("#alertProductsUpdate").html(data.message);
                $("#alertProductsUpdate").addClass(data.class);
                 
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    });

    $('#delete_Product').on('click', function () {

        var productSelected = $('#productList-select option:selected').val();
        var data = {productSelected: productSelected };
       
        $.ajax({
            type: 'post',
            url: '/admin/products/deleteproduct',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (data) {
               
                 
                $("#alertProductsUpdate").html(data.message);
                $("#alertProductsUpdate").addClass(data.class);
                

            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    });

     

    $('#year-formselect').on('change', function (e) { 
        var ctx = document.getElementById("myAreaChart");
        var monthlysale = [];
        var data = { yearselected: this.options[this.selectedIndex].value };
        $.ajax({
            type: 'get',
            url: '/admin/chartupdate',
            contentType: 'application/json',
            data: data,
            success: function (data) {
                var obj = JSON.parse(data); 
                for (var i in obj) {
                    monthlysale[i] = obj[i].MonthlySale;
                    console.log(obj[i].MonthlySale , " | " , i);
                }
         myLineChart.destroy();
         myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: "Earnings",
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: monthlysale,
                }],
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        time: {
                            unit: 'date'
                        },
                        ticks: {
                            maxTicksLimit: 20
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return '$' + value;
                            }
                        }
                    }],
                },
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    titleMarginBottom: 10,
                    titleFontColor: '#6e707e',
                    titleFontSize: 14,
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    xPadding: 15,
                    yPadding: 15,
                    displayColors: false,
                    intersect: false,
                    mode: 'index',
                    caretPadding: 10,
                    callbacks: {
                        label: function (tooltipItem, chart) {
                            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                            return datasetLabel + ': $' + tooltipItem.yLabel;
                        }
                    }
                }
            }
        });
                myLineChart.reset();
                myLineChart.update();
                  
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
    });


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
                        + '<td> $' + obj[productlist].price + '</td> '
                        + '<td> ' + obj[productlist].stock_available + '</td> '
                        + '<td> ' + obj[productlist].quantity_sold + '</td> '
                        + '<td> ' + obj[productlist].avg_rating + '</td> '
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