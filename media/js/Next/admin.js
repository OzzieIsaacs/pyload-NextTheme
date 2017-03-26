{% autoescape true %}
var root;
root = this;
//window.addEvent("domready", function() {
$(function() {
    var f, c, b, e, a, d;
    $("#password_box").on('click', '#login_password_button', function (j) {
    //$("#login_password_button").click(function(j) {
        var h, i, g;
        i = $("#login_new_password").value();
        g = $("#login_new_password2").value();
        if (i === g) {
            h = $("#password_form");
            h.set("send", {
                onSuccess: function() {
                    $.bootstrapPurr('{{_(""Success"")}}',{
                        offset: { amount: 10},
                        type: 'success',
                        align: 'center',
                        draggable: false
                    });
                    /*return root.notify.alert("Success", {
                        className: "success"
                    })*/
                },
                onFailure: function() {
                    $.bootstrapPurr('{{_(""Error"")}}',{
                        offset: { amount: 10},
                        type: 'danger',
                        align: 'center',
                        draggable: false
                    });
                    /*return root.notify.alert("Error", {
                        className: "error"
                    })*/
                }
            });
            h.send();
            // $$('#password_box')[0].hide();
            $('#password_box').modal('hide');
        } else {
            alert('{{_("Passwords did not match.")}}')
        }
        return j.stop()
    });
    /*d = $$(".change_password");
    for (e = 0, a = d.length; e < a; e++) {
        c = d[e];
        f = c.get("id");
        b = f.split("|")[1];
        $("#user_login").set("value", b);
    }*/
    $("#quit_box").on('click', '#quit_button', function () {
        $.get( "/api/kill", function() {
            $('#quit_box').modal('hide');
        });
    });

    $("#restart_box").on('click', '#restart_button', function () {
        $.get( "/api/restart", function() {
            alert("{{_('pyLoad restarted')}}");
            $('#restart_box').modal('hide');
        });
    });
}); 
{% endautoescape %}