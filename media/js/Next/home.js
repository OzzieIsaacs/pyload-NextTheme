var em;
var operafix = (navigator.userAgent.toLowerCase().search("opera") >= 0);

$( document ).ready(function() {
    em = new EntryManager();
});

function labelcolor(color)
{
    if (color == 5) {
            return 'label-warning';
    } else if (color == 7) {
            return 'label-info';
    } else if (color == 12) {
            return 'label-success';
    } else if (color == 13) {
            return 'label-primary';
    } else {
            return 'label-default';
    }
}

function EntryManager(){
    var ids;
    var entries=[];
    var container;
    this.initialize = function() {
        thisObject=this;
        setInterval(function() {
        $.ajax({
            method:"post",
            url:"json/links",
            async: true,
            timeout: 30000,
            success: thisObject.update
        });
    }, 2500);

        ids = [{% for link in content %}
        {% if forloop.last %}
            {{ link.id }}
        {% else %}
         {{ link.id }},
        {% endif %}
        {% endfor %}];

        container = $('#LinksAktiv');

        this.parseFromContent();

        // this.json.startTimer();
    }
    this.parseFromContent = function (){
        $.each(ids,function(id,index){
            var entry = new LinkEntry(id);
            entry.parse();
            entries.push(entry)
        });
    }
    this.update = function (data){
        try{
            ids = entries.map(function(item){
                return item.fid;
                });
            var dataids = data.links.map(function(item){
                return item.fid;
                });

            var temp=ids.filter(function(id){
                if($.inArray(id,data)>-1)
                    return false;
                else
                    return true;
            },dataids);
            $.each(temp,function(id){
                var elementid=Number(String(this));
                var index = ids.indexOf(elementid);
                entries[index].remove();
                entries = entries.filter(function(item){return item.fid != elementid},id);
                ids.splice( $.inArray(elementid, ids), 1 );
                //ids.splice(index,1);
                // ids = ids.erase(id);
             });

            $.each(data.links,function(i,link){
                var index= $.inArray(link.fid,ids);
                if (index > -1){
                    entries[index].update(link);
                }else{
                    var entry = new LinkEntry(link.fid);
                    entry.insert(link);
                    entries.push(entry);
                    ids.push(link.fid);
                    container[0].appendChild(entry.elements.tr);
                    container[0].appendChild(entry.elements.pgbTr);
                    $(entry.fade).css('opacity','1');
                    $(entry.fadeBar).css('opacity','1');

                }
            });
        }catch(e){
            alert(e)
        }
    }
    // initialize object
    this.initialize();
}


