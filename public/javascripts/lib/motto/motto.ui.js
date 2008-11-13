/**
 * @author updoor
 */

;(function(Motto) {

/**
 * Motto UI
 */
Motto.ui = {};

/**
 * Motto UI Dialog
 * Extension Ext.ModalDialog
 */
Motto.ui.Dialog = function(config) {
    Motto.ui.Dialog.superclass.constructor.call(this);
    // 初期化パラメータ設定
    if (config != null) { Motto.apply(this, config); }
};
Motto.ui.Dialog.prototype = {
    dialog    : null,// ダイアログオブジェクト
    width     : 450,// ダイアログ幅
    //height  : 400,// ダイアログ高さ
    container : "",// コンテナエレメントのID
    load_url  : '',// ダイアログhtmlのurl
    anim_target_id : null,// 表示・消去時のアニメーションのベースとなるエレメント


    after_load: true,
    load_mask: null,
    is_first: true,
    with_open: false,

    _initialize: function() {
        Motto.ui.Dialog.superclass._initialize.call(this);
        this.load_mask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading Dialog ..."});
        if (!this.after_load) {
            this.loadDialog();
        }
    },

    /**
     * ダイアログの遅延読み込み
     */
    loadDialog: function() {
        if (this.load_url != '') {
            var area_id   = this.container + '_area';
            var area_path = '#' + area_id;
            if (typeof $(area_path).attr('id') == 'undefined') {
                var div = document.createElement('div');
                $('body').append(div);
                $(div).attr('id', area_id).addClass('dialog_area');
                this.load_mask.show();
                $(div).load(this.load_url, null, Motto.scope(this, this.afterLoadedDialog));
            }
        }
    },

    afterLoadedDialog: function() {
        this.load_mask.hide();
        this.is_first = false;
        this.loadedDialog();
        if (this.with_open === true) {
            this.fncShowDialog.apply(this, this.tmp_arguments);
        }
    },

    is_loaded: function() {
        var dialog_id   = this.container;
        var dialog_path = '#' + dialog_id;
        return (typeof $(dialog_path).attr('id') == 'undefined') ? false : true;
    },


    open: function() {
        var is_loaded = this.is_loaded();
        if (!is_loaded) {
            this.is_first  = true;
            this.with_open = true;
            this.tmp_arguments = arguments;
            this.loadDialog();
        } else {
            this.fncShowDialog.apply(this, arguments);
        }
    },
    close: function() {
        this.dialog.hide();
    },
    loaded: function() {},


    fncShowDialog : function (config) {
        var is_loaded = this.is_loaded();
        if (!is_loaded) return false;

        // 初期化パラメータ設定
        if( config != null){
            Motto.apply(this, config);
        }
        if( this.dialog == null ){
            // 初回のみダイアログオブジェクト生成
            this._fncCreateDialog();
            this.fncReset();
        } else {
            // 再表示時はリセット処理
            this.fncReset();
        }
        // anim_target_idが指定されている場合は、アニメーションターゲット指定
        var base_elm_dom = null ;
        if( this.anim_target_id != null ){        
            var base_elm = Ext.get(this.anim_target_id) ;
            base_elm_dom = base_elm.dom ;
        }
        // ダイアログ表示
        this.dialog.x = undefined  ;
        this.dialog.y = undefined  ;
        this.dialog.show(base_elm_dom);

        return false ;
    },

    /*==================================================
     * 関数名：fncReset
     * 概　要：ダイアログ内容をリセットする（初期表示時、再表示時に呼び出される）
     * 引　数：なし
     * 戻り値：なし
     ==================================================*/
    fncReset: function() {},

    /**
     * fncCreateDialog
     * コンテナエレメントに対して、ダイアログオブジェクトを生成する
     * （初期表示時に呼び出される）
     */
    _fncCreateDialog : function(){
        this.dialog = new Ext.Window({ 
            el:         this.container ,
            modal:      true,
            width:      this.width,
            height:     this.height,
            shadow:     true,
            minWidth:   this.width,
            minHeight:  this.height,
            resizable:  false,
            closeAction:'hide'
        });
        // イベント設定(下記以外に必要なイベントは、サブクラスにて実装)
        this.dialog.addListener('beforehide', this.onBeforeHide, this, true);
        this.dialog.addListener('beforeshow', this.onBeforeShow, this, true);
        this.dialog.addListener('hide', this.onHide, this, true);
        this.dialog.addListener('keydown', this.onKeyDown, this, true);
        this.dialog.addListener('move', this.onMove, this, true);
        this.dialog.addListener('resize', this.onResize, this, true);
        this.dialog.addListener('show', this.onShow, this, true);
    },


    /**
     * fncGetAttribute
     * 属性値を取得する
     * @param attr_name String 属性名
     * @return this[attr_name]
     ==================================================*/
    fncGetAttribute : function(attr_name) {
        switch(attr_name) {
            case 'width':
            case 'height':
            case 'container':
            case 'anim_target_id':
                return this[attr_name];
                break ;
            default :
                return false ;
                break ;
        }
    },
    attr: this.fncGetAttribute,
    
    onBeforeHide : function (dlg) {},
    onBeforeShow : function (dlg) {},
    onHide : function (dlg) {},
    onKeyDown : function (dlg, e) {},
    onMove : function (dlg, x, y) {},
    onResize : function (dlg, width, height) {},
    onShow : function (dlg) {}
}
Motto.extend(Motto.ui.Dialog, Motto.Page);


})(Motto);