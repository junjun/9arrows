class CreateDatTaskhistories < ActiveRecord::Migration
  def self.up
    create_table :dat_taskhistories do |t|
      t.integer  "task_id",                      :null => false
      t.string   "msg_code",       :limit => 20, :null => false
      t.text     "content",                      :null => false
      t.date     "report_date"
      t.integer  "update_user_id",               :null => false
      t.datetime "updated_on",                   :null => false
    end
  end

  def self.down
    drop_table :dat_taskhistories
  end
end
