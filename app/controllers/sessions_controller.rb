# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  skip_before_filter :login_required
  skip_before_filter :prepared_project_info

  # render new.rhtml
  def new
  end

  def show
    # render new.html.erb
    render :action => 'new'
  end

  def create
    self.current_user = User.authenticate(params[:login_id], params[:srcpassword])
    if current_user
=begin
    if logged_in?
      if params[:remember_me] == "1"
        current_user.remember_me unless current_user.remember_token?
        cookies[:auth_token] = { :value => self.current_user.remember_token , :expires => self.current_user.remember_token_expires_at }
      end
      flash[:notice]  = "Login successful"
=end
      redirect_to :controller => "projects", :action => "index"
    else
      render :action => 'new'
    end
  end

  def destroy
#    self.current_user.forget_me if logged_in?
#    cookies.delete :auth_token
#    reset_session
    self.current_user = nil
    flash[:notice] = "You have been logged out."
    render :action => 'new'
  end
end
