class CreateDatEvents < ActiveRecord::Migration
  def self.up
    create_table :dat_events do |t|
      t.integer  "project_tree_id",                                  :null => false
      t.date     "start_date"
      t.time     "start_time"
      t.date     "end_date"
      t.time     "end_time"
      t.integer  "allday_kbn",                        :default => 1
      t.string   "place",              :limit => 100
      t.text     "content"
      t.integer  "create_user_id",                                   :null => false
      t.datetime "created_on",                                       :null => false
      t.integer  "update_user_id",                                   :null => false
      t.datetime "updated_on",                                       :null => false
      t.integer  "last_operation_kbn"
    end
  end

  def self.down
    drop_table :dat_events
  end
end
