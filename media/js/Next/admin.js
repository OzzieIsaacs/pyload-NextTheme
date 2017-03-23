{% autoescape true %}
var root;
root = this;
window.addEvent("domready", function() {
    var f, c, b, e, a, d;
    /*root.passwordDialog = new MooDialog({
        destroyOnHide: false
    });
    root.passwordDialog.setContent($("password_box"));
    $("login_password_reset").addEvent("click", function(g) {
        return root.passwordDialog.close()
    });*/
    $("login_password_button").addEvent("click", function(j) {
        var h, i, g;
        i = $("login_new_password").get("value");
        g = $("login_new_password2").get("value");
        if (i === g) {
            h = $("password_form");
            h.set("send", {
                onSuccess: function(k) {
                    return root.notify.alert("Success", {
                        className: "success"
                    })
                },
                onFailure: function(k) {
                    return root.notify.alert("Error", {
                        className: "error"
                    })
                }
            });
            h.send();
            $$('#password_box')[0].hide();
            //root.passwordDialog.close()
        } else {
            alert('{{_("Passwords did not match.")}}')
        }
        return j.stop()
    });
    d = $$(".change_password");
    for (e = 0, a = d.length; e < a; e++) {
        c = d[e];
        f = c.get("id");
        b = f.split("|")[1];
        $("user_login").set("value", b);
        /*c.addEvent("click", function(g) {
            return root.passwordDialog.open()
        })*/
    }
    $("quit-pyload").addEvent("click", function(x) {
        $("quit_button").addEvent("click", function(z) {
            return new Request.JSON({
                url: "/api/kill",
                method: "get",
                onSuccess: function() {
                    $$('#quit_box')[0].hide();
                }
            }).send();
        });
    });

    $("restart-pyload").addEvent("click", function(g) {
        $("restart_button").addEvent("click", function(j) {
            return new Request.JSON({
                url: "/api/restart",
                method: "get",
                onSuccess: function() {
                    alert("{{_('pyLoad restarted')}}");
                    $$('#restart_box')[0].hide();
                }
            }).send();
        });
    });
}); 
{% endautoescape %}