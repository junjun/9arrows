/**
 * @author admin
 */

 ;(function($, $mo) {

    $mo.namespace('components.projects.file_edit_dialog');

components.projects.file_edit_dialog = function(project_cd)
{
    dialog = function(project_cd) {
        dialog.superclass.constructor.call(this);
        this.project_cd = project_cd;
    }
    dialog.prototype = {
        // dialog config
        width: 300,
        container: 'projects_file_edit_dialog',
        form: this.container + '_form',
		parent_node : null,

        // url
        load_url: url_for('projects/' + project_cd + '/files/new'),
        data_url: url_for('projects/' + project_cd + '/files/{:id}.json'),

        // messaage
        messages: {
            created: "この情報でファイルを作成します。\nよろしいですか？"
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
            $('#' + this.container + '_close').click($mo.callback('close_' + this.container));
        },
        set_elements: function()
        {
            // @TODO: ダイアログ内のフォームエレメントの初期化処理
            var ef = Ext.form;

            this.form_parent_node          = new ef.Hidden('dlg_fil_upload_parent_node');
            this.form_upload_file_name     = new ef.Hidden('dlg_fil_upload_upload_file_name');

            //チェックイベント
            // this.form_dir_name.on( 'invalid', invalid_alert, this );

        },
        reset_form: function()
        {
            // @TODO: フォームリセット処理
            this.comp_id = null;
            this.form_parent_node.setRawValue('');
            this.form_upload_file_name.setRawValue('');
            Ext.get('dlg_fil_upload_upload_file').dom.value = '';
        },
        set_form_data: function(r)
        {
            this.form_parent_node.setRawValue(this.parent_node);
        },
        validate: function() {
            // @TODO: 入力チェック
            // return this.form_dir_name.validate() ? true : false;
            return true;
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
        save: function(update_flg)
        {
            var url = this.data_url.replace('/{:id}', '');
            var method = 'post';
            var confirm_message = this.messages.created;

            value = Ext.get('dlg_fil_upload_upload_file').dom.value;
            // ファイル名取得
            this.form_upload_file_name.setRawValue(value);

            if (!update_flg) {
                if (!this.validate() || !confirm(confirm_message)) return false;
            }
            var opt = {
                url: url,
                form: this.form,
                params: {update_flg: update_flg},
                success: this.onSaveSuccess,
                failure: this.onSaveFailure,
                scope: this,
                method: method
            }
            Ext.Ajax.request(opt);
        },
        onSaveSuccess: function(r) {            
            var r = $mo.decode(r.responseText);
            var success = r.success ;
            var message = r.message ;
            var resultobj = r.result ;
            if (success){
                if (message){
                    ret = confirm(message);
                    if (ret){
                        this.save(true);
                    }
                }
                this.close();
                $mo.fire('saved_' + this.container);
            } else {
                alert(message);
            }
        },
        onSaveFailure: function(r) {
            var message = $mo.decode(r.responseText).message;
            alert(message);
        }
    };

    $mo.extend(dialog, Motto.ui.Dialog);
    var dialog = new dialog(project_cd);
}


})(jQuery, Motto);
