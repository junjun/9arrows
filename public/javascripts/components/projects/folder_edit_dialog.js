/**
 * @author admin
 */

 ;(function($, $mo) {

    $mo.namespace('components.projects.folder_edit_dialog');

components.projects.folder_edit_dialog = function(project_cd)
{
    dialog = function(project_cd) {
        dialog.superclass.constructor.call(this);
        this.project_cd = project_cd;
    }
    dialog.prototype = {
        // dialog config
        width: 300,
        container: 'projects_folder_edit_dialog',
        form: this.container + '_form',
		parent_node : null,
		folder_id : null,
		fname : null,

        // url
        load_url: url_for('projects/' + project_cd + '/folders/new'),
        data_url: url_for('projects/' + project_cd + '/folders/{:id}.json'),

        // messaage
        messages: {
            created: "この情報でフォルダを作成します。\nよろしいですか？",
            updated: "この情報でフォルダを更新します。\nよろしいですか？",
            deleted: "このフォルダを削除します。\n本当によろしいですか？"
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
        },
        set_events: function() {
            $('#' + this.container + '_save').click($mo.scope(this, this.save));
            $('#' + this.container + '_destroy').click($mo.scope(this, this.destroy));
            $('#' + this.container + '_close').click($mo.callback('close_' + this.container));
        },
        set_elements: function()
        {
            // @TODO: ダイアログ内のフォームエレメントの初期化処理
            var ef = Ext.form;

            this.form_parent_node          = new ef.Hidden('dlg_dir_edit_parent_node');
            this.form_target_file          = new ef.Hidden('dlg_dir_edit_target_file');
            // フォルダ名
            this.form_dir_name             = new ef.TextField({ applyTo: 'dlg_dir_edit_dir_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                                allowBlank:false, blankText: 'フォルダ名は必須です。',
                                                                msgTarget: 'title'
                                                              });

            //チェックイベント
            this.form_dir_name.on( 'invalid', invalid_alert, this );

        },
        reset_form: function()
        {
            // @TODO: フォームリセット処理
            this.comp_id = null;
            $('#' + this.container + '_destroy').css("display","none");
            this.form_parent_node.setRawValue('');
            this.form_dir_name.setRawValue('');
            this.form_target_file.setRawValue('');
        },
        set_form_data: function(r)
        {
            if (this.fname) $('#' + this.container + '_destroy').css("display","inline");
            this.form_parent_node.setRawValue(this.parent_node);
            this.form_dir_name.setRawValue(this.fname);
            this.form_target_file.setRawValue(this.folder_id);
        },
        validate: function() {
            // @TODO: 入力チェック
            return this.form_dir_name.validate() ? true : false;
        },
        onBeforeShow: function()
        {
            this.set_form_data();
        },
        onBeforeHide: function()
        {
            // @TODO: ダイアログを閉じる前の処理
            this.reset_form();
        },

        /**
         * SAVE
         */
        save: function()
        {
            if (this.fname) {
                var url = this.data_url.replace('{:id}', this.fname);
                var method = 'put';
                var confirm_message = this.messages.updated;
            } else {
                var url = this.data_url.replace('/{:id}', '');
                var method = 'post';
                var confirm_message = this.messages.created;
            }

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

        /**
         * Destroy
         */
        destroy: function() {
            // @TODO: データ削除処理
            if (confirm(this.messages.deleted)) {
                var url = this.data_url.replace('{:id}', this.fname);
                var opt = {
                    url: url,
                    form: this.form,
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
