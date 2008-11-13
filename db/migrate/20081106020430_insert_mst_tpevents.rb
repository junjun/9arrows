require 'active_record/fixtures'

class InsertMstTpevents < ActiveRecord::Migration
  def self.up
    Fixtures.create_fixtures('test/fixtures', :mst_tpevents)
  end

  def self.down
  end
end
