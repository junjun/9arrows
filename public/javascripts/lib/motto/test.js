/**
 * @author admin
 */
;(function($mo, $) {

Page = function() {
    Page.superclass.constructor.call(this);
}
Page.prototype = {
    initialize: function() {
        
    }
}
$mo.extend(Page, Motto.Page);
$mo.connect('load', function(t, t2) { alert(t + t2); }, null, ['loaded test args', 'Kamito']);

$page = new Page();


$(document).ready(function() {
    $mo.fire('load');
})

})(Motto, jQuery);



