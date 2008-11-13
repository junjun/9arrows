/**
 * @author admin
 */

 ;(function($, $mo) {

    $mo.namespace('components.projects.event_edit_dialog');

components.projects.event_edit_dialog = function(project_cd)
{
    dialog = function(project_cd) {
        dialog.superclass.constructor.call(this);
        this.project_cd = project_cd;
    }
    dialog.prototype = {
        // dialog config
        width: 450,
        container: 'projects_event_edit_dialog',
        form: this.container + '_form',
        comp_id: null,
        projectusers : {},

        // url
        load_url: url_for('projects/' + project_cd + '/events/new'),
        data_url: url_for('projects/' + project_cd + '/events/{:id}.json'),

        // messaage
        messages: {
            created: "この情報でイベントを作成します。\nよろしいですか？",
            updated: "この情報でイベントを更新します。\nよろしいですか？",
            deleted: "このイベントを削除します。\n本当によろしいですか？"
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
            $mo.connect('saved_projects_member_select_dialog2', this.onMemberSelectDialog_saved, this);
        },

        set_events: function() {
            $('#' + this.container + '_save').click($mo.scope(this, this.save));
            $('#' + this.container + '_destroy').click($mo.scope(this, this.destroy));
            $('#' + this.container + '_close').click($mo.callback('close_' + this.container));
            $('#dlg_evt_edit_euselect').click($mo.scope(this, this.openMemberDlg));
        },
        openMemberDlg: function(){
            $mo.fire('open_projects_member_select_dialog', {projectusers: this.projectusers, select_multi: true, select_single: false});
        },
        set_elements: function()
        {
            // @TODO: ダイアログ内のフォームエレメントの初期化処理
            var ef = Ext.form;
            var m1 = 'dlg_evt_edit_event' + '_';
            var m2 = 'dlg_evt_edit_comp' + '_';

            this.form_event_id              = new ef.Hidden(m1+'id');
            this.form_comp_id               = new ef.Hidden(m2+'id');
            this.form_task_kbn              = new ef.Hidden(m2+'task_kbn');

            // イベント
            this.form_item_name             = new ef.TextField({ applyTo: m2+'item_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 allowBlank:false, blankText: 'イベントは必須です。',
                                                                 msgTarget: 'title'
                                                               });
            // 開始日時
            this.form_start_date            = new ef.DateField({ applyTo: m1+'start_date', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title', format:"Y-m-d"
                                                               });
            // 開始時
            this.form_start_time_4i         = new ef.NumberField({ applyTo: m1+'start_time_4i', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                   msgTarget: 'title', value: 0
                                                               });
            // 開始分
            this.form_start_time_5i         = new ef.NumberField({ applyTo: m1+'start_time_5i', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                   msgTarget: 'title', value: 0
                                                               });
            // 完了時
            this.form_end_time_4i           = new ef.NumberField({ applyTo: m1+'end_time_4i', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                   msgTarget: 'title', value: 0
                                                               });
            // 完了分
            this.form_end_time_5i           = new ef.NumberField({ applyTo: m1+'end_time_5i', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                   msgTarget: 'title', value: 0
                                                               });
            // 場所
            this.form_place                 = new ef.TextField({ applyTo: m1+'place', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                 msgTarget: 'title'
                                                               });
            // メモ
            this.form_content               = new ef.TextArea({ applyTo: m1+'content', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
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

            this.form_event_id.setRawValue('');
            this.form_comp_id.setRawValue('');
            this.form_task_kbn.setRawValue('');
            this.form_item_name.setRawValue('');
            this.form_start_date.setRawValue('');
            this.form_start_time_4i.setRawValue('');
            this.form_start_time_5i.setRawValue('');
            this.form_end_time_4i.setRawValue('');
            this.form_end_time_5i.setRawValue('');
            this.form_place.setRawValue('');
            this.form_content.setRawValue('');
            this.form_class_word1.setRawValue('');
            this.form_class_word2.setRawValue('');
            this.form_class_word3.setRawValue('');
        },
        set_form_data: function(r)
        {
            var event = r.event;
            if (event.id) {
                $('#' + this.container + '_destroy').css("display","inline");
            } else {
                $('#' + this.container + '_destroy').css("display","none");
            }
            var projectcomp = r.projectcomp;
            var projectusers = r.projectusers;
            var eventusers = r.eventusers;

            this.form_event_id.setRawValue(event.id || '');
            this.form_comp_id.setRawValue(projectcomp.id || '');
            this.form_task_kbn.setRawValue(projectcomp.task_kbn || '');
            this.form_item_name.setRawValue(projectcomp.item_name || '');
            this.form_start_date.setRawValue(event.start_date || '');

            if( event.start_time != null && event.start_time != "" ){
                var hm = event.start_time.split(':') ;
                this.form_start_time_4i.setRawValue(hm[0]);
                this.form_start_time_5i.setRawValue(hm[1]);
            }
            if( event.end_time != null && event.end_time != "" ){
                var hm = event.end_time.split(':') ;
                this.form_end_time_4i.setRawValue(hm[0]);
                this.form_end_time_5i.setRawValue(hm[1]);
            }

            this.form_place.setRawValue(event.place || '');
            this.form_content.setRawValue(event.content || '');
            this.form_class_word1.setRawValue(projectcomp.class_word1 || '');
            this.form_class_word2.setRawValue(projectcomp.class_word2 || '');
            this.form_class_word3.setRawValue(projectcomp.class_word3 || '');

            var eventuser_regist_id = new Array() ;

            // 設定済みのイベントユーザーのIDをキーに、ハッシュを生成
            if( eventusers != null ){
                for( var index=0 ; index<eventusers.length ; index++){
                    eventuser_regist_id[eventusers[index].projectuser_id] = true ;
                }
            }
            if( projectusers != null ){
                for( var index=0 ; index<projectusers.length ; index++){
                    if( eventuser_regist_id[projectusers[index].projectuser_id] ){
                        projectusers[index].select_multi = true ;
                    }
                    else{
                        projectusers[index].select_multi = false ;
                    }
                }
            }
            this.projectusers = projectusers ;
            this.fncUpdateProjectUsers() ;
        },

        fncUpdateProjectUsers : function(){
            var eventusers_name = "" ;
            for( var index=0 ; index<this.projectusers.length ; index++ ){
                var pu = this.projectusers[index] ;
                if( pu.select_multi ){
                    if( eventusers_name !="" ) eventusers_name += "，" ;
                        if( pu.select_single ){
                        eventusers_name += '' + pu.user_name + '(' + app_localized_message("label", "main_user_abb") + ')' ;
                    }
                    else{
                        eventusers_name += pu.user_name ;
                    }
                }
            }
            Ext.get('dlg_evt_edit_eventusers_user_name').dom.innerHTML = eventusers_name ;
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
            var elm = Ext.get('dlg_evt_edit_hidden_area');
            elm.dom.innerHTML = "";
            for( var index=0 ; index<this.projectusers.length ; index++ ){
                var pu = this.projectusers[index] ;
                if( pu.select_multi ){
                    elm.dom.innerHTML += '<input type="hidden" name="dlg_evt_edit_eventusers[projectuser_id][]" value="'+pu.projectuser_id+'">';
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
            for( var index=0 ; index<length ; index++ ){
                var id = $page.member_select_dialog.fncGetProjectUserAttribute(index, "projectuser_id");
                select_multi_ids[id] = $page.member_select_dialog.fncGetProjectUserAttribute(index,"select_multi" );
            }
            
            for( var index=0 ; index<this.projectusers.length ; index++ ){
                this.projectusers[index].select_multi = select_multi_ids[this.projectusers[index].projectuser_id] ;
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
