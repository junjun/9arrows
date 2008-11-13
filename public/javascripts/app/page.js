/**
 * @author admin
 */

Motto.namespace('App');

;(function($mo, $) {

$mo.namespace('Page');

Page = function() {
    Page.superclass.constructor.call(this);
}
Page.prototype = {
    set_signals: function() {
        $mo.connect('load', this.loaded, this);
    },

    // interface
    initialize: function() {},
    loaded: function() {}
}
$mo.extend(Page, $mo.Page);

/**
 * application start
 */
$(document).ready(function() {
//    $('#system_menu').system_menu();
//    $('#main_menu').main_menu();
    
    $mo.fire('load');
});

})(Motto, jQuery)

