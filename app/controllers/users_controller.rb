class UsersController < ApplicationController
  skip_before_filter :login_required
  skip_before_filter :prepared_project_info

  # render new.rhtml
  def new
  end

  def create
    cookies.delete :auth_token
    # protects against session fixation attacks, wreaks havoc with 
    # request forgery protection.
    # uncomment at your own risk
    # reset_session
    @user = User.new(params[:user])
    @user.save
    if @user.errors.empty?
      self.current_user = @user
      flash[:notice] = "Thanks for signing up!"
      redirect_to :controller => "projects", :action => "index"
    else
      render :action => 'new'
    end
  end

end
