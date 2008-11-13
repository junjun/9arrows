module TasksHelper

  ###########################################################
  # メソッド：select_for_projects
  # 概　　要：参加可能なプロジェクトのSELECTタグを出力する
  # 引　　数：variable        インスタンス名
  #           attribute       属性名
  #           projectcomp     プロジェクト構成インスタンス
  #           projects        プロジェクトインスタンス
  #           options         オプションハッシュ
  #           html_options    HTMLオプションハッシュ
  # 戻 り 値：状況文字列
  ###########################################################
  def select_for_projects(variable, attribute, projectcomp, projects, options, html_options)
    if projectcomp.id.nil? || projectcomp.id == ""
      # 新規プロジェクト構成データの場合は
      # プロジェクト選択プルダウンを出力
      collection_select( variable, attribute, 
                         projects, 
                         :id, :project_name, 
                         options, html_options )
    else
      # 基準となるプロジェクト構成データが指定されている場合は
      # プロジェクトは決定しているため、ラベル出力
      '<span>' + projectcomp.dat_project.project_name + '</span>' +
      hidden_field( variable, attribute )
    end
  end

  ###########################################################
  # メソッド：select_for_taskusers
  # 概　　要：タスクに参加可能なユーザーのSELECTタグを出力する
  # 引　　数：variable        インスタンス名
  #           attribute       属性名
  #           options         オプションハッシュ
  #           html_options    HTMLオプションハッシュ
  # 戻 り 値：状況文字列
  ###########################################################
  def select_for_taskusers(variable, attribute, options, html_options)
    # ユーザー一覧のプルダウンを出力
    insobj = instance_variable_get("@#{variable}")
    if insobj == nil
      select( variable, attribute,
              {},
              options, html_options)
    end

  end

  ###########################################################
  # メソッド：list_for_taskusers
  # 概　　要：タスクに参加可能なユーザー情報を
  #           SELECTタグへの選択オプションへ渡せるリスト形式にて返す
  # 引　　数：task_id    タスクID
  # 戻 り 値：選択オプション配列
  ###########################################################
  def list_for_taskusers(task_id)
    # ユーザー一覧のプルダウンを出力
    choises = Array.new
    if task_id.nil?
      # タスクIDが指定されていない場合は、空の配列を返す
      choises = choises
    else
      # タスクIDが指定されていない場合は、空の配列を返す
      users = DatTaskuser.find(:all,
                                  :conditions=>["task_id = ?", task_id],
                                  :include=>[{:dat_projectuser=>:mst_user}])
      choises = users.map{
                            |u| [(u.dat_projectuser.mst_user.nil? ? u.dat_projectuser.email : u.dat_projectuser.mst_user.user_name), u.projectuser_id]
                          }
    end

    return choises
  end
  

  ###########################################################
  # メソッド：object_for_taskusers
  # 概　　要：タスクに参加可能なユーザー情報を
  #           列名をキーとしたハッシュ形式の配列で返す
  # 引　　数：task_id    タスクID
  # 戻 り 値：選択オプション配列
  ###########################################################
  def object_for_taskusers(task_id)
    # ユーザー一覧のプルダウンを出力
    objects = Array.new
    if task_id.nil?
      # タスクIDが指定されていない場合は、空の配列を返す
      objects = objects
    else
      # タスクIDが指定されていない場合は、空の配列を返す
      users = DatTaskuser.find(:all,
                                  :conditions=>["task_id = ?", task_id],
                                  :include=>[{:dat_projectuser=>:mst_user}])
      objects = users.map{
                            |u| {:user_name=>(u.dat_projectuser.nil? ? '' : (u.dat_projectuser.mst_user.nil? ? u.dat_projectuser.email : u.dat_projectuser.mst_user.user_name) ), :projectuser_id=>u.projectuser_id}
                          }
    end

    return objects
  end

end
