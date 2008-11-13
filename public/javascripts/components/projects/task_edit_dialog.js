/**
 * @author admin
 */

 ;(function($, $mo) {

    $mo.namespace('components.projects.task_edit_dialog');

components.projects.task_edit_dialog = function(project_cd)
{
    dialog = function(project_cd) {
        dialog.superclass.constructor.call(this);
        this.project_cd = project_cd;
    }
    dialog.prototype = {
        // dialog config
        width: 450,
        container: 'projects_task_edit_dialog',
        form: this.container + '_form',
        comp_id: null,
        projectusers: {},

        // url
        load_url: url_for('projects/' + project_cd + '/tasks/new'),
        data_url: url_for('projects/' + project_cd + '/tasks/{:id}.json'),

        // messaage
        messages: {
            created: "この情報でタスクを作成します。\nよろしいですか？",
            updated: "この情報でタスクを更新します。\nよろしいですか？",
            deleted: "このタスクを削除します。\n本当によろしいですか？"
        },
        initialize: function() {
            this.form = this.container + '_form';
        },
        loadedDialog: function() {
            this.set_signals();
            this.set_events();
            this.set_elements();
        },
        set_signals: function() {
            $mo.connect('open_' + this.container, this.open, this);
            $mo.connect('close_' + this.container, this.close, this);
            $mo.connect('saved_projects_member_select_dialog', this.onMemberSelectDialog_saved, this);
        },
        set_events: function() {
            $('#' + this.container + '_save').click($mo.scope(this, this.save));
            $('#' + this.container + '_destroy').click($mo.scope(this, this.destroy));
            $('#' + this.container + '_close').click($mo.callback('close_' + this.container));
            $('#dlg_tsk_edit_tuselect').click($mo.scope(this, this.openMemberDlg));
        },
        openMemberDlg: function(){
            $mo.fire('open_projects_member_select_dialog', {projectusers: this.projectusers, select_multi: true, select_single: true});
        },
        set_elements: function()
        {
            // @TODO: ダイアログ内のフォームエレメントの初期化処理
            var ef = Ext.form;
            var m1 = 'dlg_tsk_edit_task' + '_';
            var m2 = 'dlg_tsk_edit_comp' + '_';

            this.form_task_id               = new ef.Hidden(m1+'id');
            this.form_comp_id               = new ef.Hidden(m2+'id');
            this.form_task_kbn              = new ef.Hidden(m2+'task_kbn');

            // タスク
            this.form_item_name             = new ef.TextField({ applyTo: m2+'item_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 allowBlank:false, blankText: 'タスクは必須です。',
                                                                 msgTarget: 'title'
                                                               });
            // 優先度
            this.form_priority_kbn          = new ef.ComboBoxEx({ transform: m1+'priority_kbn', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                  msgTarget: 'title', style: 'width:80px;', editable:false, triggerAction: "all"
                                                               });
            // 予測時間
            this.form_plan_power            = new ef.NumberField({ applyTo: m1+'plan_power', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                   msgTarget: 'title', value: 0
                                                               });
            // 予測時間
            this.form_tani_kbn              = new ef.ComboBoxEx({ transform: m1+'tani_kbn', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                  msgTarget: 'title', style: 'width:76px;', editable:false, triggerAction: "all"
                                                               });
            // 期限
            this.form_complete_date         = new ef.DateField({ applyTo: m1+'complete_date', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title', format:"Y-m-d"
                                                               });
            // 期間
            this.form_start_date            = new ef.DateField({ applyTo: m1+'start_date', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title', format:"Y-m-d"
                                                               });
            // 期間
            this.form_end_date              = new ef.DateField({ applyTo: m1+'end_date', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title', format:"Y-m-d"
                                                               });
            // 依頼者
            this.form_client_user_id        = new ef.ComboBoxEx({ transform: m1+'client_user_id', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                  msgTarget: 'title', style: 'width:200px;', editable:false, triggerAction: "all"
                                                               });
            // 成果物
            this.form_result                = new ef.TextArea({ applyTo: m1+'result', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                msgTarget: 'title'
                                                               });
            // メモ
            this.form_memo                  = new ef.TextArea({ applyTo: m1+'memo', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                msgTarget: 'title'
                                                               });
            // 分類
            this.form_class_word1           = new ef.TextField({ applyTo: m2+'class_word1', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title'
                                                               });
            // 分類
            this.form_class_word2           = new ef.TextField({ applyTo: m2+'class_word2', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title'
                                                               });
            // 分類
            this.form_class_word3           = new ef.TextField({ applyTo: m2+'class_word3', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title'
                                                               });

            //チェックイベント
            this.form_item_name.on( 'invalid', invalid_alert, this );

        },
        reset_form: function()
        {
            // @TODO: フォームリセット処理
            this.comp_id = null;
            $('#' + this.container + '_destroy').css("display","none");
            this.form_task_id.setValue('');
            this.form_comp_id.setValue('');
            this.form_task_kbn.setValue('');
            this.form_item_name.setRawValue('');
            this.form_priority_kbn.setValue('');
            this.form_plan_power.setValue(0);
            this.form_tani_kbn.setValue('');
            this.form_complete_date.setValue('');
            this.form_start_date.setValue('');
            this.form_end_date.setValue('');
            this.form_client_user_id.setValue('');
            this.form_result.setValue('');
            this.form_memo.setValue('');
            this.form_class_word1.setValue('');
            this.form_class_word2.setValue('');
            this.form_class_word3.setValue('');
        },
        set_form_data: function(r)
        {
            var task = r.task;
            if (task.id) {
                $('#' + this.container + '_destroy').css("display","inline");
            } else {
                $('#' + this.container + '_destroy').css("display","none");
            }
            var projectcomp = r.projectcomp;
            var projectusers = r.projectusers || {};
            var taskusers = r.taskusers;

            this.form_task_id.setValue(task.id || '');
            this.form_comp_id.setValue(projectcomp.id || '');
            this.form_task_kbn.setValue(projectcomp.task_kbn || '');
            this.form_item_name.setRawValue(projectcomp.item_name || '');
            this.form_priority_kbn.setValue(task.priority_kbn || '');
            this.form_plan_power.setValue(task.plan_power || 0);
            this.form_tani_kbn.setValue(task.tani_kbn || '');
            this.form_complete_date.setValue(task.complete_date || '');
            this.form_start_date.setValue(task.start_date || '');
            this.form_end_date.setValue(task.end_date || '');
            this.form_client_user_id.setValue(task.client_user_id || '');
            this.form_result.setValue(task.result || '');
            this.form_memo.setValue(task.memo || '');
            this.form_class_word1.setValue(projectcomp.class_word1 || '');
            this.form_class_word2.setValue(projectcomp.class_word2 || '');
            this.form_class_word3.setValue(projectcomp.class_word3 || '');

            var taskuser_regist_id = new Array() ;

            // 設定済みのタスクユーザーのIDをキーに、ハッシュを生成
            if( taskusers != null ){
                for( var index=0 ; index<taskusers.length ; index++){
                    taskuser_regist_id[taskusers[index].projectuser_id] = true ;
                }
            }
            if( projectusers != null ){
                cmp = this.form_client_user_id;
				var users = [];
                for( var index=0 ; index<projectusers.length ; index++){
 					users.push( [ projectusers[index].projectuser_id, projectusers[index].user_name ] )
                }

		        cmp.clearValue() ;
		        cmp.store.loadData(users);
                this.form_client_user_id.setValue(task.client_user_id || '');

                for( var index=0 ; index<projectusers.length ; index++){
                    if( taskuser_regist_id[projectusers[index].projectuser_id] ){
                        projectusers[index].select_multi = true ;
                    }
                    else{
                        projectusers[index].select_multi = false ;
                    }
                    if( task.main_user_id == projectusers[index].projectuser_id ){
                        projectusers[index].select_single = true ;
                    }
                    else{
                        projectusers[index].select_single = false ;
                    }
                }
            }
            this.projectusers = projectusers ;
            this.fncUpdateProjectUsers() ;
        },

        fncUpdateProjectUsers : function(){
            var taskusers_name = "" ;
            for( var index=0 ; index<this.projectusers.length ; index++ ){
                var pu = this.projectusers[index] ;
                if( pu.select_multi ){
                    if( taskusers_name !="" ) taskusers_name += "，" ;
                        if( pu.select_single ){
                        taskusers_name += '' + pu.user_name + '(' + app_localized_message("label", "main_user_abb") + ')' ;
                    }
                    else{
                        taskusers_name += pu.user_name ;
                    }
                }
            }
            Ext.get('dlg_tsk_edit_taskusers_user_name').dom.innerHTML = taskusers_name ;
        },

        validate: function() {
            // @TODO: 入力チェック
            return this.form_item_name.validate() ? true : false;
        },

        onBeforeShow: function()
        {
            // @TODO: ダイアログ表示の前処理
            this.load_data();
        },
        onBeforeHide: function()
        {
            // @TODO: ダイアログを閉じる前の処理
            this.reset_form();
        },

        /**
         * Load Data
         */
        load_data: function() {

            if (this.comp_id) {
                var url = this.data_url.replace('{:id}', this.comp_id);
            } else {
                var url = this.load_url + '.json';
            }
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
                this.set_form_data(resultobj);
            } else {
                this.close();
                alert(message);
            }
        },
        onLoadFailure: function(r) {
            var message = $mo.decode(r.responseText).message;
            alert(message);
        },

        /**
         * SAVE
         */
        save: function()
        {
            if (this.comp_id) {
                var url = this.data_url.replace('{:id}', this.comp_id);
                var method = 'put';
                var confirm_message = this.messages.updated;
            } else {
                var url = this.data_url.replace('/{:id}', '');
                var method = 'post';
                var confirm_message = this.messages.created;
            }

            this.fncFormSetProjectUsers() ;

            if (this.validate() && confirm(confirm_message)) {
                var opt = {
                    url: url,
                    form: this.form,
                    success: this.onSaveSuccess,
                    failure: this.onSaveFailure,
                    scope: this,
                    method: method
                }
                Ext.Ajax.request(opt);
            }
        },

        fncFormSetProjectUsers : function(){
            var elm = Ext.get('dlg_tsk_edit_hidden_area');
            elm.dom.innerHTML = "";
            for( var index=0 ; index<this.projectusers.length ; index++ ){
                var pu = this.projectusers[index] ;
                if( pu.select_multi ){
                    elm.dom.innerHTML += '<input type="hidden" name="dlg_tsk_edit_taskusers[projectuser_id][]" value="'+pu.projectuser_id+'">';
                    if( pu.select_single ){
                        elm.dom.innerHTML += '<input type="hidden" name="dlg_tsk_edit_task[main_user_id]" value="'+pu.projectuser_id+'">';
                    }
                }
            }
        },

        onSaveSuccess: function(r) {            
            var r = $mo.decode(r.responseText);
            var success = r.success ;
            var message = r.message ;
            var resultobj = r.result ;
            if (success){
                this.close();
                $mo.fire('saved_' + this.container);
            } else {
                alert(message);
            }
        },
        onSaveFailure: function(r) {
            var message = $mo.decode(r.responseText).message;
            alert(message);
        },

        onMemberSelectDialog_saved : function(){
            var length = $page.member_select_dialog.fncGetProjectUsersSize();
            var select_multi_ids = new Array() ;
            var select_single_id = null ;
            for( var index=0 ; index<length ; index++ ){
                var id = $page.member_select_dialog.fncGetProjectUserAttribute(index, "projectuser_id");
                select_multi_ids[id] = $page.member_select_dialog.fncGetProjectUserAttribute(index,"select_multi" );
                if( $page.member_select_dialog.fncGetProjectUserAttribute(index, "select_single")){
                    select_single_id = id ;
                }
            }
            
            for( var index=0 ; index<this.projectusers.length ; index++ ){
                this.projectusers[index].select_multi = select_multi_ids[this.projectusers[index].projectuser_id] ;
                if( select_single_id == this.projectusers[index].projectuser_id ){
                    this.projectusers[index].select_single = true ;
                }
                else{
                    this.projectusers[index].select_single = false ;
                }
            }
    
            this.fncUpdateProjectUsers() ;
        },

        /**
         * Destroy
         */
        destroy: function() {
            // @TODO: データ削除処理
            if (confirm(this.messages.deleted)) {
                var url = this.data_url.replace('{:id}', this.comp_id);
                var opt = {
                    url: url,
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
                this.close();
                $mo.fire('deleted_' + this.container);
            } else {
                alert(message);
            }
        },
        onDestroyFailure: function(r) {
            var message = $mo.decode(r.responseText).message;
            alert(message);
        }
    };

    $mo.extend(dialog, Motto.ui.Dialog);
    var dialog = new dialog(project_cd);
}


})(jQuery, Motto);
