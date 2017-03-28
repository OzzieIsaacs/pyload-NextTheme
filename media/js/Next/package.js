var root = this;

$(function() {
});

function indicateLoad() {
    $("#load-indicator").css('opacity',1)
}

function indicateFinish() {
    $("#load-indicator").css('opacity',0)
}

function indicateSuccess() {
    indicateFinish();
    $.bootstrapPurr('{{_("Success")}}.',{
        offset: { amount: 10},
        type: 'success',
        align: 'center',
        draggable: false
    });
}

function indicateFail() {
    indicateFinish();
    $.bootstrapPurr('{{_("Failed")}}.',{
        offset: { amount: 10},
        type: 'danger',
        align: 'center',
        draggable: false
    });
}

function PackageUI (url, type){
    var packages= [];
    var thisObject;
    this.initialize= function(url, type) {
        thisObject=this;
        this.url = url;
        this.type = type;

        $("#del_finished").click(this.deleteFinished);
        $("#restart_failed").click(this.restartFailed);
        this.parsePackages();

    }

    this.parsePackages= function() {
        $("#package-list").children("li").each(function(ele) {
            var id = this.children[0].id.match(/[0-9]+/);
            packages.push(new Package(thisObject, id, this));
        });
    }

    this.loadPackages= function() {
    }

    this.deleteFinished= function() {
        indicateLoad();
        $.get( '/api/deleteFinished', function(data) {
                if (data.length > 0) {
                window.location.reload();
                } else {
                $.each(packages,function(pack) {
                    this.close();
                    });
            }
                    indicateSuccess();
        })
            .fail(indicateFail);
                }

    this.restartFailed = function () {
        indicateLoad();
        $.get( '/api/restartFailed', function(data) {
            if (data.length > 0) {
                $.each(packages,function(pack) {
                    this.close();
                });
            }
                indicateSuccess();
        })
            .fail(indicateFail);
    }

    this.startSort= function(ele, copy) {
    }

    this.saveSort= function(ele, copy) {
        var order = [];
        this.sorts.serialize(function(li, pos) {
            if (li == ele && ele.retrieve("order") != pos) {
                order.push(ele.retrieve("pid") + "|" + pos)
            }
            li.data("order", pos)
        });
        if (order.length > 0) {
            indicateLoad();
            new Request.JSON({
                method: 'get',
                url: '/json/package_order/' + order[0],
                onSuccess: indicateFinish,
                onFailure: indicateFail
            }).send();
        }
    }
    this.initialize(url,type);
}

