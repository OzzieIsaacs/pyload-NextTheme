var em;
var operafix = (navigator.userAgent.toLowerCase().search("opera") >= 0);

$( document ).ready(function() {
// document.addEvent("domready", function(){
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

// var EntryManager = new Class();

function EntryManager(){
    this.initialize = function() {
        setInterval(function() {
        $.ajax({
            method:"post",
            url:"json/links",
            async: true,
            timeout: 30000,
            success: function (data){
                try{
                this.ids = this.entries.map(function(item){
                    return item.fid
                    });

                this.ids.filter(function(id){
                    return !this.ids.contains(id)
                },data).each(function(id){
                    var index = this.ids.indexOf(id);
                    this.entries[index].remove();
                    this.entries = this.entries.filter(function(item){return item.fid != this},id);
                    this.ids = this.ids.erase(id)
                    }, this);

                data.links.each(function(link, i){
                    if (this.ids.contains(link.fid)){

                        var index = this.ids.indexOf(link.fid);
                        this.entries[index].update(link)

                    }else{
                        var entry = new LinkEntry(link.fid);
                        entry.insert(link);
                        this.entries.push(entry);
                        this.ids.push(link.fid);
                        this.container.adopt(entry.elements.tr,entry.elements.pgbTr);
                        entry.fade.start('opacity', 1);
                        entry.fadeBar.start('opacity', 1);

                    }
                    }, this)

                }catch(e){
                    // alert(e)
                }
            }
        });
    }, 2500);

        /*this.json = new Request.JSON({
        url: "json/links",
                secure: false,
                async: true,
        onSuccess: this.update.bind(this),
        initialDelay: 0,
        delay: 2500,
        limit: 30000
    });*/

        this.ids = [{% for link in content %}
        {% if forloop.last %}
            {{ link.id }}
        {% else %}
         {{ link.id }},
        {% endif %}
        {% endfor %}];

        this.entries = [];
        this.container = $('#LinksAktiv');

        this.parseFromContent();

        // this.json.startTimer();
    }
    this.parseFromContent = function (){
        $.each(this.ids,function(id,index){
            var entry = new LinkEntry(id);
            entry.parse();
            this.entries.push(entry)
            }, this);
    }

    this.initialize();
}


function LinkEntry(){
    this.initialize = function(id){
        this.fid = id;
        this.id = id;
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
            $(status).addCass('hidden-xs');
            var statusspan = document.createElement("span");
            $(statusspan).html(item.statusmsg);
            $(statusspan).addCass('label '+ labelcolor(item.status));
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
            remove= document.createElement("span");
            $(remove).html('');
            $(remove).addClass('glyphicon glyphicon-remove');
            $(remove).css('margin-left','3px');
            pgbTr= document.createElement("tr");
            $(pgbTr).html('');
            $(pgbTr).css('border-top-color','#fff');
            progress= document.createElement("div");
            $(progress).html('');
            $(progress).addClass('progressani aqua');
            $(progress).css('margin-bottom','0px');
            pgb= document.createElement("div");
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
            /*tr: new Element('tr', {
            'html': '',
            'styles':{
                'opacity': 0,
            }*/
            //}),
            /*status: new Element('td', {
            'html': '&nbsp;',
            'class': 'hidden-xs'*/
            //}),
            /*statusspan: new Element('span', {
            'html': item.statusmsg,
            'class': 'label '+ labelcolor(item.status),
                    'styles':{
                    }*/
            //}),
            /*name: new Element('td', {
            'html': item.name*/
            //}),
            /*info: new Element('td', {
            'html': item.info*/
            //}),
            /*bleft: new Element('td', {
            'html': humanFileSize(item.size),
            'class': 'hidden-xs'*/
            //}),


            /*percent: new Element('span', {
            'html': item.percent+ '% / '+ humanFileSize(item.size-item.bleft),
            'class': 'hidden-xs'*/
            //}),

            /*remove: new Element('span',{
            'html': '',
            'class': 'glyphicon glyphicon-remove',
                    'styles':{
                        'margin-left': '3px',
                    }*/
            //}),

            /*pgbTr: new Element('tr', {
            'html':'',
                    'styles':{
                        'border-top-color': '#fff',
                    }*/
            //}),

            /*progress: new Element('div', {
            'html':'',
            'class':'progressani aqua',
                    'styles':{
                        'margin-bottom': '0px',
                    }*/
            //}),

            /*pgb: new Element('div', {
            'html':'',
            'class':'progress-bar',
            'role':'progress',
            'styles':{
                'width': item.percent+'%',
                // 'background-color': '#ddd'
            }*/
            //})

        //};


        this.elements.status.appendChild(this.elements.statusspan);
        this.elements.progress.appendChild(this.elements.pgb);
        this.elements.tr.appendChild(this.elements.status,this.elements.name,this.elements.info,this.elements.bleft,new Element('td').adopt(this.elements.percent,this.elements.remove));
        this.elements.pgbTr.appendChild(new Element('td',{'colspan':5}).adopt(this.elements.progress));
        this.initEffects();
        }catch(e){
            alert(e);
        }
    }
    this.initEffects = function(){
        if(!operafix)
            this.bar = new Fx.Morph(this.elements.pgb, {unit: '%', duration: 5000, link: 'link', fps:30});
        this.fade = new Fx.Tween(this.elements.tr);
        this.fadeBar = new Fx.Tween(this.elements.pgbTr);

        this.elements.remove.addEvent('click', function(){
            new Request({method: 'get', url: '/json/abort_link/'+this.id}).send();
        }.bind(this));

    }
    this.update = function(item){
            this.elements.name.text( item.name);
            this.elements.statusspan.text(item.statusmsg);
            this.elements.info.text(item.info);
            this.elements.bleft.text(item.format_size);
            this.elements.percent.text(item.percent+ '% / '+ humanFileSize(item.size-item.bleft));
            this.elements.statusspan.addClass('label '+labelcolor(item.status))
            if(!operafix)
            {

                this.bar.start({
                    'width': item.percent,
                });
            }
            else
            {
                this.elements.pgb.set(
                    'styles', {
                        'height': '4px',
                        'width': item.percent+'%',
                     });
            }

    }
    this.remove = function(){
            this.fade.start('opacity',0).chain(function(){this.elements.tr.dispose();}.bind(this));
            this.fadeBar.start('opacity',0).chain(function(){this.elements.pgbTr.dispose();}.bind(this));

    }
}

