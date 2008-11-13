require 'active_record/fixtures'

class InsertMstTptasks < ActiveRecord::Migration
  def self.up
    Fixtures.create_fixtures('test/fixtures', :mst_tptasks)
  end

  def self.down
  end
end
