# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  include ApplicationHelper

  # See ActionController::RequestForgeryProtection for details
  # Uncomment the :secret if you're not using the cookie session store
  # protect_from_forgery # :secret => '9a090f5225cfb83d1f6370e0cc865ac0'
  
  # See ActionController::Base for details 
  # Uncomment this to filter the contents of submitted sensitive data parameters
  # from your application log (in this case, all fields with names like "password"). 
  # filter_parameter_logging :password

  # Authentiation
  include AuthenticatedSystem
  before_filter :login_required

  # Project
  include Projects
  before_filter :prepared_project_info

  # フィルタ定義
  include Messages
  before_filter :loadMessage  # ローカライズ処理実施

  # データ返す構造
  include Result

end
