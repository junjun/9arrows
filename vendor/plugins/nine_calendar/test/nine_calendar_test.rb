# -*- coding: utf-8 -*-
require 'test/unit'

require 'date'
require 'nine_calendar'

class NineCalendarTest < Test::Unit::TestCase
  
  def setup
    s = Date.new(2008, 10, 1)
    e = Date.today
    @cal = NineCalendar.new(s, e)
  end

  def test_get_weekdays_en
    @cal.locale = :en
    ws = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', "Sat"]
    weekdays = []
    7.times do |w|
      weekdays.push(@cal.weekday(w))
    end
    assert_equal weekdays, ws
  end

  def test_get_weekdays_ja
    @cal.locale = :ja

    ws = ['日', '月', '火', '水', '木', '金', '土']
    weekdays = []
    7.times do |w|
      weekdays.push(@cal.weekday(w))
    end
    assert_equal weekdays, ws
  end


  def test_days
    assert_equal 32, @cal.days.size
  end

  def test_get
    date = Date.new(2008, 10, 11)
    d = @cal.get(date.strftime('%Y-%m-%d'))
    assert_equal date, d.date
  end
end
