/**
 * @author admin
 */

;(function($, $mo) {

$mo.namespace('components.projects.gantt_grid');

components.projects.gantt_grid = function(p_cd)
{
    var id = $(this).attr('id');
    if (id == '') { return this; }

    var panel = function(id, p_cd)
    {
        this.id = id;
        this.p_cd = p_cd;

        this.create_store();
        this.create_grid();
        this.create_ctxmenu();
        this.create_panel();
        this.set_events();
        this.set_signals();

    }

    panel.prototype = {
        container      : 'gantt_grid',
        store_url      : url_for('projects/' + p_cd + '/gantt.json'),
        item_url       : url_for('projects/' + p_cd + '/tasks/{:id}.json'),
        order_url      : url_for('projects/' + p_cd + '/items/{:id}/item_order_update.json'),

        messages: {
            deleted: "このセクションを削除します．\n本当によろしいですか？"
        },

        grid_list      : null, // グリッドエレメント
        selectedIndex  : -1, // 選択行インデックス
        ctxMenu        : null, // コンテキストメニュー

        selectedIndex  : -1,
        daywidth       : 20,
        days           : null,
        ganttwidth     : null,
        start_date     : null,
        end_date       : null,

        create_store: function()
        {
            this.store = new Ext.i3.data.GroupJsonStore({
                root: "items",
                fields:[
                    {name: 'task_kbn',          mapping:'task_kbn'},
                    {name: 'task_cd',           mapping:'task_cd'},
                    {name: 'item_name',         mapping:'item_name'},
                    {name: 'user_name',         mapping:'user_name'},
                    {name: 'comp_exp_date',     mapping:'comp_exp_date'},
                    {name: 'situation',         mapping:'situation'},
                    {name: 'priority_kbn',      mapping:'priority_kbn'},
                    {name: 'progress_kbn',      mapping:'progress_kbn'},
                    {name: 'start_date',        mapping:'start_date'},
                    {name: 'end_date',          mapping:'end_date'},
                    {name: 'create_user_name',  mapping:'create_user_name'},
                    {name: 'id',                mapping:'id'},
                    {name: 'isgroup',           mapping:'isgroup'},
                    {name: 'level',             mapping:'level'},
                    {name: 'class_word1',       mapping:'class_word1'},
                    {name: 'class_word2',       mapping:'class_word2'},
                    {name: 'class_word3',       mapping:'class_word3'}
                ],
                groups : [
                    {name: 'class_word1',       mapping:'item_name'},
                    {name: 'class_word2',       mapping:'item_name'},
                    {name: 'class_word3',       mapping:'item_name'}
                ],
                copyfields : [
                    {name: 'id'}
                ]
            });
        },

        onGanttCellRenderer : function(value, phash, rec, rowIndex, cellIndex, datastore){

            var id              = rec.data['id'] ;
            var start_date      = rec.data['start_date'] ;
            var end_date        = rec.data['end_date'] ;
            if( start_date == null || start_date == "" ) return "" ;
            if( end_date == null || end_date == "" ) return "" ;


            var start_dt        = Date.parseDate(start_date, "Y-m-d");
            var end_dt          = Date.parseDate(end_date, "Y-m-d");

            var adjustment      = Ext.isIE ? -0.5 : 0;

            var base_start_dt   = this.start_dt;
            var diff            = 0 ;
            var between         = 0 ;
            var before_base_flg = false;

            if( base_start_dt.getTime() <= start_dt.getTime() ){
                diff            = base_start_dt.getElapsed(start_dt) ;
                between         = start_dt.getElapsed(end_dt) ;
            }
            else{
                between         = base_start_dt.getElapsed(end_dt) ;
                before_base_flg = true;
            }

            var betweendays     = between / 1000 / 60 / 60 / 24 ;
            var barwidth        = (betweendays + 1) * (this.daywidth + adjustment) ;
            var position        = (diff / 1000 / 60 / 60 / 24) * (this.daywidth + adjustment) ;

            if (betweendays == 0) position = position + 1;

            var html = '&nbsp;';
            if( rec.data['isgroup'] ){
                if( before_base_flg ){
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="position:relative;left:'+position+'"><img src="'+url_for('images/etc/bar_gantt_center2.gif')+'" width="'+(barwidth+position-4)+'" height="12"><img src="'+url_for('images/etc/bar_gantt_right2.gif')+'" width="4" height="12"></div>' ;
                }
                else if(position+barwidth > this.ganttwidth ){
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="position:relative;left:'+position+'"><img src="'+url_for('images/etc/bar_gantt_left2.gif')+'" width="4" height="12"><img src="'+url_for('images/etc/bar_gantt_center2.gif')+'" width="'+(barwidth-(position+barwidth-this.ganttwidth)-4)+'" height="12"></div>' ;
                }
                else{
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="position:relative;left:'+position+'"><img src="'+url_for('images/etc/bar_gantt_left2.gif')+'" width="4" height="12"><img src="'+url_for('images/etc/bar_gantt_center2.gif')+'" width="'+(barwidth-8)+'" height="12"><img src="'+url_for('images/etc/bar_gantt_right2.gif')+'" width="4" height="12"></div>' ;
                }
            }
            else if( rec.data['task_kbn'] == 1 ){
                var imgid = "list_gantt_grid_bar_img_" + id ;
                var tipstext = '<span style="font-weight:bold;">' + rec.get('item_name') + '</span><br>'+start_dt.format('Y-m-d')+'～'+end_dt.format('Y-m-d')+'<br>'+rec.get('user_name')+'';
    
                if( before_base_flg ){
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="position:relative;left:'+position+'"><img id="'+imgid+'" src="'+url_for('images/etc/bar_gantt_center1.gif')+'" width="'+(barwidth+position-6)+'" height="8"><img src="'+url_for('images/etc/bar_gantt_right1.gif')+'" width="6" height="8"></div>' ;
                }
                else if(position+barwidth > this.ganttwidth ){
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="position:relative;left:'+position+'"><img src="'+url_for('images/etc/bar_gantt_left1.gif')+'" width="6" height="8"><img id="'+imgid+'" src="'+url_for('images/etc/bar_gantt_center1.gif')+'" width="'+(barwidth-(position+barwidth-this.ganttwidth)-6)+'" height="8"></div>' ;
                }
                else{
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="position:relative;left:'+position+'"><img src="'+url_for('images/etc/bar_gantt_left1.gif')+'" width="6" height="8"><img id="'+imgid+'" src="'+url_for('images/etc/bar_gantt_center1.gif')+'" width="'+(barwidth-12)+'" height="8"><img src="'+url_for('images/etc/bar_gantt_right1.gif')+'" width="6" height="8"></div>' ;
                }
            }
            else if( rec.data['task_kbn'] == 2 ){
    
                var imgid = "list_gantt_grid_bar_img_" + id ;
                var tipstext = '<span style="font-weight:bold;">'+rec.get('item_name')+'</span><br>'+start_dt.format('Y-m-d')+'';
    
                if( before_base_flg ){
                    html = '&nbsp;' ;
                }
                else if(position+barwidth > this.ganttwidth ){
                    html = '&nbsp;' ;
                }
                else{
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="padding-left:3px;position:relative;left:'+position+'"><img id="'+imgid+'" src="'+url_for('images/icon/milestone.gif')+'"></div>' ;
                }
            }
            else if( rec.data['task_kbn'] == 3 ){
    
                var imgid = "list_gantt_grid_bar_img_" + id ;
                var tipstext = '<span style="font-weight:bold;">'+rec.get('item_name')+'</span><br>'+rec.get('user_name')+'';
    
                if( before_base_flg ){
                    html = '&nbsp;' ;
                }
                else if(position+barwidth > this.ganttwidth ){
                    html = '&nbsp;' ;
                }
                else{
                    html = '<div id="list_gantt_grid_bar_'+id+'" style="padding-left:3px;position:relative;left:'+position+'"><img id="'+imgid+'" src="'+url_for('images/icon/event.gif')+'"></div>' ;
                }
            }
            return html;

        },

        create_grid: function()
        {
            var colModel   = new Ext.grid.ColumnModel([
                {header: app_localized_message("label", "wbs"), width: 200, menuDisabled: true, sortable: false, locked: true, dataIndex: 'item_name', renderer: this.onItemNameRenderer.createDelegate(this) },
                {header: '', menuDisabled: true, sortable: false, locked: true, dataIndex: 'level', id:'level', renderer: this.onGanttCellRenderer.createDelegate(this) }
            ]);

            this.view = new Ext.i3.grid.GroupGridView();
            this.view.getRowClassExtension = this.fncGetRowClass.createDelegate(this)
            this.grid_list = new Ext.grid.GridPanel({
                ds   : this.store,
                cm   : colModel,
                view : this.view,
                loadMask : true,
                monitorResize : true,
                region: 'center',
                margins: '0 0 0 0',
                stripeRows : true
            });

        },

        fncSetGroupRange : function(){
            var cur_class1 = null ;
            var cur_class2 = null ;
            var cur_class3 = null ;
            var data_count =  this.store.getCount() ;
            for( var i=0 ; i<data_count ; i++ ){
                var rec = this.store.getAt( i ) ;
                if( rec.data.isgroup ){
                    if( rec.data.level == 0 ){
                        cur_class1 = rec ;
                        cur_class2 = null ;
                        cur_class3 = null ;
                    }
                    if( rec.data.level == 1 ){
                        cur_class2 = rec ;
                        cur_class3 = null ;
                    }
                    if( rec.data.level == 2 ){
                        cur_class3 = rec ;
                    }
                }
                else {
                    if( rec.data.level == 0 ){
                        cur_class1 = null ;
                        cur_class2 = null ;
                        cur_class3 = null ;
                    }
                    if( rec.data.level == 1 ){
                        cur_class2 = null ;
                        cur_class3 = null ;
                    }
                    if( rec.data.level == 2 ){
                        cur_class3 = null ;
                    }


                    if( rec.data.start_date == null || rec.data.start_date == "" ) continue ;
                    if( rec.data.end_date == null || rec.data.end_date == "" ) continue ;
                
                    var start_dt    = Date.parseDate(rec.data.start_date, "Y-m-d") ;
                    var end_dt      = Date.parseDate(rec.data.end_date, "Y-m-d") ;
                    
                    
                    if( cur_class1 != null ){
                        if( cur_class1.data.start_date == null ){
                            cur_class1.set('start_date', start_dt.format('Y-m-d') ) ;
                        }
                        else if( Date.parseDate(cur_class1.data.start_date, "Y-m-d").getTime() > start_dt.getTime() ){
                            cur_class1.set('start_date', start_dt.format('Y-m-d') ) ;
                        }
                        if( cur_class1.data.end_date == null ){
                            cur_class1.set('end_date', end_dt.format('Y-m-d') ) ;
                        }
                        else if( Date.parseDate(cur_class1.data.end_date, "Y-m-d").getTime() < end_dt.getTime() ){
                            cur_class1.set('end_date', end_dt.format('Y-m-d') ) ;
                        }
                    }
                    if( cur_class2 != null ){
                        if( cur_class2.data.start_date == null ){
                            cur_class2.set('start_date', start_dt.format('Y-m-d') ) ;
                        }
                        else if( Date.parseDate(cur_class2.data.start_date, "Y-m-d").getTime() > start_dt.getTime() ){
                            cur_class2.set('start_date', start_dt.format('Y-m-d') ) ;
                        }
                        if( cur_class2.data.end_date == null ){
                            cur_class2.set('end_date', end_dt.format('Y-m-d') ) ;
                        }
                        else if( Date.parseDate(cur_class2.data.end_date, "Y-m-d").getTime() < end_dt.getTime() ){
                            cur_class2.set('end_date', end_dt.format('Y-m-d') ) ;
                        }
                    }
                    if( cur_class3 != null ){
                        if( cur_class3.data.start_date == null ){
                            cur_class3.set('start_date', start_dt.format('Y-m-d') ) ;
                        }
                        else if( Date.parseDate(cur_class3.data.start_date, "Y-m-d").getTime() > start_dt.getTime() ){
                            cur_class3.set('start_date', start_dt.format('Y-m-d') ) ;
                        }
                        if( cur_class3.data.end_date == null ){
                            cur_class3.set('end_date', end_dt.format('Y-m-d') ) ;
                        }
                        else if( Date.parseDate(cur_class3.data.end_date, "Y-m-d").getTime() < end_dt.getTime() ){
                            cur_class3.set('end_date', end_dt.format('Y-m-d') ) ;
                        }
                    }
                }
            }
        },

        fncGetRowClass : function( rec, rowIndex ){
            var task_kbn = parseInt(rec.get('task_kbn'));
            var cssclass = "" ;
            
            switch (task_kbn) {
                case 1 :
                    cssclass += " i3_extension_row_task" ;
                    var priority_kbn = parseInt(rec.get('priority_kbn'));
                    if( priority_kbn == 1 ) cssclass += "_low" ;
                    if( priority_kbn == 2 ) cssclass += "_normal" ;
                    if( priority_kbn == 3 ) cssclass += "_high" ;
                    var progress_kbn = parseInt(rec.get('progress_kbn'));
                    if( progress_kbn == 3 ) cssclass += "_complete i3_extension_row_complete" ;
                    break ;
                case 2 :
                    cssclass += " i3_extension_row_milestone" ;
                    break ;
                case 3 :
                    cssclass += " i3_extension_row_event" ;
                    break ;
                default :
                    break ;
            }
            
            return cssclass ;
        },

        /*
         * 関数名：onItemNameRenderer
         * 概　要：アイテム名レンダラー
         * 引　数：value            Mixed                       アイテム名データ
         *       ：phash            Hash　                      セル情報
         *       ：rec              Ext.data.Record             行データオブジェクト
         *       ：rowIndex         Number                      行インデックス
         *       ：cellIndex        Number                      列インデックス
         *       ：datastore        Ext.data.JsonStore          データストアオブジェクト
         * 戻り値：セル表示内容文字列
         */
        onItemNameRenderer : function(value, phash, rec, rowIndex, cellIndex, datastore){
            var alttext = "" ;
            if( rec.get('isgroup') ){
                alttext = app_localized_message("label", "wbs_icon_prefix_class") ;
            }
            else{
                switch(parseInt(rec.get('task_kbn'))){
                    case 1 :
                        if(parseInt(rec.get('priority_kbn')) == 1 ){
                            alttext = app_localized_message("label", "wbs_icon_prefix_task_low") ;
                        }
                        else if(parseInt(rec.get('priority_kbn')) == 3 ){
                            alttext = app_localized_message("label", "wbs_icon_prefix_task_high") ;
                        }
                        else{
                            alttext = app_localized_message("label", "wbs_icon_prefix_task") ;
                        }
                        break ;
                    case 2 :
                        alttext = app_localized_message("label", "wbs_icon_prefix_milestone") ;
                        break ;
                    case 3 :
                        alttext = app_localized_message("label", "wbs_icon_prefix_event") ;
                        break ;
                }
            }

            var prefix = '<img class="i3_extension_prefix_icon" src="'+url_for('images/s.gif')+'" width="13" height="13" alt="'+alttext+'">';
            var view   = '<span style="margin-left:' + parseInt(rec.get('level'))*15 + 'px;white-space:nowrap;overflow:hidden;">' + prefix + '&nbsp;' + value + '</span>';
            return view;
        },

        create_panel: function()
        {
            this.center_panel = new Ext.Container({
                applyTo : this.container + '_panel',
                layout : 'border',
                monitorResize : true,
                border : true,
                items: [
                    this.grid_list
                ]



            });
        },
        create_ctxmenu: function(){
            //-----------------------------
            // コンテキストメニュー生成
            //-----------------------------
            this.ctxMenu = new Ext.menu.Menu({id: this.grid_list.id + "-hctx"});
            this.ctxMenu.add(
                {id:"upitem", text: "上へ", cls: "grid-ctx-menu-up"},
                {id:"downitem", text: "下へ", cls: "grid-ctx-menu-down"}
            );
            this.ctxMenu.on("itemclick", this.onCtxMenuClick, this);
        },

        onCtxMenuClick : function(baseItem, e){
            switch( baseItem.id ){
                case 'upitem' :
                    this.onListUpItem() ;
                    break ;
                case 'downitem' :
                    this.onListDownItem() ;
                    break ;
            }
        },

        onListUpItem : function(){
            this.fncSetOrder(-1) ;
        },
        onListDownItem : function(){
            this.fncSetOrder(1) ;
        },
        fncSetOrder : function(offset){
            var selmdl = this.grid_list.getSelectionModel();
            var selrec = selmdl.getSelected();
            if (selrec) {
                id = selrec.get('id');
            } else {
                return false;
            }

            var url = this.order_url.replace('{:id}', id);
            var opt = {
                url: url,
                params: {offset : offset},
                success: this.onSetOrderSuccess,
                failure: this.onSetOrderFail,
                scope: this,
                method: 'put'
            }
            Ext.Ajax.request(opt);
        },
        onSetOrderSuccess: function(r) {
            var r = $mo.decode(r.responseText);
            var success = r.success ;
            var message = r.message ;
            var resultobj = r.result ;
            if (success){
                this.load_list();
            } else {
                alert(message);
            }
        },
        onSetOrderFail: function(r) {
            var message = $mo.decode(r.responseText).message;
            alert(message);
        },

        set_events: function() {
            this.grid_list.addListener( "rowclick", this.onRowClick, this, null ) ;
            this.grid_list.addListener( "rowdblclick", this.onRowDblClick, this, null ) ;
            this.grid_list.addListener( "rowcontextmenu", this.onRowContextMenu, this, null ) ;

        },

        /*
         * 関数名：onRowClick
         * 概　要：グリッド行クリックイベントハンドラ
         * 引　数：grid             Ext.grid.Grid               グリッドオブジェクト
         *       ：rowIndex         Number                      クリック行インデックス
         *       ：grid             Ext.EventObject             イベントオブジェクト
         * 戻り値：なし
         */
        onRowClick : function(grid, rowIndex, e){
            var view = this.grid_list.getView();
            if (view && view.expandGroup){
                view.expandGroup(rowIndex);
            }
        },

        /*
         * 関数名：onRowDblClick
         * 概　要：グリッド行ダブルクリックイベントハンドラ
         * 引　数：grid             Ext.grid.Grid               グリッドオブジェクト
         *       ：rowIndex         Number                      ダブルクリック行インデックス
         *       ：grid             Ext.EventObject             イベントオブジェクト
         * 戻り値：なし
         */
        onRowDblClick : function(grid, rowIndex, e){
            this.selectedIndex = rowIndex ;
            var rec = grid.store.getAt(rowIndex) ;
            if(rec.get('isgroup'))  return false ;

            var task_kbn = rec.get('task_kbn');
            if( task_kbn != null ){
                switch( Number(task_kbn) ){
                    case 1 :
                        this.onEditTaskClick(rec) ;
                        break ;
                    case 2 :
                        this.onEditMilestoneClick(rec) ;
                        break ;
                    case 3 :
                        this.onEditEventClick(rec) ;
                        break ;
                    default :
                        break ;
                }
            }
        },

        onEditTaskClick : function(rec){
            $mo.fire('open_projects_task_edit_dialog', {comp_id: rec.get('id')});
        },

        onEditMilestoneClick : function(rec){
            $mo.fire('open_projects_milestone_edit_dialog', {comp_id: rec.get('id')});
        },

        onEditEventClick : function(rec){
            $mo.fire('open_projects_event_edit_dialog', {comp_id: rec.get('id')});
        },

        onRowContextMenu : function(grid, rowIndex, e ){
            this.selectedIndex = rowIndex ;
            var rec = grid.store.getAt(rowIndex) ;
            if(rec.get('isgroup'))  return false ;

            e.stopEvent();

            var row = e.getTarget() ;
            var pos = e.getXY() ;
            this.ctxMenu.showAt(pos) ;
        },

        set_signals: function() {
            $mo.connect('load', this.load_list, this);
            // task
            $mo.connect('saved_projects_task_edit_dialog', this.load_list, this);
            $mo.connect('deleted_projects_task_edit_dialog', this.load_list, this);
            //milestone
            $mo.connect('saved_projects_milestone_edit_dialog', this.load_list, this);
            $mo.connect('deleted_projects_milestone_edit_dialog', this.load_list, this);
            //event
            $mo.connect('saved_projects_event_edit_dialog', this.load_list, this);
            $mo.connect('deleted_projects_event_edit_dialog', this.load_list, this);
        },

        load_data: function() {
            url = this.store_url;
            var opt = {
                url: url,
                success: this.onLoadSuccess,
                failure: this.onLoadFailure,
                method: 'get',
                scope: this
            }
            Ext.Ajax.request(opt);
        },

        onLoadSuccess: function(r) {
            var r = $mo.decode(r.responseText);
            var success = r.success ;
            var message = r.message ;
            var resultobj = r.result ;
            if (success){
                this.onChangeProject(resultobj.project) ;
                this.store.loadData( {items: resultobj.items} ) ;
                this.fncSetGroupRange() ;
                this.view = this.grid_list.getView();
                this.view.refresh();
            } else {
                alert(message);
            }
        },
        onLoadFailure: function(r) {
            var message = $mo.decode(r.responseText).message;
            alert(message);
        },

        load_list: function() {
            this.load_data();

        },

        fncDestroyRow: function(id) {
            if (id != '' && confirm(this.messages.deleted)) {
                var url = this.item_url.replace('{:id}', id);
                var opt = {
                    url: url,
                    success: this.onDestroyRowSuccess,
                    failure: this.onDestroyRowDestroy,
                    method: 'delete',
                    scope: this
                };
                Ext.Ajax.request(opt);
            }
        },
        onDestroyRowSuccess: function(r) {
            $mo.fire('deleted_projects_gantt_form_dialog');
        },
        onDestroyRowDestroy: function(r) {
            alert(r);
        },

        onChangeProject : function(project){

            var project = project.dat_project;
            var start_date      = project.start_date;
            var end_date        = project.delivery_date;
            
            if ( start_date && end_date) {
    
                // 開始月の先頭日から描画
                var start_date = Date.parseDate(start_date, "Y-m-d");
                var start_dt   = new Date(start_date.getFullYear(), start_date.getMonth(), 1);
    
                // 終了月の最終日まで描画
                var end_date = Date.parseDate(end_date, "Y-m-d");
                var end_dt   = new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDaysInMonth());
    
                // チャート幅算出
                var between         = start_dt.getElapsed(end_dt) ;
                var betweendays     = between / 1000 / 60 / 60 / 24 ;
                var ganttwidth      = (betweendays+1) * this.daywidth;
    
                // チャートヘッダ生成
    
                var header = '' ;
                var header_row1 = "" ;
                var header_row2 = "" ;
                var day_dt = start_dt.clone() ;
                var cur_month = "" + start_dt.format('m') ;
                var next_month = "" + start_dt.format('m') ;
                var cur_year = "" + start_dt.format('Y') ;
                var next_year = "" + start_dt.format('Y') ;
                var today_year = (new Date()).format('Y') ;
                var day_col_count = 0 ;
                var end_dt_value = Number(end_dt.format('Ymd'))
                while( Number(day_dt.format('Ymd')) <= end_dt_value ){
                    if( cur_month != next_month ){
                        var year = today_year != cur_year ? cur_year + app_localized_message("label", "year") : "" ;
                        header_row1 += '<td style="padding:2px 4px 1px 4px;border-bottom:1px solid #cccccc;border-right:1px solid #cccccc;" colspan="'+ day_col_count +'">' + year + cur_month + app_localized_message("label", "month") + '</td>' ;
                        cur_month = next_month ;
                        cur_year = next_year ;
                        day_col_count = 0 ;
                    }
                    var daytext = "" ;
                    var border = "" ;
                    var width = this.daywidth ;
                    if( day_dt.getDay() == 1 || day_dt.getDate() == 1 ){
                        daytext = day_dt.format('d') ;
                    }
                    else{
                        daytext = '&nbsp;'
                    }
                    if(day_dt.getDate() == day_dt.getLastDateOfMonth().getDate() ){
                        border = "border-right:1px solid #cccccc;" ;
                        width  = width - 1 ;
                    }
    
                    var _gantt_days_id = day_dt.format('Ymd');
                    header_row2 += '<td id="ganttdays_'+_gantt_days_id+'" style="padding-top:2px; text-align:center; width:' + width + 'px;'+border+';font-size:10px;">'+ daytext +'</td>' ;
                    day_col_count++ ;
                    day_dt = day_dt.add('d', 1) ;
                    next_month = "" + day_dt.format('m') ;
                    next_year = "" + day_dt.format('Y') ;
                }
                var year = today_year != cur_year ? cur_year + app_localized_message("label", "year") : "" ;
                header_row1 += '<td style="padding:2px 4px 1px 4px;border-bottom:1px solid #cccccc;border-right:1px solid #cccccc;" colspan="'+ day_col_count +'">' + year + cur_month + app_localized_message("label", "month") + '</td>' ;
                header += '<table cellspacing="0" cellpadding="0" height="100%"><tr>' + header_row1 + '</tr><tr>' + header_row2 + '</tr></table>' ;
    
                // チャートカラム情報設定
                var cm = this.grid_list.getColumnModel() ;
    
                cm.setColumnHeader( 1, header ) ;
                cm.setColumnWidth( 1, ganttwidth ) ;

                this.start_date = start_date;
                this.end_date = end_date;
                this.betweebdays = betweendays;
                this.ganttwidth = ganttwidth;
                this.start_dt = start_dt;
                this.end_dt = end_dt;

                this.grid_list.getView().layout() ;
            }

        }


    };
    
    this.panel = new panel(id, p_cd);
    return this.panel;
}

$.fn.projects_gantt_grid = components.projects.gantt_grid;

})(jQuery, Motto);
