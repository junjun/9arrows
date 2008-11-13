class EnvController < ApplicationController
  skip_before_filter :login_required
  skip_before_filter :prepared_project_info

  def index
    format   = params[:format]
    base_url = url_for(:controller => '').gsub(/\/env/, '')
    case format
    when 'js' then
      js = "url_for=function(path){ return '#{base_url}/' + path };"
      js << "var authenticity_token = '" + form_authenticity_token + "';"
      js << "var app_messages_hash = " + @app_messages_hash.to_json + ";"
      js << "app_localized_message = function(msg_kbn, msg_code) { return app_messages_hash[msg_kbn + '_' + msg_code].msg || '' };"

      render(:text => js)
    end

  end

end
