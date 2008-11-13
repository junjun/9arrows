class MstUser < ActiveRecord::Base

  # projects
  has_many :dat_projectusers, :foreign_key => 'user_id', :dependent => :destroy
  has_many :dat_projects, :class_name => 'DatProject', :through => :dat_projectusers


  def my_active_projects()
    opt = {
      :conditions => ["valid_flg = ? AND dat_projectusers.active_flg = ?", 1, 1],
      :include    => [:dat_projectusers]
    }
    dat_projects.find(:all, opt)
  end
end
