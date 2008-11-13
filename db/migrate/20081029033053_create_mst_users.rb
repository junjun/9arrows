class CreateMstUsers < ActiveRecord::Migration
  def self.up
    create_table :mst_users do |t|
      t.string   "login_id"
      t.string   "password",                                     :null => false
      t.string   "user_name",                                    :null => false
      t.string   "email",                                        :null => false
      t.string   "name"
      t.integer  "sex"
      t.date     "birthday"
      t.string   "company_name",   :limit => 60
      t.string   "section_name",   :limit => 60
      t.string   "zip",            :limit => 8
      t.string   "prefecture",     :limit => 10
      t.string   "address1",       :limit => 100
      t.string   "address2",       :limit => 100
      t.string   "tel",            :limit => 14
      t.string   "fax",            :limit => 14
      t.date     "start_date"
      t.date     "expire_date"
      t.integer  "valid_flg",                     :default => 1, :null => false
      t.integer  "create_user_id"
      t.datetime "created_on",                                   :null => false
      t.integer  "update_user_id"
      t.datetime "updated_on",                                   :null => false
      t.string   "srcpassword"
      t.string   "skype_id"
      t.datetime "last_login_on"
    end
  end

  def self.down
    drop_table :mst_users
  end
end
