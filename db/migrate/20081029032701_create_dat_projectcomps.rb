class CreateDatProjectcomps < ActiveRecord::Migration
  def self.up
    create_table :dat_projectcomps do |t|
      t.integer  "project_id",         :null => false
      t.integer  "line_no",            :null => false
      t.integer  "task_kbn",           :null => false
      t.string   "item_name",          :null => false
      t.string   "class_word1"
      t.string   "class_word2"
      t.string   "class_word3"
      t.integer  "create_user_id",     :null => false
      t.datetime "created_on",         :null => false
      t.integer  "update_user_id",     :null => false
      t.datetime "updated_on",         :null => false
      t.integer  "last_operation_kbn"
    end
  end

  def self.down
    drop_table :dat_projectcomps
  end
end
