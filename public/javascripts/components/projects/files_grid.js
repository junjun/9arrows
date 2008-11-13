/**
 * @author admin
 */

;(function($, $mo) {

$mo.namespace('components.projects.files_grid');

components.projects.files_grid = function(p_cd, p_name)
{
    var id = $(this).attr('id');
    if (id == '') { return this; }

    var panel = function(id, p_cd, p_name)
    {
        this.id     = id;
        this.p_cd   = p_cd;
        this.p_name = p_name;

        this.fncCreateFolderTree() ;
        this.fncCreateFileList() ;
        this.fncCreateLeftLayout() ;
        this.fncCreateCenterLayout() ;
        this.set_signals();
    }

    panel.prototype = {
        container      : 'files_grid',
        store_url_fo   : url_for('projects/' + p_cd + '/folders.json'),
        store_url_fi   : url_for('projects/' + p_cd + '/files.json'),
        item_url_fi    : url_for('projects/' + p_cd + '/files/{:id}.json'),

        messages: {
            deleted: app_localized_message("confirm", "delete_confirm")
        },

        tree_folder      : null,
        tree_root        : null,
    
        ds_list          : null,
        grid_list        : null,
        ctxMenu          : null,
        ctxMenu_difolt   : null,
        ctxMenu_file     : null,
        password         : null,
        check_pass_win   : null,
        check_pass_flg   : null,
        locked_flg       : true,
    
        left_panel       : null,
        center_panel     : null,

        current_node     :"/",

        set_signals: function() {
            $mo.connect('load', this.load_list, this);
            // folder
            $mo.connect('saved_projects_folder_edit_dialog', this.load_list, this);
            $mo.connect('deleted_projects_folder_edit_dialog', this.load_list, this);
            // file
            $mo.connect('saved_projects_file_edit_dialog', this.load_list, this);
            $mo.connect('deleted_projects_file_edit_dialog', this.load_list, this);
        },

        load_list: function() {
            this.load_data();

            var folder_tree = this.tree_folder;
            if (this.current_node) {
                var folder = folder_tree.getNodeById(this.current_node);
                folder.select();
            } else {
                this.tree_root.select() ;
            }

            var selmdl = this.tree_folder.getSelectionModel() ;
            var selnode = selmdl.getSelectedNode() ;
            selnode.loaded = false ;
            selnode.expand() ;

        },

        load_data: function(){
            var o = {
                url: this.store_url_fi,
                method: 'get',
                params: {
                    node:this.current_node
                },
                success: this.loaded_list,
                scope: this
            }
            Ext.Ajax.request(o);
        },

        loaded_list: function(r) {
            var r = Ext.decode(r.responseText);
            this.ds_list.loadData({items : r});
        },

        /*==================================================
         * 関数名：fncCreateFolderTree
         * 概　要：フォルダツリーを生成する
         * 引　数：なし
         * 戻り値：なし
         ==================================================*/
        fncCreateFolderTree : function(){
            //-----------------------------
            // ツリー生成
            //-----------------------------
            this.tree_loader = new Ext.tree.TreeLoader({
                dataUrl       : this.store_url_fo,
                requestMethod : 'get'
            });
            this.tree_folder = new Ext.tree.TreePanel({
                autoScroll : true,
                animate : false,
                monitorResize : true ,
                region: 'center',
                margins: '0 0 0 0',
                border : false,
                loader: this.tree_loader
            });
            // set the root node
            this.tree_root = new Ext.tree.AsyncTreeNode({
                text: this.p_name,
                draggable:false,
                id: "/"
            });
            this.tree_folder.setRootNode(this.tree_root);
            this.tree_root.expand();
            this.tree_root.select() ;

            this.tree_folder.addListener( "click", this.onNodeClick, this, null ) ;

            // グリッド右クリックイベント
            this.tree_folder.on( "contextmenu", this.onRowContextMenu, this ) ;

            //-----------------------------
            // コンテキストメニュー生成
            //-----------------------------
            this.ctxMenu = new Ext.menu.Menu({id: this.tree_folder.id + "-hctx"});
            this.ctxMenu.add(
                {id:"row_folder_edit", text: "名前の変更", cls: "grid-ctx-menu-edit"},
                {id:"row_folder_delete", text: "削除", cls: "grid-ctx-menu-delete"}
            );
            this.ctxMenu.on("itemclick", this.onCtxMenuClick, this);

            //-----------------------------
            // ディフォルトコンテキストメニュー生成
            //-----------------------------
            this.ctxMenu_difolt = new Ext.menu.Menu({id: this.tree_folder.id + "-hctx2"});
            this.ctxMenu_difolt.add(
                {id:"rownew", text: app_localized_message("label", "newfolder"), cls: "grid-ctx-menu-new"}
            );
            this.ctxMenu_difolt.on("itemclick", this.onCtxMenuClick, this);

            this.tree_loader.addListener( 'beforeload', this.onTreeBeforeLoad, this, null ) ;
        },

        /*==================================================
         * 関数名：onNodeClick
         * 概　要：フォルダツリーノードクリックイベントハンドラ
         * 引　数： node            Ext.tree.TreeNode        ツリーノードオブジェクト
         *             e                Ext.EventObject             イベントオブジェクト
         * 戻り値：なし
         ==================================================*/
        onNodeClick : function( node,  e){
            this.current_node = node.id ;
            this.load_data() ;
        },

        /*==================================================
         * 関数名：onRowContextMenu
         * 概　要：グリッドコンテキストメニュー（右クリック）イベントハンドラ
         * 引　数：grid              Ext.grid.Grid                  グリッドオブジェクト
         *       ：rowIndex          Number                         クリック行インデックス
         *       ：e                 Ext.EventObject                イベントオブジェクト
         * 戻り値：なし
         ==================================================*/
        onRowContextMenu : function(node, e ){
            e.stopEvent();
            node.select();
            var pos = e.getXY() ;
            if (node.id == '/') {
                return false;
            } else {
                this.ctxMenu.showAt(pos) ;
            }
        },

        /*==================================================
         * 関数名：onCtxMenuClick
         * 概　要：コンテキストメニュークリックイベントハンドラ
         * 引　数：baseItem          Ext.menu.BaseItem              クリックされたアイテムオブジェクト
         *       ：e                 Ext.EventObject                イベントオブジェクト
         * 戻り値：なし
         ==================================================*/
        onCtxMenuClick : function(baseItem, e){
            switch( baseItem.id ){
                case 'row_folder_edit'     : this.fncInsideFolderEdit(); break ;// フォルダ名編集
                case 'row_folder_delete'   : this.fncGetInsideIdToDestroy(); break ;// 削除
            }
        },

        /*==================================================
         * 関数名：onTreeBeforeLoad
         * 概　要：フォルダツリーロード前イベントハンドラ
         * 引　数： treeloader     Ext.tree.TreeLoader     ツリーローダーオブジェクト
         *             node            Ext.tree.TreeNode        ツリーノードオブジェクト
         *             e                Ext.EventObject             イベントオブジェクト
         * 戻り値：なし
         ==================================================*/
        onTreeBeforeLoad : function( treeloader, node, callback  ){
            treeloader.baseParams.file_folder_id = node.attributes.id;
        },

        //submenuリスト用
        fncInsideFolderEdit : function(){
            var selmdl = this.tree_folder.getSelectionModel() ;
            var selnode = selmdl.getSelectedNode() ;
            var id = selnode.id ;
            id = id.slice(0, -1);
            var fname = selnode.text ;
            this.fncDoEditFolder(id, fname);
        },

        fncGetInsideIdToDestroy : function(){
            var selmdl = this.tree_folder.getSelectionModel() ;
            var selnode = selmdl.getSelectedNode() ;
            var id = selnode.id;
            id = id.slice(0, -1);

            this.fncDestroyFile(id);
        },

        /*==================================================
         * 関数名：fncCreateFileList
         * 概　要：ファイルリストを生成する
         * 引　数：なし
         * 戻り値：なし
         ==================================================*/
        fncCreateFileList : function(){
            //-----------------------------
            // グリッドデータストア生成
            //-----------------------------
            this.ds_list = new Ext.data.JsonStore({
                root: "items",
                fields:[
                        {name: 'id',                    mapping:'id'},
                        {name: 'ftype',                 mapping:'ftype'},
                        {name: 'fname',                 mapping:'fname'},
                        {name: 'size',                  mapping:'size'},
                        {name: 'mtime',                 mapping:'mtime'},
                        {name: 'mode',                  mapping:'mode'}
                ]
            });

            //-----------------------------
            // カラムモデル生成
            //-----------------------------
            var colModel = new Ext.grid.ColumnModel([
                {header: app_localized_message("label", "fname"), width: 200, locked:false, sortable: true, dataIndex: 'fname', id:'fname', renderer: this.onFnameRenderer.createDelegate(this)},
                {header: app_localized_message("label", "size"), width: 100, locked:false, sortable: true, dataIndex: 'size', renderer: this.onNumberRenderer.createDelegate(this) },
                {header: app_localized_message("label", "mtime"), width: 130, locked:false, sortable: true, dataIndex: 'mtime', renderer: this.onDateRenderer.createDelegate(this)}
            ]);

            //-----------------------------
            // グリッド生成
            //-----------------------------
            this.grid_list = new Ext.grid.GridPanel({
                el : 'file_index_file',
                ds: this.ds_list,
                cm: colModel,
                autoExpandColumn: 'fname',
                loadMask : true,
                monitorResize : true ,
                region: 'center',
                border : false,
                margins: '0 0 0 0'
            });
            this.grid_list.addListener( "rowcontextmenu", this.onGridRowContextMenu, this, null ) ;
            this.grid_list.addListener( "contextmenu", this.onGridContextMenu, this, null ) ;
            this.grid_list.addListener( "dblclick", this.onGridDbclick, this, null ) ;

            // コンテキストメニュー生成
            this._createCenterContextMenu();

        },

        /*==================================================
         * 関数名：onFnameRenderer
         * 概　要：ファイル名レンダラー
         * 引　数：value            Mixed                       アイテム名データ
         *       ：phash            Hash　                      セル情報
         *       ：rec              Ext.data.Record             行データオブジェクト
         *       ：rowIndex         Number                      行インデックス
         *       ：cellIndex        Number                      列インデックス
         *       ：datastore        Ext.data.JsonStore          データストアオブジェクト
         * 戻り値：なし
         ==================================================*/
        onFnameRenderer : function(value, phash, rec, rowIndex, cellIndex, datastore){
            var image ="" ;
            var ftype = rec.get("ftype");
            if( ftype == "directory"){
                image = '<img src="' + url_for("images/icon/folder.gif") + '" class="x-tree-node-icon" align="absmiddle">&nbsp;' ;
            }
            else{
                image = '<img src="' + url_for("images/icon/leaf.gif") + '" class="x-tree-node-icon" align="absmiddle">&nbsp;' ;
            }
            
            return image + value ;
        },

        /*==================================================
         * 関数名：onNumberRenderer
         * 概　要：数値レンダラー
         * 引　数：value            Mixed                       アイテム名データ
         *       ：phash            Hash　                      セル情報
         *       ：rec              Ext.data.Record             行データオブジェクト
         *       ：rowIndex         Number                      行インデックス
         *       ：cellIndex        Number                      列インデックス
         *       ：datastore        Ext.data.JsonStore          データストアオブジェクト
         * 戻り値：なし
         ==================================================*/
        onNumberRenderer : function(value, phash, rec, rowIndex, cellIndex, datastore){
            var ret = money_format(value) ;
            return ret ;
        },

        /*==================================================
         * 関数名：onDateRenderer
         * 概　要：日付レンダラー
         * 引　数：value            Mixed                       アイテム名データ
         *       ：phash            Hash　                      セル情報
         *       ：rec              Ext.data.Record             行データオブジェクト
         *       ：rowIndex         Number                      行インデックス
         *       ：cellIndex        Number                      列インデックス
         *       ：datastore        Ext.data.JsonStore          データストアオブジェクト
         * 戻り値：なし
         ==================================================*/
        onDateRenderer : function(value, phash, rec, rowIndex, cellIndex, datastore){
            var ret = onDateChange(value) ;
            return ret ;
        },

        /** onGridRowContextMenu
         * フォルダ，ファイルの一覧のアイテムの右クリックメニュー
         * 
         * @param Ext.grid.ColumnModel grid
         * @param Int rowIndex
         * @param Ext.EventObject e
         */
        onGridRowContextMenu : function(grid, rowIndex, e )
        {
            var rec = this.ds_list.getAt(rowIndex) ;
            if(rec.get('id') == 0 )  return false ;

            e.stopEvent();
            var row = e.getTarget() ;
            var pos = e.getXY() ;

            this.onGridRowContextMenu_select(rec, rowIndex, e);

            var ftype = rec.get("ftype");
            if( ftype == "directory"){
                this.ctxMenu_folder.showAt(pos);// フォルダコンテキストメニューを開く
            } else {
                this.ctxMenu_file.showAt(pos);// ファイルコンテキストメニューを開く
            }
        },

        /** onGridContextMenu
         * 何もないところを右クリックされたときの動作
         */
        onGridContextMenu : function(e) {
            e.stopEvent();
            var pos = e.getXY();
            this.ctxMenu_none.showAt(pos);// デフォルトコンテキストメニューを開く
        },

        onGridDbclick : function(){
            var selmodel = this.grid_list.getSelectionModel() ;
            var selrec = selmodel.getSelected() ;
            if (!selrec) return;
            var id = selrec.get('id');

            var ftype = selrec.get("ftype");
            if( ftype == "directory"){
                // フォルダに入る
                this.current_node = id + '/' ;

                var selnode = this.tree_folder.getNodeById(this.current_node) ;
                selnode.loaded = false ;
                selnode.expand() ;
                selnode.select() ;

                this.load_data() ;

            } else {
                // ファイルをダウンロード
                this.fncDownloadFile();
            }

        },

        /**
         * コンテキストメニュー生成
         */
        _createCenterContextMenu : function()
        {
            // フォルダ用
            this.ctxMenu_folder = new Ext.menu.Menu({id: this.tree_folder.id + "-hctx-folder"});
            this.ctxMenu_folder.add(
                {id:"row_folder_edit", text: "名前の変更", cls: "grid-ctx-menu-edit"},
                {id:"row_folder_delete", text: "削除", cls: "grid-ctx-menu-delete"}
            );
            this.ctxMenu_folder.on("itemclick", this.onGridRowContextMenuClick_folder, this);

            // ファイル用
            this.ctxMenu_file = new Ext.menu.Menu({id: this.grid_list.id + "-hctx-file"});
            this.ctxMenu_file.add(
                {id:"downloadfile", text: app_localized_message("label", "downloadfile"), cls: "grid-ctx-menu-download"},
                {id:"destroyfile", text: app_localized_message("label", "destroyfile"), cls: "grid-ctx-menu-destroy"}
            );
            this.ctxMenu_file.on("itemclick", this.onGridRowContextMenuClick_file, this);// ファイル用

            // 空白部分
            this.ctxMenu_none = new Ext.menu.Menu({id: this.grid_list.id + "-hctx-none"});
            this.ctxMenu_none.add(
                {id:"row_none_folder_new", text: app_localized_message("label", "newfolder"), cls: "grid-ctx-menu-newfolder"},
                {id:"row_none_file_new", text: app_localized_message("label", "uploadfile"), cls: "grid-ctx-menu-upload"},
                {id:"refresh", text: app_localized_message("label", "refresh"), cls: "grid-ctx-menu-refresh"}
            );
            this.ctxMenu_none.on("itemclick", this.onGridRowContextMenuClick_none, this);// ファイル用
        },

        onGridRowContextMenu_select : function(rec, rowIndex, e)
        {
            var selmodel = this.grid_list.getSelectionModel();
            selmodel.selectRow(rowIndex);
        },

        fncDownloadFile : function(){
            var selmodel = this.grid_list.getSelectionModel() ;
            var selrec = selmodel.getSelected() ;
            var id = selrec.get("id") ;

            var node = this.current_node ;

            var url = this.item_url_fi.replace('{:id}', '000');
            var form = Ext.get('projectfile_download') ;
            form.dom.action = url ;

            elm = Ext.get('projectfile_download_parent_node') ;
            elm.dom.value = node ;
            elm = Ext.get('projectfile_download_target_file') ;
            elm.dom.value = id ;
            elm = Ext.get('projectfile_download_browser_ie') ;
            elm.dom.value = Ext.isIE ? '1' : '0' ;
            form.dom.submit() ;
            return false ;

/*
            var opt = {
                url: url,
                form: 'projectfile_download',
                scope: this,
                method: 'get'
            }
            Ext.Ajax.request(opt);
*/
        },

        /** onGridRowContextMenuClick_folder
         * ファイルコンテキストメニュークリック時の動作
         * 
         * @param Hash
         * @param Ext.EventObject
         */
        onGridRowContextMenuClick_folder : function(item, e)
        {
            switch(item.id){
                case 'row_folder_delete'   : this.fncGetIdToDestroy(); break ;// 削除
                case 'row_folder_edit'     : this.fncFolderEdit(); break ;// フォルダ名編集
            }
        },

        /** onGridRowContextMenuClick_file
         * 
         * @param Hash
         * @param e Ext.event
         */
        onGridRowContextMenuClick_file : function(item, e){
            switch( item.id ){
                case 'downloadfile' : this.fncDownloadFile(); break ;
                case 'destroyfile'  : this.fncGetIdToDestroy(); break ;
            }
        },

        /** onGridRowContextMenuClick_none
         * 
         * @param Hash
         * @param e Ext.event
         */
        onGridRowContextMenuClick_none : function(item, e)
        {
            switch(item.id){
                case 'row_none_folder_new' : this.fncFolderNew(); break ;
                case 'row_none_file_new'   : this.fncFileNew(); break ;
                case 'refresh'             : this.load_list() ; break ;
            }
        },

        /*==================================================
         * 関数名：fncFolderNew
         * 概　要：ファイルフォルダ情報登録ダイアログを表示する
         * 引　数：なし
         * 戻り値：なし
         ==================================================*/
        fncFolderNew : function(){
            var selmdl = this.tree_folder.getSelectionModel() ;
            var selnode = selmdl.getSelectedNode() ;
            if (selnode.id == '0') this.current_node = 0;
            
            // 現在のパスを取得
            var node = this.current_node ;

            $mo.fire('open_projects_folder_edit_dialog', {parent_node: node, fname : null});
        },

        /*==================================================
         * 関数名：fncFolderEdit
         * 概　要：mainリスト用
         * 引　数：なし
         * 戻り値：なし
         ==================================================*/
        fncFolderEdit : function(){
            var selmodel = this.grid_list.getSelectionModel() ;
            var selrec = selmodel.getSelected() ;
            var id = selrec.get("id") ;
            var fname = selrec.get("fname") ;
            this.fncDoEditFolder(id, fname);
        },

        fncDoEditFolder : function(id, fname){
            // 現在のパスを取得
            var node = this.current_node ;
            $mo.fire('open_projects_folder_edit_dialog', {parent_node: node, fname: fname, folder_id: id});
        },

        /*==================================================
         * 関数名：fncFileNew
         * 概　要：ファイル情報登録ダイアログを表示する
         * 引　数：なし
         * 戻り値：なし
         ==================================================*/
        fncFileNew : function(){
            // 現在のパスを取得
            var node = this.current_node ;
            $mo.fire('open_projects_file_edit_dialog', {parent_node: node});

        },

        fncGetIdToDestroy : function(){
            var selmodel = this.grid_list.getSelectionModel() ;
            var selrec = selmodel.getSelected() ;
            var id = selrec.get("id") ;

            this.fncDestroyFile(id);
        },

        fncDestroyFile : function(id){
            // @TODO: データ削除処理
            if (confirm(this.messages.deleted)) {
                Ext.get('file_target_file').dom.value = id;
                var url = this.item_url_fi.replace('{:id}', '000');
                var opt = {
                    url: url,
                    form: 'file_target_file_form',
                    success: this.onDestroySuccess,
                    failure: this.onDestroyFailure,
                    scope: this,
                    method: 'delete'
                }
                Ext.Ajax.request(opt);
            }
        },

        onDestroySuccess: function(r) {            
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

        onDestroyFail: function(r) {
            var message = $mo.decode(r.responseText).message;
            alert(message);
        },

        /*==================================================
         * 関数名：fncCreateLeftLayout
         * 概　要：当該ページの左側エリアレイアウトを生成する
         * 引　数：なし
         * 戻り値：なし
         ==================================================*/
        fncCreateLeftLayout : function(){
            var elmmain = Ext.get( 'file_index_folder_area') ;
            this.left_panel = new Ext.Container({
                applyTo : elmmain,
                layout : 'border',
                monitorResize : true,
                border : true,
                items: [
                    this.tree_folder
                ]
            }) ;
        },

        /*==================================================
         * 関数名：fncCreateCenterLayout
         * 概　要：当該ページの中央エリアレイアウトを生成する
         * 引　数：なし
         * 戻り値：なし
         ==================================================*/
        fncCreateCenterLayout : function(){
            var elmmain = Ext.get( 'file_index_file_area') ;
            this.center_panel = new Ext.Container({
                applyTo : elmmain,
                layout : 'border',
                monitorResize : true,
                border : true,
                items: [
                    this.grid_list
                ]
            }) ;
        }
    };
    
    var panel = new panel(id, p_cd, p_name);
}

$.fn.projects_files_grid = components.projects.files_grid;

})(jQuery, Motto);