function Package (ui, id, ele){
    // private variables
    var linksLoaded = false;
    var thisObject;
    var order;
    var buttons;
    var name;
    var password;
    var folder;

    this.initialize= function() {
        thisObject=this;
        if (!ele) {
            this.createElement();
        } else {
            order = $(ele).find('.order').html();
            jQuery.data(ele,"order", order);
            jQuery.data(ele,"pid", id);
            this.parseElement();
        }

        var pname = $(ele).find('.packagename');

        buttons=$(ele).find('.buttons');
        buttons.css("opacity", 0);

        $(pname).mouseenter(function(e) {
            $(this).find('.buttons').fadeTo('fast', 1)
        });

        $(pname).mouseleave( function(e) {
            $(this).find('.buttons').fadeTo('fast', 0)
        });
    }

    this.createElement= function() {
        alert("create");
    }

    this.parseElement= function() {
        var imgs = $(ele).find('span');

        name = $(ele).find('.name');
        folder =  $(ele).find('.folder');
        password = $(ele).find('.password');

        $(imgs[3]).click(this.deletePackage);
        $(imgs[4]).click(this.restartPackage);
        $(imgs[5]).click(this.editPackage);
        $(imgs[6]).click(this.movePackage);

        $(ele).find('.packagename').click(this.toggle)
    }

    this.loadLinks = function() {
        indicateLoad();
        $.get( '/json/package/' + id, thisObject.createLinks)
            .fail(indicateFail);
    }

    this.createLinks= function(data) {
        var ul = $("#sort_children_" + id[0]);
        ul.html("");
        $.each(data.links, function(key, link) {      // data.links.each(
            link.id = link.fid;
            var li = document.createElement("li");
            $(li).css("margin-left",0);
            
            if (link.icon == 'arrow_right.png'){
                    link.icon = 'glyphicon glyphicon-arrow-right text-primary';
            }
            if (link.icon == 'status_downloading.png'){
                    link.icon = 'glyphicon glyphicon-cloud-download text-primary';
            }
            if (link.icon == 'status_failed.png'){
                    link.icon = 'glyphicon glyphicon-exclamation-sign text-danger';
            }
            if (link.icon == 'status_finished.png'){
                    link.icon = 'glyphicon glyphicon-ok text-success';
            }
            if (link.icon == 'status_queue.png'){
                    link.icon = 'glyphicon glyphicon-time text-info';
            }
            if (link.icon == 'status_offline.png'){
                    link.icon = 'glyphicon glyphicon-ban-circle text-danger';
            }
            if (link.icon == 'status_waiting.png'){
                    link.icon = 'glyphicon glyphicon-time text-info';
            }
            

            var html = "<span style='' class='child_status'><span style='margin-right: 2px;' class='"+link.icon+" sorthandle'></span></span>\n";
            html += "<span style='font-size: 18px; text-weight:bold'><a href='"+link.url+"'>";//.substitute({"url": link.url});
            html += link.name+"</a></span><br/><div class='child_secrow' style='background-color: #dcdcdc; margin-left: 21px; margin-bottom: 7px;'>";//.substitute({"name": link.name});
            html += "<span class='child_status' style='font-size: 12px; color:#555'>"+link.statusmsg+"</span>&nbsp;"+link.error+"&nbsp;";//.substitute({"statusmsg": link.statusmsg, "error":link.error});
            html += "<span class='child_status' style='font-size: 12px; color:#555'>"+link.format_size+"</span>";//.substitute({"format_size": link.format_size});
            html += "<span class='child_status' style='font-size: 12px; color:#555'> "+link.plugin+"</span>&nbsp;&nbsp;";//.substitute({"plugin": link.plugin});
            html += "<span class='glyphicon glyphicon-trash' title='{{_("Delete Link")}}' style='cursor: pointer;  font-size: 12px; color:#333;' ></span>&nbsp;&nbsp;";
            html += "<span class='glyphicon glyphicon-repeat' title='{{_("Restart Link")}}' style='cursor: pointer; font-size: 12px; color:#333;' ></span></div>";

            var div=document.createElement("div");
            $(div).attr("id","file_" + link.id);
            $(div).addClass("child");
            $(div).html(html);

            jQuery.data(li,"order", link.order);
            jQuery.data(li,"lid", link.id);

            li.appendChild(div);
            $(ul)[0].appendChild(li);
        });
        thisObject.registerLinkEvents();
        linksLoaded = true;
        indicateFinish();
        thisObject.toggle();
    }

    this.registerLinkEvents= function() {
        $(ele).find('.children').children('ul').children("li").each(function(child) {
            var lid = $(this).find('.child').attr('id').match(/[0-9]+/);
            var imgs = $(this).find('.child_secrow span');
            $(imgs[3]).bind('click',{ lid: lid}, function(e) {
                $.get( '/api/deleteFiles/[' + lid + "]", function() {
                    $('#file_' + lid).remove()
                })
                    .fail(indicateFail);
            });

            $(imgs[4]).bind('click',{ lid: lid},function(e) {
                $.get( '/api/restartFile/' + lid, function() {
                    var ele1 = $('#file_' + lid);
                    var imgs1 = $(ele1).find(".glyphicon");
                    $(imgs1[0]).attr( "class","glyphicon glyphicon-time text-info sorthandle");
                    var spans = $(ele1).find(".child_status");
                    $(spans[1]).html("{{_("queued")}}");
                        indicateSuccess();
                })
                    .fail(indicateFail);
            });
        });
    }

    this.toggle = function() {
        var child = $(ele).find('.children');
        if (child.css('display') == "block") {
            $(child).fadeOut();
        } else {
            if (!linksLoaded) {
                thisObject.loadLinks();
            } else {
                $(child).fadeIn();
            }
            }
        }


    this.deletePackage= function(event) {
        indicateLoad();
        $.get( '/api/deletePackages/[' + id + "]", function() {
            $(ele).remove();
                indicateFinish();
        })
            .fail(indicateFail);

        event.stopPropagation();
        event.preventDefault();
    }

    this.restartPackage= function(event) {
        indicateLoad();
        $.get( '/api/restartPackage/' + id, function() {
            thisObject.close();
                indicateSuccess();
        })
            .fail(indicateFail);
        event.stopPropagation();
        event.preventDefault();
    }

    this.close= function() {
        var child = $(ele).find('.children');
        if (child.css('display') == "block") {
            $(child).fadeOut();
        }
        var ul = $("#sort_children_"+id);
        $(ul).html("");
        linksLoaded = false;
    }

    this.movePackage= function(event) {
        indicateLoad();
        $.get( '/json/move_package/' + ((ui.type + 1) % 2) + "/" + id, function() {
            $(ele).remove();
                indicateFinish();
        })
            .fail(indicateFail);
        event.stopPropagation();
        event.preventDefault();
    }

    this.editPackage= function(event) {
        event.stopPropagation();
        event.preventDefault();
        $("#pack_form").off("submit");
        $("#pack_form").submit(thisObject.savePackage);

        $("#pack_id").val(id[0]);
        $("#pack_name").val(name.text());
        $("#pack_folder").val(folder.text());
        $("#pack_pws").val(password.text());
        $('#pack_box').modal('show');
    }

    this.savePackage= function(event) {
        $.ajax({
            url: '/json/edit_package',
            type: 'post',
            dataType: 'json',
            data: $('#pack_form').serialize()
        });
        event.preventDefault();
        name.text( $("#pack_name").val());
        folder.text( $("#pack_folder").val());
        password.text($("#pack_pws").val());
        $('#pack_box').modal('hide');
    }

    this.saveSort= function(ele, copy) {
        var order = [];
        this.sorts.serialize(function(li, pos) {
            if (li == ele && ele.retrieve("order") != pos) {
                order.push(ele.retrieve("lid") + "|" + pos)
            }
            li.data("order", pos)
        });
        if (order.length > 0) {
            indicateLoad();
            $.get( '/json/link_order/' + order[0], indicateFinish
            )
                .fail(indicateFail);
        }
    }
    this.initialize();
}

