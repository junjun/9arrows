class MembersController < ApplicationController

  def new
    respond_to do |f|
      f.html { render :partial => 'dialog_new' }
    end
  end


end
