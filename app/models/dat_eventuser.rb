class DatEventuser < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # イベントデータに所有される(1:多)
  belongs_to :dat_event, :foreign_key=>"event_id"

  # プロジェクトユーザーデータに所有される(1:多)
  belongs_to :dat_projectuser, :foreign_key=>"projectuser_id"

end
