class DatProjectlog < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # プロジェクト構成データに所有される(1:1)
  belongs_to :dat_projectcomp, :foreign_key => "projectcomp_id"

end
