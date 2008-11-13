class CreateMstTptasks < ActiveRecord::Migration
  def self.up
    create_table :mst_tptasks do |t|
      t.integer  "template_tree_id",                  :null => false
      t.float    "plan_power",       :default => 0.0
      t.integer  "tani_kbn",         :default => 2
      t.text     "memo"
      t.integer  "create_user_id",   :default => 2,   :null => false
      t.datetime "created_on",                        :null => false
      t.integer  "update_user_id",                    :null => false
      t.datetime "updated_on",                        :null => false
    end
  end

  def self.down
    drop_table :mst_tptasks
  end
end
