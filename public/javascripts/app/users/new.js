/**
 * @author admin
 */
;(function($, $mo) {

App.UsersNew = function() {
    App.UsersNew.superclass.constructor.call(this);
}

App.UsersNew.prototype = {
    initialize: function() {
        this.set_events();
        this.set_elements();
    },

    set_events : function()
    {
        $('#btn_save').click($mo.scope(this, this.save));
    },

    set_elements: function()
    {
        // @TODO: ダイアログ内のフォームエレメントの初期化処理
        var ef = Ext.form;
        var m = 'user' + '_';

        // Login
        this.form_login_id             = new ef.TextField({ applyTo: m+'login_id', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                            allowBlank:false, blankText: 'Loginは必須です。',
                                                            msgTarget: 'title'
                                                           });
        // Password
        this.form_srcpassword          = new ef.TextField({ applyTo: m+'srcpassword', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                            allowBlank:false, blankText: 'Passwordは必須です。',
                                                            msgTarget: 'title'
                                                           });
        // Name
        this.form_user_name            = new ef.TextField({ applyTo: m+'user_name', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                            allowBlank:false, blankText: 'Nameは必須です。',
                                                            msgTarget: 'title'
                                                           });
        // Email
        this.form_email                = new ef.TextField({ applyTo: m+'email', selectOnFocus:true, validateOnBlur:false, validationEvent:false,
                                                            allowBlank:false, blankText: 'Emailは必須です。', vtype: 'email', vtypeText: 'Emailの形式は不正です。',
                                                            msgTarget: 'title'
                                                           });
        //チェックイベント
        this.form_login_id.on    ( 'invalid', invalid_alert, this );
        this.form_srcpassword.on ( 'invalid', invalid_alert, this );
        this.form_user_name.on   ( 'invalid', invalid_alert, this );
        this.form_email.on       ( 'invalid', invalid_alert, this );
    },

    validate: function() {
        // @TODO: 入力チェック
        return ( this.form_login_id.validate() &&
                 this.form_srcpassword.validate() &&
                 this.form_user_name.validate() &&
                 this.form_email.validate()
        ) ? true : false;
    },

    // messaage
    messages: {
        created: "この情報でアカウントを作成します。\nよろしいですか？"
    },

    save : function(){
        var confirm_message = this.messages.created;
        // 入力チェック
        if (!this.validate() || !confirm(confirm_message)) return false;

		form = document.user_form;
		form.submit();
    },

    loaded: function()
    {
    }
}

Motto.extend(App.UsersNew, Page);
window.$page = $page = new App.UsersNew();

})(jQuery, Motto);
