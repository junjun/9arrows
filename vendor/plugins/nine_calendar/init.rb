# Include hook code here
require_dependency 'nine_calendar'

ActionController::Base.class_eval do
  private
  def init_calendar(from, to)
    return NineCalendar.new(from, to)
  end
end
