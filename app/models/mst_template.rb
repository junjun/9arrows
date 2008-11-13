class MstTemplate < ActiveRecord::Base

  #########################
  # 関連定義
  #########################
  # テンプレート構成マスタを所有する(1:多)
  has_many :mst_compositions, :foreign_key => "template_id", :dependent=>:destroy

end
