/**
 * @author admin
 */
;(function($, $mo) {

App.AccountEdit = function() {
    App.AccountEdit.superclass.constructor.call(this);
}

App.AccountEdit.prototype = {

    initialize: function() {
        $mo.fire('created_page');

        this.set_events();
        this.set_elements();
    },

    set_events : function()
    {
		// 変更ボタンクリックイベント設定
        $('#btn_save').click($mo.scope(this, this.save));
    },

    set_elements: function()
    {
        // @TODO: ダイアログ内のフォームエレメントの初期化処理
        var ef = Ext.form;
        var m  = 'user'  + '_';

        // お名前
        this.form_user_name         = new ef.TextField({ applyTo: m+'user_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         allowBlank:false, blankText: 'お名前は必須です。',
                                                         msgTarget: 'title'
                                                       });
        // メールアドレス
        this.form_email             = new ef.TextField({ applyTo: m+'email', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         allowBlank:false, blankText: 'メールアドレスは必須です。', vtype: 'email', vtypeText: 'メールアドレスの形式は不正です。',
                                                         msgTarget: 'title'
                                                       });
        // パスワード
        this.form_srcpassword       = new ef.TextField({ applyTo: m+'srcpassword', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         allowBlank:false, blankText: 'パスワードは必須です。',
                                                         msgTarget: 'title'
                                                       });
        // 氏名
        this.form_name              = new ef.TextField({ applyTo: m+'name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title'
                                                       });
        // 生年月日
        this.form_birthday          = new ef.DateField({ applyTo: m+'birthday', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         invalidText: '生年月日が不正です',
                                                         msgTarget: 'title', format: "Y-m-d"
                                                       });
        // 組織
        this.form_company_name      = new ef.TextField({ applyTo: m+'company_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title'
                                                       });
        // 部署名
        this.form_section_name      = new ef.TextField({ applyTo: m+'section_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title'
                                                       });
        // 郵便番号
        this.form_zip               = new ef.TextField({ applyTo: m+'zip', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title', maxLength: 8
                                                       });
        // 都道府県
        this.form_prefecture        = new ef.TextField({ applyTo: m+'prefecture', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title', maxLength: 10
                                                       });
        // 住所１
        this.form_address1          = new ef.TextField({ applyTo: m+'address1', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title'
                                                       });
        // 住所２
        this.form_address2          = new ef.TextField({ applyTo: m+'address2', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title'
                                                       });
        // 電話番号
        this.form_tel               = new ef.TextField({ applyTo: m+'tel', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title', maxLength: 14
                                                       });
        // FAX番号
        this.form_fax               = new ef.TextField({ applyTo: m+'fax', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title', maxLength: 14
                                                       });
        // スカイプID
        this.form_skype_id          = new ef.TextField({ applyTo: m+'skype_id', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                         msgTarget: 'title'
                                                       });

        //チェックイベント
        set_invalid_event(this.form_user_name);
        set_invalid_event(this.form_email);
        set_invalid_event(this.form_srcpassword);
        set_invalid_event(this.form_birthday);
    },

    validate: function() {
        // @TODO: 入力チェック
        var rtn = ( this.form_user_name.validate() &&
                    this.form_email.validate() &&
                    this.form_srcpassword.validate() &&
                    this.form_birthday.validate()
                  );
        return rtn ? true : false;
    },

    // messaage
    messages: {
        updated: "この情報でアカウントを更新します。\nよろしいですか？"
    },

    save : function(o){
        var confirm_message = this.messages.updated;

        // 入力チェック
        if (!this.validate() || !confirm(confirm_message)) return false;

		form = document.account_form;
		form.submit();
    },

    loaded: function()
    {
    }
}

Motto.extend(App.AccountEdit, Page);
window.$page = $page = new App.AccountEdit();

})(jQuery, Motto);
