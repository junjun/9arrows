/**
 * @author admin
 */

 ;(function($, $mo) {

    $mo.namespace('components.projects.task_confirm_dialog');

components.projects.task_confirm_dialog = function(project_cd)
{
    dialog = function() {
        dialog.superclass.constructor.call(this);
        this.project_cd = project_cd;
    }
    dialog.prototype = {
        // dialog config
        width: 450,
        container: 'projects_task_confirm_dialog',
        comp_id: null,

        grid_list      : null, // グリッドエレメント

        // url
        load_url   : url_for('projects/' + project_cd + '/tasks/' + project_cd + '/confirms/new'),
        store_url  : url_for('projects/' + project_cd + '/tasks/' + project_cd + '/confirms/{:id}.json'),

        // messaage
        messages: {
        },

        initialize: function() {
        },

        create_store: function()
        {
            this.store = new Ext.data.JsonStore({
                totalProperty  : 'totalCount',
        	    fields : [
                    {name: 'report_user',   mapping: 'report_user'},
                    {name: 'report_date',   mapping: 'report_date'},
                    {name: 'progress_rate', mapping: 'progress_rate'},
                    {name: 'content',       mapping: 'content'}
                ]
            });
        },
        create_grid: function()
        {
            var colModel   = new Ext.grid.ColumnModel([
                {header: app_localized_message('label', 'report_date'), width: 80, sortable: true, dataIndex: 'report_date'},
                {header: app_localized_message('label', 'content'), width: 40, sortable: true, dataIndex: 'content', id:'content'},
                {header: app_localized_message('label', 'progress_rate'), width: 60, sortable: true, dataIndex: 'progress_rate', align:'right'},
                {header: "報告者", width: 60, sortable: true, dataIndex: 'report_user', id:'report_user'}
            ]);
            this.grid_list = new Ext.grid.GridPanel({
                el : this.container + '_grid',
                ds: this.store,
                cm: colModel,
                autoExpandColumn: 'content',
                loadMask : true,
                monitorResize : true ,
                region: 'center',
                title: 'タスク進捗',
                iconCls: 'icon-grid',
                margins: '0 0 0 0'
            });
        },
        create_panel: function()
        {
            var elmmain = Ext.get(this.container + '_grid_panel');
            this.center_panel = new Ext.Container({
                applyTo : elmmain,
                layout : 'border',
                width: 416,
                height:260,
                monitorResize : true,
                border : true,
                items: [
                	this.grid_list
                ]
            });
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
	     * 関数名：fncDataSet
	     * 概　要：入力フォームデータをセットする
	     * 戻り値：なし
	     */
	    fncDataSet : function(data)
	    {
	        if(!data) return false;
	
	        var comp = data.comp;
	        var task = data.task;
	
	        var info_prefix = 'dlg_tsk_confirm_task_data' + '_';
	        var nb = '&nbsp;';
	
	        Ext.get(info_prefix+'name').dom.innerHTML = comp.item_name;
	        var complete_date = (task.complete_date || nb) + nb + app_localized_message('label', 'complete_date');
	        Ext.get(info_prefix+'complete_date').dom.innerHTML = complete_date;
	        var progress_rate  = '(' + app_localized_message('label', 'progress_rate') + ')' + nb + (task.progress_rate || nb) + nb;
	        Ext.get(info_prefix+'progress_rate').dom.innerHTML = progress_rate;
	        var report_date    = '(' + app_localized_message('label', 'report_date') + ')' + nb +  (task.report_date || nb);
	        Ext.get(info_prefix+'report_date').dom.innerHTML = report_date;
	    },

        /**
         * Load Data
         */
        load_data: function() {
            var url = this.store_url.replace('{:id}', this.comp_id);
	        var o = {
	            url:     url,
	            success: this.onSuccessDataLoad,
	            failure: this.onFailureDataLoad,
	            scope:   this
	        }
	        Ext.Ajax.request(o);
        },
	    onSuccessDataLoad: function(r, options)
	    {
	        var r = $mo.decode(r.responseText);
	        if (r.success) {
	            this.fncDataSet(r.result);
	            this.store.loadData(r.result.histories)
	        } else {
	            alert(r.message);
	        }
	    },
	    onFailureDataLoad: function(r)
	    {
	    }
    };

    $mo.extend(dialog, Motto.ui.Dialog);
    this.dialog = new dialog(project_cd);
    
    return this.dialog;
}


})(jQuery, Motto);
