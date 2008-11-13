class CreateMstMessages < ActiveRecord::Migration
  def self.up
    create_table :mst_messages do |t|
      t.string   "msg_code",                      :null => false
      t.integer  "msg_kbn",                       :null => false
      t.text     "msg_base",                      :null => false
      t.text     "msg_jp",                        :null => false
      t.text     "msg_cn",                        :null => false
      t.text     "msg_en",                        :null => false
      t.integer  "valid_flg",      :default => 1, :null => false
      t.integer  "create_user_id"
      t.datetime "created_on",                    :null => false
      t.integer  "update_user_id"
      t.datetime "updated_on",                    :null => false
    end
  end

  def self.down
    drop_table :mst_messages
  end
end
