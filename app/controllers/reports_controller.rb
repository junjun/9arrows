class ReportsController < ApplicationController

  def new
    respond_to do |f|
      f.html { render :partial => 'dialog_new' }
      f.json { render :json => new_item }
    end
  end

  def create
    session_user_id = @current_user.id

    #-----------------------------
    # 登録済みオブジェクトを取得
    #-----------------------------
    report_params = params[:dlg_tsk_report_task]
    comp_id = report_params[:id]

    r = false
    message = ''
    result  = {}
    if my_item?(comp_id)
      o = {:include => :dat_task}
      comp = DatProjectcomp.find(comp_id, o)

      last_operation_kbn, rate = report_params[:progres_kbn].to_i == 1 ? [3, 10] : [1, report_params[:progress_rate]]
      rate = 'progress_rate_' + rate
      # update projectcomp
      comp.update_user_id     = session_user_id
      comp.last_operation_kbn = last_operation_kbn
      # update task
      report_params.delete(:id)
      task = comp.dat_task
      task.attributes         = report_params
      task.update_user_id     = session_user_id
      task.last_operation_kbn = last_operation_kbn
      
      if comp.save && task.save
        p = {
          :task_id        => task.id,
          :msg_code       => rate,
          :report_date    => report_params[:report_date],
          :content        => report_params[:memo],
          :update_user_id => session_user_id
        }
        history = DatTaskhistory.new(p)
        unless history.save
          message = error_message_to_string(history)
        else
          r = true
          result = {:resulthtml => ''}
        end
      else
        message = error_message_to_string(comp)
      end
    else
      message = 'Permission Denied'
    end

    respond_to do |f|
      f.html { redirect_to :action => index }
      f.json { render :text => result_for_json(r, message, result)}
    end
  end


end
