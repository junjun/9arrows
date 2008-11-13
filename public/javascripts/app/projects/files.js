/**
 * @author admin
 */
;(function($, $mo) {

App.ProjectsFiles = function() {
    App.ProjectsFiles.superclass.constructor.call(this);
}

App.ProjectsFiles.prototype = {
    initialize: function() {

        // grid
		var p_cd   = Ext.get('current_project_project_cd').dom.value;
		var p_name = Ext.get('current_project_project_name').dom.value;

        $('#files_grid').projects_files_grid(p_cd, p_name);

        components.projects.folder_edit_dialog(p_cd);
        components.projects.file_edit_dialog(p_cd);

        $mo.fire('created_page');
    },

    loaded: function()
    {
    }
}

Motto.extend(App.ProjectsFiles, Page);
window.$page = $page = new App.ProjectsFiles();

})(jQuery, Motto);
