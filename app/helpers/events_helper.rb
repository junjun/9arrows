module EventsHelper

  ###########################################################
  # メソッド：select_for_eventusers
  # 概　　要：イベントに参加可能なユーザーのSELECTタグを出力する
  # 引　　数：variable        インスタンス名
  #           attribute       属性名
  #           options         オプションハッシュ
  #           html_options    HTMLオプションハッシュ
  # 戻 り 値：状況文字列
  ###########################################################
  def select_for_eventusers(variable, attribute, options, html_options)
    # ユーザー一覧のプルダウンを出力
    insobj = instance_variable_get("@#{variable}")
    if insobj == nil
      select( variable, attribute, {}, options, html_options)
    end

  end


  ###########################################################
  # メソッド：list_for_eventusers
  # 概　　要：イベントに参加可能なユーザー情報を
  #           SELECTタグへの選択オプションへ渡せるリスト形式にて返す
  # 引　　数：event_id    イベントID
  # 戻 り 値：選択オプション配列
  ###########################################################
  def list_for_eventusers(event_id)
    # ユーザー一覧のプルダウンを出力
    choises = Array.new
    if event_id.nil?
      choises = choises
    else
      users = DatEventuser.find(:all,
                                  :conditions=>["event_id = ?", event_id],
                                  :include=>[{:dat_projectuser=>:mst_user}])
      choises = users.map{
                            |u| [(u.dat_projectuser.mst_user.nil? ? u.dat_projectuser.email : u.dat_projectuser.mst_user.user_name), u.projectuser_id]
                          }
    end

    return choises
  end


  ###########################################################
  # メソッド：object_for_eventusers
  # 概　　要：イベントに参加可能なユーザー情報を
  #           列名をキーとしたハッシュ形式の配列で返す
  # 引　　数：event_id    イベントID
  # 戻 り 値：選択オプション配列
  ###########################################################
  def object_for_eventusers(event_id)
    # ユーザー一覧のプルダウンを出力
    objects = Array.new
    if event_id.nil?
      # イベントIDが指定されていない場合は、空の配列を返す
      objects = objects
    else
      # イベントIDが指定されていない場合は、空の配列を返す
      users = DatEventuser.find(:all,
                                  :conditions=>["event_id = ?", event_id],
                                  :include=>[{:dat_projectuser=>:mst_user}])
      objects = users.map{
                            |u| {:user_name=>(u.dat_projectuser.mst_user.nil? ? u.dat_projectuser.email : u.dat_projectuser.mst_user.user_name), :projectuser_id=>u.projectuser_id}
                          }
    end

    return objects
  end

  ###########################################################
  # メソッド：time_text_field
  # 概　　要：時刻入力フィールドのタグを出力する
  # 引　　数：variable   インスタンス名
  #           attribute  属性名
  #           options    オプションハッシュ
  # 戻 り 値：時刻選択フィールドタグ
  ###########################################################
  def time_text_field(variable, attribute, options)
    year = Time.now.year.to_s # ダミー値
    month = Time.now.month.to_s # ダミー値
    day = Time.now.day.to_s # ダミー値
    hour = ""
    minute = ""
    if (obj = instance_variable_get("@#{variable}"))
      if ! obj[attribute].nil?
        value = obj[attribute]
        year = value.year.to_s
        month = value.month.to_s
        day = value.day.to_s
        hour = value.hour.to_s
        minute = value.min.to_s
      end
    end

    return "<input type='hidden' id='#{variable}_#{attribute}_1i' name='#{variable}[#{attribute}(1i)]' value='#{year}'>" +
    "<input type='hidden' id='#{variable}_#{attribute}_2i' name='#{variable}[#{attribute}(2i)]' value='#{month}'>" +
    "<input type='hidden' id='#{variable}_#{attribute}_3i' name='#{variable}[#{attribute}(3i)]' value='#{day}'>" +
    "<input type='text' id='#{variable}_#{attribute}_4i' name='#{variable}[#{attribute}(4i)]' value='#{hour}' style='width:30px;ime-mode:disabled;text-align:right;' maxlength='2'> ： " +
    "<input type='text' id='#{variable}_#{attribute}_5i' name='#{variable}[#{attribute}(5i)]' value='#{minute}' style='width:30px;ime-mode:disabled;text-align:right;' maxlength='2'>"

  end


end
