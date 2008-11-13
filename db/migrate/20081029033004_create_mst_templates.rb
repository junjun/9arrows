class CreateMstTemplates < ActiveRecord::Migration
  def self.up
    create_table :mst_templates do |t|
      t.string   "type_name",      :limit => 40
      t.string   "template_name",  :limit => 100,                :null => false
      t.text     "memo"
      t.integer  "valid_flg",                     :default => 1, :null => false
      t.integer  "create_user_id",                               :null => false
      t.datetime "created_on",                                   :null => false
      t.integer  "update_user_id",                               :null => false
      t.datetime "updated_on",                                   :null => false
    end
  end

  def self.down
    drop_table :mst_templates
  end
end
