class CreateDatTasks < ActiveRecord::Migration
  def self.up
    create_table :dat_tasks do |t|
      t.integer  "project_tree_id",                     :null => false
      t.integer  "priority_kbn",       :default => 2,   :null => false
      t.float    "plan_power",         :default => 0.0, :null => false
      t.float    "fcas_power",         :default => 0.0
      t.float    "exp_power",          :default => 0.0
      t.integer  "tani_kbn",           :default => 2
      t.integer  "client_user_id"
      t.integer  "main_user_id"
      t.date     "complete_date"
      t.integer  "progress_kbn",       :default => 0
      t.integer  "progress_rate",      :default => 0
      t.text     "memo"
      t.integer  "create_user_id"
      t.datetime "created_on"
      t.integer  "update_user_id",                      :null => false
      t.datetime "updated_on",                          :null => false
      t.string   "task_cd"
      t.date     "start_date"
      t.date     "end_date"
      t.date     "report_date"
      t.text     "result"
      t.integer  "last_operation_kbn"
    end
  end

  def self.down
    drop_table :dat_tasks
  end
end
