/**
 * @author admin
 */
;(function($, $mo) {

App.ProjectsEdit = function() {
    App.ProjectsEdit.superclass.constructor.call(this);
}

App.ProjectsEdit.prototype = {
    members : [],
    members_cnt : Number(Ext.get('members_cnt').dom.value),

    initialize: function() {
        $mo.fire('created_page');

        this.set_events();
        this.set_elements();
    },

    set_events : function()
    {
		// 保存ボタンクリックイベント設定
        $('#btn_add_project').click($mo.scope(this, this.save));
		// 変更ボタンクリックイベント設定
        $('#btn_edit_project').click($mo.scope(this, this.save));
    },

    set_elements: function()
    {
        // @TODO: ダイアログ内のフォームエレメントの初期化処理
        var ef = Ext.form;
        var m1 = 'project'  + '_';
        var m2 = 'template' + '_';

        // プロジェクト名
        this.form_project_name        = new ef.TextField({ applyTo: m1+'project_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                           allowBlank:false, blankText: 'プロジェクト名は必須です。',
                                                           msgTarget: 'title'
                                                         });
        // プロジェクトコード
        this.form_project_cd          = new ef.TextField({ applyTo: m1+'project_cd', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                           allowBlank:false, blankText: 'プロジェクトコードは必須です。',
                                                           msgTarget: 'title'
                                                         });
        // エンドユーザー名
        this.form_end_user_name       = new ef.TextField({ applyTo: m1+'end_user_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                           allowBlank:false, blankText: 'エンドユーザー名は必須です。',
                                                           msgTarget: 'title'
                                                         });
        // 開始日
        this.form_start_date          = new ef.DateField({ applyTo: m1+'start_date', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                           allowBlank:false, blankText: '開始日は必須です。', invalidText: '開始日が不正です',
                                                           msgTarget: 'title', format: "Y-m-d"
                                                         });
        // 終了日
        this.form_delivery_date       = new ef.DateField({ applyTo: m1+'delivery_date', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                           allowBlank:false, blankText: '終了日は必須です。', invalidText: '終了日が不正です',
                                                           msgTarget: 'title', format: "Y-m-d"
                                                         });
        // テンプレート
        this.form_template_id         = new ef.ComboBoxEx({ transform: m2+'id', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                            msgTarget: 'title', style: 'width: 212px;', editable:false, triggerAction: "all"
                                                          });
        // 参加メンバー
        var elms = Ext.query( 'input.members_field' ) ;
        for( var i=0 ; i<elms.length ; i++ ){
            var e = elms[i] ;
            this.set_member_event(e.id);
        }

        //チェックイベント
        set_invalid_event(this.form_project_name);
        set_invalid_event(this.form_project_cd);
        set_invalid_event(this.form_end_user_name);
        set_invalid_event(this.form_start_date);
        set_invalid_event(this.form_delivery_date);
    },

    set_member_event: function(id){
        var ef = Ext.form;
        // 参加メンバー
        var email = new ef.TextField({ applyTo: id, selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                       vtype: 'email', vtypeText: '参加メンバーの形式は不正です。',
                                       msgTarget: 'title'
                                     });
        this.members.push(email);
        set_invalid_event(email);

    },

    validate: function() {
        // @TODO: 入力チェック
        var rtn = ( this.form_project_name.validate() &&
                    this.form_project_cd.validate() &&
                    this.form_end_user_name.validate() &&
                    this.form_start_date.validate() &&
                    this.form_delivery_date.validate()
                  );
        if (!rtn) return false;
        for(var i=0;i<this.members.length;i++){
            if (!this.members[i].validate()) return false;
        }

        return true;
    },

    // messaage
    messages: {
        created: "この情報でプロジェクトを作成します。\nよろしいですか？",
        updated: "この情報でプロジェクトを更新します。\nよろしいですか？"
    },

    save : function(o){
        if (!o || !o.target) return false;
        var confirm_message;
        switch (o.target.id){
            case 'btn_add_project':
                confirm_message = this.messages.created;
                break;
            case 'btn_edit_project':
                confirm_message = this.messages.updated;
                break;
        }

        // 期間前後チェック
        var between_valid = fncBackToForth(this.form_start_date.getRawValue(), this.form_delivery_date.getRawValue());
        if (!between_valid) {
            alert('期間が正しくありません。');
            return false;
        }

        // 入力チェック
        if (!this.validate() || !confirm(confirm_message)) return false;

		form = document.edit_project_form;
		form.submit();
    },

    onEmailFieldAdd : function(area_id){
        this.members_cnt += 1;
        var cnt = this.members_cnt;
        var field = '<div id="email_pro_inp_'+ cnt +'">' +
                    '<input id="users_' + cnt + '" maxlength="256" name="users[]" size="256" style="width:212px;ime-mode:disabled;margin-bottom:2px;" class ="members_field" type="text" />' +
                    '&nbsp;' +
                    '<a href="#" onclick="$page.onEmailFieldRemove(\'email_pro_inp_' + cnt + '\'); return false;"><span >削除</span>&nbsp;</a>' +
                    '</div>' ;
        // アドレス追加用テキストフィールドの追加
        var obj = Ext.get(area_id);
        obj.insertHtml('beforeEnd', field);

        var id = 'users_'+ cnt;
        this.set_member_event(id);
    },

    onEmailFieldRemove : function(span_id){
        //アドレス追加テキストフィールドの削除
        var elm = Ext.get(span_id) ;
        elm.remove();
        this.members_cnt -= 1;

        // 参加メンバー
        this.members = [];
        var elms = Ext.query( 'input.members_field' ) ;
        for( var i=0 ; i<elms.length ; i++ ){
            var e = elms[i] ;
            this.set_member_event(e.id);
        }
    },

    loaded: function()
    {
    }
}

Motto.extend(App.ProjectsEdit, Page);
window.$page = $page = new App.ProjectsEdit();

})(jQuery, Motto);
