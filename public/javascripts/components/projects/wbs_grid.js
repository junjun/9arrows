/**
 * @author admin
 */

;(function($, $mo) {

$mo.namespace('components.projects.wbs_grid');

components.projects.wbs_grid = function(p_cd)
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
        this.set_signals();
        this.set_events();
    }

    panel.prototype = {
        container      : 'wbs_grid',
        store_url      : url_for('projects/' + p_cd + '/wbs.json'),
        item_url       : url_for('projects/' + p_cd + '/tasks/{:id}.json'),
        order_url      : url_for('projects/' + p_cd + '/items/{:id}/item_order_update.json'),

        messages: {
            deleted: "このセクションを削除します．\n本当によろしいですか？"
        },

        grid_list      : null, // グリッドエレメント
        selectedIndex  : -1, // 選択行インデックス
        ctxMenu        : null, // コンテキストメニュー

        create_store: function()
        {
            this.store = new Ext.i3.data.GroupJsonStore({
                root: "items",
                url: this.store_url,
                fields:[
                        {name: 'task_kbn',          mapping:'task_kbn'},
                        {name: 'task_cd',           mapping:'task_cd'},
                        {name: 'item_name',         mapping:'item_name'},
                        {name: 'user_name',         mapping:'user_name'},
                        {name: 'comp_exp_date',     mapping:'comp_exp_date'},
                        {name: 'situation',         mapping:'situation'},
                        {name: 'priority_kbn',      mapping:'priority_kbn'},
                        {name: 'progress_kbn',      mapping:'progress_kbn'},
                        {name: 'client_user_name',  mapping:'client_user_name'},
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

        create_grid: function()
        {
            var toptoolbar = this.create_toolbar();
            var colModel   = new Ext.grid.ColumnModel([
                {header: "", width: 15, sortable: false, dataIndex: 'progress_kbn', renderer: this.onProgressKbnRenderer.createDelegate(this), align:"center"},
                {header: "", width: 50, sortable: false, dataIndex: 'task_cd', align:"center"},
                {header: app_localized_message("label", "task"), sortable: false, locked:false, dataIndex: 'item_name', id:'item_name', renderer: this.onItemNameRenderer.createDelegate(this)},
                {header: app_localized_message("label", "charge_user"), width: 120, sortable: false, dataIndex: 'user_name'},
                {header: app_localized_message("label", "complete_date"), width: 100, sortable: false, dataIndex: 'comp_exp_date', align:"center"},
                {header: app_localized_message("label", "situation"), width: 100, sortable: false, dataIndex: 'situation', align:"center"},
                {header: app_localized_message("label", "client_user"), width: 120, sortable: false, dataIndex: 'client_user_name'}
            ]);

            var view = new Ext.i3.grid.GroupGridView();
            view.getRowClassExtension = this.fncGetRowClass.createDelegate(this)
            this.grid_list = new Ext.grid.GridPanel({
                el : this.container,
                ds: this.store,
                cm: colModel,
                view : view,
                autoExpandColumn: 'item_name',
                loadMask : true,
                monitorResize : true,
                region: 'center',
                margins: '0 0 0 0'
            });
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
         * 関数名：onProgressKbnRenderer
         * 概　要：進捗状況レンダラー
         * 引　数：value            Mixed                       アイテム名データ
         *       ：phash            Hash　                      セル情報
         *       ：rec              Ext.data.Record             行データオブジェクト
         *       ：rowIndex         Number                      行インデックス
         *       ：cellIndex        Number                      列インデックス
         *       ：datastore        Ext.data.JsonStore          データストアオブジェクト
         * 戻り値：セル表示内容文字列
         */
        onProgressKbnRenderer : function (value, phash, rec, rowIndex, cellIndex, datastore){
            if( rec.get('task_kbn')==1 && rec.get('progress_kbn')==3 ){
                var alttext = app_localized_message("label", "complete") ;
                return String.format('<img class="i3_extension_progress_icon" src="{0}" width="10" height="10" alt={1}>', url_for('/images/s.gif'), alttext ) ;
            }
            else{
                return '' ;
            }
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
                switch (parseInt(rec.get('task_kbn'))) {
                    case 1 :
                        var priority_kbn = parseInt(rec.get('priority_kbn'));
                        if( priority_kbn == 1 ){
                            alttext = app_localized_message("label", "wbs_icon_prefix_task_low") ;
                        }
                        else if( priority_kbn == 3 ){
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
            var prefix = String.format('<img class="i3_extension_prefix_icon" src="{0}" width="13" height="13" alt="{1}">', url_for('images/s.gif'), alttext ) ;
            return String.format('<span style="margin-left:{0}px;white-space:nowrap;overflow:hidden;">{1}&nbsp;{2}</span>', rec.get('level')*15, prefix, value ) ;
        },

        // ツールバー生成
        create_toolbar: function()
        {
            var toptoolbar = new Ext.PagingToolbar({
                pageSize: 50,
                store: this.store,
                displayInfo: true,
                displayMsg: '{2} 件中　{0} - {1} 件目',
                emptyMsg: 'データが存在しません'
            });
            return toptoolbar;
        },
        create_panel: function()
        {
            var elmmain = Ext.get(this.id + '_panel');
            this.center_panel = new Ext.Container({
                applyTo : elmmain,
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
            this.grid_list.addListener("rowclick", this.onRowClick, this, null);
            this.grid_list.addListener("rowdblclick", this.onRowDblClick, this, null);
            this.grid_list.addListener("rowcontextmenu", this.onRowContextMenu, this, null);

        },

        /*
         * 関数名：onRowClick
         * 概　要：グリッド行クリックイベントハンドラ
         * 引　数：grid             Ext.grid.Grid               グリッドオブジェクト
         *       ：rowIndex         Number                      クリック行インデックス
         *       ：grid             Ext.EventObject             イベントオブジェクト
         * 戻り値：なし
         */
        onRowClick : function(grid, rowIndex, e) {
            var view = this.grid_list.getView();
            if (view){
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
            $mo.fire('open_projects_task_edit_dialog', {comp_id: rec.get('id'), projectusers : null});
        },

        onEditMilestoneClick : function(rec){
            $mo.fire('open_projects_milestone_edit_dialog', {comp_id: rec.get('id'), projectusers : null});
        },

        onEditEventClick : function(rec){
            $mo.fire('open_projects_event_edit_dialog', {comp_id: rec.get('id'), projectusers : null});
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

        load_list: function() {
            this.store.load();
        }
    };
    
    var panel = new panel(id, p_cd);
}

$.fn.projects_wbs_grid = components.projects.wbs_grid;

})(jQuery, Motto);
