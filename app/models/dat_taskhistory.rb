class DatTaskhistory < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # タスクデータに所有される(1:多)
  belongs_to :dat_task
  belongs_to :update_user, :class_name => 'MstUser', :foreign_key => 'update_user_id'

end
