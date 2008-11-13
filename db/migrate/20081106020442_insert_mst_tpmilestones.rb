require 'active_record/fixtures'

class InsertMstTpmilestones < ActiveRecord::Migration
  def self.up
    Fixtures.create_fixtures('test/fixtures', :mst_tpmilestones)
  end

  def self.down
  end
end