function LinkEntry(id){
    // Private variables
    /*var fid;
    var elements;*/

    this.initialize = function(id){
        this.fid = id;
        this.id = id;

        // this.id = id;
    }

    this.parse = function(){
        this.elements = {
            tr: $("#link_"+this.id),
            name: $("#link_"+this.id+"_name"),//.substitute({id: this.id})),
            status: $("#link_"+this.id+"_status"),//.substitute({id: this.id})),
            info: $("#link_"+this.id+"_info"),//.substitute({id: this.id})),
            bleft: $("#link_"+this.id+"_bleft"),//.substitute({id: this.id})),
            percent: $("#link_"+this.id+"_percent"),//.substitute({id: this.id})),
            remove: $("#link_"+this.id+"_remove"),//.substitute({id: this.id})),
            pgbTr: $("#link_"+this.id+"_pgb_tr"),//.substitute({id: this.id})),
            pgb: $("#link_"+this.id+"_pgb"),//.substitute({id: this.id}))
        };
        this.initEffects();
    }
    this.insert = function(item){
        try{
            var tr = document.createElement("tr");
            $(tr).html('');
            $(tr).css('opacity',0);
            var status = document.createElement("td");
            $(status).html('&nbsp;');
            $(status).addClass('hidden-xs');
            var statusspan = document.createElement("span");
            $(statusspan).html(item.statusmsg);
            $(statusspan).addClass('label '+ labelcolor(item.status));
            var name = document.createElement("td");
            $(name).html(item.name);
            var info = document.createElement("td");
            $(info).html(item.info);
            var bleft = document.createElement("td");
            $(bleft).html(humanFileSize(item.size));
            $(bleft).addClass('hidden-xs');
            var percent = document.createElement("span");
            $(percent).html(item.percent+ '% / '+ humanFileSize(item.size-item.bleft));
            $(percent).addClass('hidden-xs');
            var remove= document.createElement("span");
            $(remove).html('');
            $(remove).addClass('glyphicon glyphicon-remove');
            $(remove).css('margin-left','3px');
            var pgbTr= document.createElement("tr");
            $(pgbTr).html('');
            $(pgbTr).css('border-top-color','#fff');
            var progress= document.createElement("div");
            $(progress).html('');
            $(progress).addClass('progressani aqua');
            $(progress).css('margin-bottom','0px');
            var pgb= document.createElement("div");
            $(progress).html('');
            $(progress).attr('role','progress');
            $(progress).addClass('progress-bar');
            $(progress).css('width',item.percent+'%');

        this.elements = {
            tr:tr,
            status:status,
            statusspan:statusspan,
            name:name,
            info:info,
            bleft:bleft,
            percent:percent,
            remove:remove,
            pgbTr:pgbTr,
            progress:progress,
            pgb:pgb
            }


        this.elements.status.appendChild(this.elements.statusspan);
        this.elements.progress.appendChild(this.elements.pgb);
        this.elements.tr.appendChild(this.elements.status);
        this.elements.tr.appendChild(this.elements.name);
        this.elements.tr.appendChild(this.elements.info);
        this.elements.tr.appendChild(this.elements.bleft);
        this.elements.tr.appendChild(this.elements.bleft);
        this.elements.tr.appendChild(this.elements.bleft);
        this.elements.tr.appendChild(this.elements.bleft);

        var child = document.createElement('td');
        child.appendChild(this.elements.percent);
        child.appendChild(this.elements.remove);

        this.elements.tr.appendChild(child);

        var secondchild = document.createElement('td');
        $(secondchild).css('colspan','5');
        secondchild.appendChild(this.elements.progress);

        this.elements.pgbTr.appendChild(secondchild);

        this.initEffects();
        }catch(e){
            alert(e);
        }
    }

    this.initEffects = function(){
        //if(!operafix)
            // this.bar = new Fx.Morph(elements.pgb, {unit: '%', duration: 5000, link: 'link', fps:30});
        // ToDo Fix
        this.fade = this.elements.tr;
        this.fadeBar = this.elements.pgbTr;

        $(this.elements.remove).click(function(){
            $.get( '/json/abort_link/'+id)});
    }
    this.update = function(item){
            $(this.elements.name).text( item.name);
            $(this.elements.statusspan).text(item.statusmsg);
            $(this.elements.info).text(item.info);
            $(this.elements.bleft).text(item.format_size);
            $(this.elements.percent).text(item.percent+ '% / '+ humanFileSize(item.size-item.bleft));
            $(this.elements.statusspan).addClass('label '+labelcolor(item.status))
            if(!operafix)
            {
                $(this.bar).css('width',item.percent);
                /*this.bar.start({
                    'width': item.percent,
                });*/
            }
            else
            {
                $(this.elements.pgb).css('height','4px');
                $(this.elements.pgb).css('width',item.percent+'%');
            }

    }
    this.remove = function(){
        $(this.fade).css('opacity','0');
        $(this.fadeBar).css('opacity','0');
        this.elements.tr.remove();
        this.elements.pgbTr.remove();
        //this.fade.start('opacity',0).chain(function(){elements.tr.dispose();}.bind(this));
        //this.fadeBar.start('opacity',0).chain(function(){elements.pgbTr.dispose();}.bind(this));
    }
    this.initialize(id);
}

