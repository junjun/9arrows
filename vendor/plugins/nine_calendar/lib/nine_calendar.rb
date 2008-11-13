# -*- coding: utf-8 -*-
# NineCalendar

class NineCalendar

  WEEKDAYS = { 
    :en => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    :ja => ['日', '月', '火', '水', '木', '金', '土'],
  }

  attr_accessor :locale, :weekdays, :days

  def initialize(from_date=nil, to_date=nil)
    @from = from_date
    @to   = to_date
    @locale ||= :en

    @weekdays = []
    @days = []
  end

  def weekday(w)
    init_weekdays() unless @weekdays.size > 0
    str = @weekdays[w]
  end

  def days
    init_days() unless @days.size > 0
    @days
  end

  def get(date_str)
    day = nil
    date = Date.parse(date_str)
    days.each do |d|
      if d.date == date
        day = d
        break
      end
    end
    day
  end

  private
  def init_weekdays
    @weekdays = []
    7.times do |w|
      str = WEEKDAYS[@locale][w]
      @weekdays.push(str)
    end
  end

  def init_days
    @days = []
    from, to = prepare_days
    (from .. to).each do |d|
      fill = (d < @from || d > @to) ? true : false
      @days.push(Day.new(d, fill))
    end
    @days
  end

  def prepare_days
    from = @from - @from.wday
    to   = @to + (7 - (@to.wday + 1))
    return from, to
  end

  class Day
    attr_accessor :date
    def initialize(date, fill=false)
      @date = date
      @is_fill = fill
      init_date
    end

    def show
      format = month_first? ? '%m/%d' : '%d'
      @date.strftime(format)
    end

    def css_class
      css_class = ''
      css_class << ' first sun' if week_first?
      css_class << ' last sat' if week_last?
      css_class << ' date_fill' if fill?
      css_class
    end

    def fill?
      @is_fill
    end
    
    def month_first?
      @date.day == 1 ? true : false
    end

    def week_first?
      @date.wday == 0 ? true : false
    end

    def week_last?
      @date.wday == 6 ? true : false
    end
    
    private
    def init_date
      
    end
  end
end
