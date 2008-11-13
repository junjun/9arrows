class ConfirmsController < ApplicationController

  def new
    respond_to do |f|
      f.html { render :partial => 'dialog_new' }
      f.json { render :json => new_item }
    end
  end

  def show
    dlg_confirm
  end

  def dlg_confirm
    id = params[:id]#projectcomp.id
    if my_item?(id)
      o = {
        :include => [:dat_task]
      }
      comp = DatProjectcomp.find(id, o)
      o2 = {
        :order   => 'report_date DESC, id DESC'
      }
      dat_histories = comp.dat_task.dat_taskhistories.find(:all, o2)

      histories = dat_histories.map do |h|
        attr = h.attributes
        attr['content']       = h.content.gsub(/(\r\n|\r|\n)/, '') if h.content
        attr['report_date']   = format_date_year(h.report_date)
        attr['progress_rate'] = app_localized_message(:label, attr['msg_code'])
        attr['report_user']   = h.update_user.user_name ||= h.update_user.email
        attr
      end
      task = comp.dat_task
      comp_attr = comp.attributes
      task_attr = task.attributes
      task_attr['complete_date'] = format_date_year(task.complete_date)
      task_attr['report_date']   = format_date_year(task.report_date)
      task_attr['progress_rate'] = app_localized_message(:label, 'progress_rate_' + task.progress_rate.to_s)
      r = {:comp => comp_attr, :task => task_attr, :histories => histories}
      render :text => result_for_json(true, '', r)
    else
      render :text => result_for_json(false, 'Permission Denied', {})
    end
  end

  private
  def format_date_year(date)
    if date
      today = Date.today
      format =  today.year == date.year ? '%m/%d' : '%Y/%m/%d'
      date.strftime(format)
    end
  end

end
