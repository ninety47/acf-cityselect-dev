/* jshint esversion: 3 */
(function($) {

var citySelectWidget = null;
var userView = null;
var users = null;
var prefix = window.location.pathname;

$.createCache = function(requestFunction) {
    var cache = {};
    return function(key, callback) {
        if ( !cache[key] ) {
            cache[ key ] = $.Deferred(function(defer) {
                requestFunction(defer, key);
            }).promise();
        }
        console.log("called: ", key);
        return cache[key].done(callback);
    };
};


var getData = $.createCache(function(defer, query) {
    $.ajax({
        url: prefix + 'd/' + query,
        dataType: 'json',
        success: defer.resolve,
        error: defer.reject
    });
});

var UserView = function(viewId) {
    var self = this;
    var table = $(viewId);
    var tbody = $(table.find('tbody'));

    this.addUser = function(user) {
        tbody.append(
            '<tr data-userid="'+ user.id + '">' +
            '  <td>' + user.id + '</td>' +
            '  <td>' + user.firstname + '</td>' +
            '  <td>' + user.lastname + '</td>' +
            '  <td>' + user.country + '</td>' +
            '  <td>' + user.state + '</td>' +
            '  <td>' + user.city + '</td>' +
            '</tr>');

        var tr = $(tbody.find('tr[data-userid=' + user.id+']'));
        tr.click(function(evt) {
            var id = $(this).attr('data-userid');
            tbody.find('tr').removeClass('success');
            $(this).addClass('success');
            $.each(users, function(index, value) {
                if (id == String(value.id)) {
                    $('#user-id').attr('data-userid', value.id);
                    $('#user-Firstname').html( value.firstname );
                    $('#user-Lastname').html( value.lastname );
                    citySelectWidget.select(value);
                    return false;
                }
            });
        });
    };


    this.updateUser = function(user) {
        var row = $(tbody.find('tr[data-userid='+user.id+']'));
        row.html(
            '  <td>' + user.id + '</td>' +
            '  <td>' + user.firstname + '</td>' +
            '  <td>' + user.lastname + '</td>' +
            '  <td>' + user.country + '</td>' +
            '  <td>' + user.state + '</td>' +
            '  <td>' + user.city + '</td>');
    };

    this.selectRow = function(id) {
        tbody.find('tr').removeClass('success');
        var row = $(tbody.find('tr[data-userid=' + id +']'));
        row.addClass('success');
        row.click();
    };
};



var CitySelector = function(countrySelectId, stateSelectId, citySelectId) {

    var self = this;
    var nullOption = '0';
    var countrySelect = $(countrySelectId);
    var stateSelect = $(stateSelectId);
    var citySelect = $(citySelectId);

    var makeOption = function(value, text) {
        return '<option value="' + value + '">' + text + '</option>';
    };

   var countrySelectChangeHandler = function() {
        var target = $(this);
        if (target.val() != nullOption) {
            getData('country/' + target.val() + '/states', function(data) {
                var html;
                stateSelect.prop('disabled', 'disabled');
                stateSelect.empty();
                citySelect.prop('disabled', 'disabled');
                citySelect.empty();
                html =  makeOption(nullOption, 'Select State');
                $.each(data.data, function(index, value) {
                    html += makeOption(value.code, value.name);
                });
                stateSelect.html(html);
                stateSelect.prop('disabled', false);
            });
        } else {
            stateSelect.prop('disabled', 'disabled');
            stateSelect.empty();
            citySelect.prop('disabled', 'disabled');
            citySelect.empty();
        }
    };


    var stateSelectChangeHandler = function() {
        var target = $(this);
        if (target.val() != nullOption) {
            getData('cities/' + countrySelect.val() + '/' + target.val(), function(data) {
                var html;
                citySelect.prop('disabled', 'disabled');
                citySelect.empty();
                $.each(data.data, function(index, value) {
                    html += makeOption(value, value);
                });
                citySelect.html(html);
                citySelect.prop('disabled', false);
            });
        } else {
            citySelect.prop('disabled', 'disabled');
            citySelect.empty();
        }
    };


    this.select = function(user) {
        countrySelect.prop('disabled', 'disabled');
        stateSelect.prop('disabled', 'disabled');
        citySelect.prop('disabled', 'disabled');
        countrySelect.val(user.country);
        getData('country/' + user.country + '/states', function(data) {
            var html;
            stateSelect.empty();
            html =  makeOption(nullOption, 'Select State');
            $.each(data.data, function(index, value) {
                html += makeOption(value.code, value.name);
            });
            stateSelect.html(html);
            stateSelect.val(user.state);
        }).then(function() {
            getData('cities/' + user.country + '/' + user.state, function(data) {
                var html;
                citySelect.prop('disabled', 'disabled');
                citySelect.empty();
                $.each(data.data, function(index, value) {
                    html += makeOption(value, value);
                });
                citySelect.html(html);
                citySelect.val(user.city);
                countrySelect.prop('disabled', false);
                stateSelect.prop('disabled', false);
                citySelect.prop('disabled', false);
            });
        });
    };


    this.updateUser= function(user) {
        user.country = countrySelect.val();
        user.state = stateSelect.val();
        user.city = citySelect.val();
    };


    // Initliase the select elements
    countrySelect.prop('disabled', 'disabled');
    stateSelect.prop('disabled', 'disabled');
    citySelect.prop('disabled', 'disabled');

    getData('countries', function(data) {
        var html;
        countrySelect.prop('disabled', true);
        countrySelect.empty();
        html =  makeOption(nullOption, 'Select Country');
        $.each(data.data, function(index, value) {
            html += makeOption(value.code, value.name);
        });
        countrySelect.html(html);
        countrySelect.prop('disabled', false);
        countrySelect.change( countrySelectChangeHandler );
        stateSelect.change( stateSelectChangeHandler );
        citySelect.change( function() { console.log("Selected " + citySelect.val() + "."); } );
    });

};

$(document).ready(function() {
    citySelectWidget = new CitySelector('#acfCountrySelect', '#acfStateSelect', '#acfCitySelect');
    userView = new UserView('#usertable');
    getData('users/dump', function(data) {
        users = data.data;
        $.each(users, function(index, value) {
            userView.addUser(value);
        });
        //userView.selectRow(users[0].id);
    });

    $('#updateUserButton').click( function(evt) {
        var id = $('#user-id').attr('data-userid');
        $.each(users, function(index, value) {
            if (String(value.id) == id) {
                citySelectWidget.updateUser(value);
                userView.updateUser(value);
                return true;
            }
        });
    });
});

})(jQuery);
