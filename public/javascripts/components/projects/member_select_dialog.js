/**
 * @author admin
 */

 ;(function($, $mo) {

    $mo.namespace('components.projects.member_select_dialog');

components.projects.member_select_dialog = function(project_cd)
{
    dialog = function() {
        dialog.superclass.constructor.call(this);
        this.project_cd = project_cd;
    }
    dialog.prototype = {
        // dialog config
        width: 450,
        container: 'projects_member_select_dialog',
        projectusers: null,
        select_single: false,
        select_multi: true,
        select_multi_indexies : new Array(),

        //form: this.container + '_form',

        // property
        // object_symbol: 'task',
        // object_name: 'WBS',

        // url
        load_url       : url_for('projects/' + project_cd + '/members/new'),
        //store_url      : url_for('projects/' + project_cd + '/members/new.json'),

        // messaage
        messages: {
        },

        initialize: function() {
        },

        create_store: function()
        {
            //-----------------------------
            // カラムモデル生成
            //-----------------------------
            // カラム情報
            var cols = new Array() ;
            this.fields = new Array() ;
            if( this.select_multi ){
                // マルチ選択の場合は、チェックボックスを表示
                var col = {
                    header:     app_localized_message("label", "charge_user"),
                    width:      50,
                    sortable:   false,
                    renderer:   this.formatMultiBoolean,
                    dataIndex:"select_multi",
                    align:"center"
                } ;
                cols.push( col ) ;
                this.fields.push( {name:"select_multi", mapping:"select_multi"} ) ;
                
            }
            // ユーザー名称
            var col = {
                header:     app_localized_message("label", "part_members"),
                width:      100,
                sortable:   true,
                id:"user_name",
                dataIndex:"user_name"
            } ;
            cols.push( col ) ;
            this.fields.push({name:"user_name", mapping:"user_name"}) ;
    
            if( this.select_multi ){
                // シングル選択も指定の場合は、ラジオボタンを表示
                if( this.select_single ){
                    var col = {
                        header:     app_localized_message("label", "main_user"),
                        width:      50,
                        sortable:   false,
                        renderer:   this.formatSingleBoolean,
                        dataIndex:"select_single",
                        align:"center"
                    } ;
                    cols.push( col ) ;
                    this.fields.push( {name:"select_single", mapping:"select_single"} ) ;
                }
            }
    
            this.fields.push({name:"projectuser_id", mapping:"projectuser_id"}) ;

            this.store = new Ext.data.JsonStore({
                root: "projectusers",
		        fields:this.fields
            });

            this.cols = cols;

        },
        create_grid: function()
        {
            //毎回ダイアログ開く時に作るので、クリアします。
            Ext.get(this.container + '_grid').dom.innerHTML = '';
            this.grid_list = new Ext.grid.GridPanel({
                el : this.container + '_grid',
                ds: this.store,
                columns : this.cols,
                stripeRows: true,
                autoExpandColumn: 'user_name',
                loadMask : true,
                region: 'center',
                margins: '0 0 0 0'
            });
            this.grid_list.addListener("cellclick", this.onCellClick, this, true) ;
        },
        create_panel: function()
        {
            var elmmain = Ext.get(this.container + '_grid_panel');
            this.center_panel = new Ext.Container({
                applyTo : elmmain,
                width: 416,
                height:160,
                layout : 'border',
                monitorResize : true,
                border : true,
                items: [
                	this.grid_list
                ]
            });
        },

        onCellClick : function(grid, rowIndex, columnIndex, e){

            var ds = this.store;
            var rec = ds.getAt(rowIndex) ;
            if( this.select_multi ){
                if(  columnIndex == 0 ){
                    if( rec.get("select_multi") ){
                        rec.set("select_multi", false) ;
                        var idx = this.select_multi_indexies.indexOf(rowIndex);
                        if (idx != -1){
                            this.select_multi_indexies.splice(idx, 1);
                        }

                        if( this.select_single ){
                            rec.set("select_single", false ) ;

                            if( this.single_row_index == rowIndex ){
                                var new_single_index = null ;
                                for( var i=0 ; i<this.select_multi_indexies.length ; i++ ){
                                    if( new_single_index == null || this.select_multi_indexies[i] < new_single_index ){
                                        new_single_index = this.select_multi_indexies[i] ;
                                    }
                                }
                                if( new_single_index == null ){
                                    this.single_row_index = null ;
                                }
                                else{
                                    var newrec = ds.getAt(new_single_index) ;
                                    newrec.set("select_single", true ) ;
                                    this.single_row_index = new_single_index ;
                                }
                            }
                        }
                    }
                    else{
                        rec.set("select_multi", true ) ;

                        var idx = this.select_multi_indexies.indexOf(rowIndex);
                        if (idx == -1){
                            this.select_multi_indexies.push( rowIndex ) ;
                        }

                        if( this.select_single ){
                            if( this.select_multi_indexies.length == 1 ){
                                rec.set("select_single", true ) ;
                                this.single_row_index = rowIndex ;
                            }
                            else{
                                rec.set("select_single", false ) ;
                            }
                        }
                    }
                }
                else if( this.select_single ){
                    if(  columnIndex == 2 && rec.get("select_multi") ){
                        if( this.single_row_index != null ){
                            ds.getAt(this.single_row_index).set("select_single", false ) ;
                        }
                        rec.set("select_single", true ) ;
                        this.single_row_index = rowIndex ;
                    }
                }
            }
        },

        formatMultiBoolean : function(value, p, r){
            var ret = value ? '<img src="' + url_for("images/icon/checked_checkbox.gif") + '">' : '<img src="' + url_for("images/icon/check_checkbox.gif") + '">';  
            return ret ;
        },

        formatSingleBoolean : function(value, p, r){
            var radio = value ? '<img src="' + url_for("images/icon/checked_radio.gif") + '">' : '<img src="' + url_for("images/icon/check_radio.gif") + '">';
            var ret = !r.data.select_multi ? '<img src="' + url_for("images/icon/check_radio_disabled.gif") + '">' : radio ;
            return ret ;
        },

        fncGetProjectUsersSize : function(){
            return this.store.getCount() ;
        },

        fncGetProjectUserAttribute : function(rowindex, name){
            var row = this.store.getAt(rowindex) ;
            if( row == null ) return null;
        
            switch( name ){
                case 'select_multi' :
                    var ret = row.get(name) ;
                    return ret ;
                    break ;
                case 'select_single' :
                    var ret = row.get(name) ;
                    return ret ;
                    break ;
                case 'user_name' :
                case 'projectuser_id' :
                    var ret = row.get(name) ;
                    return ret ;
                    break ;
                default :
                    return null ;
                    break ;
            }
        },

        loadedDialog: function() {
            this.set_signals();
            this.set_events();
        },
        set_signals: function() {
            $mo.connect('open_' + this.container, this.open, this);
            $mo.connect('close_' + this.container, this.close, this);
        },
        set_events: function() {
            $('#' + this.container + '_save').click($mo.scope(this, this.save));
            $('#' + this.container + '_close').click($mo.callback('close_' + this.container));
        },

        onBeforeShow: function()
        {
            this.create_store();
            this.create_grid();
            this.create_panel();

            // @TODO: ダイアログ表示の前処理
            this.load_data();
        },

        onShow: function(){
            this.center_panel.doLayout() ;
        },

        /**
         * Load Data
         */
        load_data: function() {
            // プロジェクトユーザーオブジェクト
            this.single_row_index = null;
            this.select_multi_indexies = new Array();
            if(this.projectusers){
                var initialdata = new Array();
                initialdata["projectusers"] = this.projectusers ;
                for( var index=0 ; index<initialdata["projectusers"].length ; index++ ){
                    if( initialdata["projectusers"][index].select_single ){
                        this.single_row_index = index ;
                    }
                    
                    if( initialdata["projectusers"][index].select_multi){
                        this.select_multi_indexies.push( index ) ;
                    }
                }
                this.store.loadData(initialdata) ;
            }
        },

        /**
         * SAVE
         */
        save: function()
        {
            this.close();
            if (this.select_single){
                $mo.fire('saved_' + this.container);
            } else {
                $mo.fire('saved_' + this.container + '2');
            }

        }
    };

    $mo.extend(dialog, Motto.ui.Dialog);
    this.dialog = new dialog(project_cd);
    
    return this.dialog;
}


})(jQuery, Motto);
