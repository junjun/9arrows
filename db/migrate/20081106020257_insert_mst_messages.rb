require 'active_record/fixtures'

class InsertMstMessages < ActiveRecord::Migration
  def self.up
    Fixtures.create_fixtures('test/fixtures', :mst_messages)
  end

  def self.down
  end
end
