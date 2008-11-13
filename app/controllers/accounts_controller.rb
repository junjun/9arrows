class AccountsController < ApplicationController

  def show
    edit
    render :action => 'edit'
  end

  def edit
    @user = @current_user
  end

  def update
    @user = MstUser.find(@current_user.id)
    @user.attributes = params[:user]
    begin
      @user.save!
      redirect_to account_path
    rescue RecordValid => error
      render :action => 'edit'
    end
  end
end
