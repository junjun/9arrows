class FoldersController < ApplicationController

  def index
    respond_to do |f|
      f.html # render index.html.erb
      f.json { render :json => json_for_folders() }
    end
  end

  def new
    respond_to do |f|
      f.html { render :partial => 'dialog_new' }
      f.json { render :json => new_item }
    end
  end

  def create
    project_id   = @current_project.id
    parent_node  = params[:dlg_dir_edit_parent_node] || ''
    dir_name     = params[:dlg_dir_edit_dir_name] || ''

    # パラメータチェック
    if project_id == "" || parent_node == "" || dir_name == ""
      message = "新規フォルダエラー"
      render :text => result_for_json(false, message, {})
      return
    end

    iconv = Iconv.new($FILESYSTEM_ENCODING, $SYSTEM_ENCODING)
    # パスの取得    
    rootpath = get_project_files_root(project_id)
    target_path = rootpath + iconv.iconv(parent_node)

    # ファイル名の取得
    dname = iconv.iconv( dir_name )
    fulldname = target_path + dname

    # ファイル名存在チェック
    if FileTest.exist?(fulldname)
      message = "# 同名エラー"
      render :text => result_for_json(false, message, {})
      return
    end

    if fulldname != ""
      FileUtils.mkdir_p(fulldname)
    end

    respond_to do |f|
      f.html { redirect_to :action => index }
      f.json { render :text => result_for_json(true, '', {})}
    end
  end

  def update
    project_id = @current_project.id

	target_file = params[:dlg_dir_edit_target_file] || ''
    dir_name = params[:dlg_dir_edit_dir_name] || ''

    # パスの取得    
    rootpath = get_project_files_root(project_id)

	end_s = (rootpath + target_file).rindex("/")
	target_path = (rootpath + target_file).slice(0, end_s + 1)

	File.rename(rootpath + target_file, target_path + dir_name)

    respond_to do |f|
      f.html { redirect_to :action => index }
      f.json { render :text => result_for_json(true, '', {})}
    end
  end

  def destroy
    project_id = @current_project.id

    target_file = params[:dlg_dir_edit_target_file]

    iconv = Iconv.new($FILESYSTEM_ENCODING, $SYSTEM_ENCODING)
    rootpath = get_project_files_root(project_id)
    fullfname = rootpath + target_file

    fullfname = iconv.iconv(fullfname)
    if fullfname != ""
        if File.ftype(fullfname) == "directory"
          entries = Dir.entries(fullfname)
          if entries.length > 2
            message = app_localized_message(:error, :entry_file_exists)
            render :text => result_for_json(false, message, {})
            return
          else
            Dir.rmdir(fullfname)
          end
        else
          File.delete(fullfname)
        end
    end

    respond_to do |f|
      f.html { redirect_to :action => index }
      f.json { render :text => result_for_json(true, '', {})}
    end

  end

  private

  def json_for_folders
    project_id = @current_project.id

    rootpath = get_project_files_root(project_id)
    @files = get_dir_list(rootpath + params[:node].to_s, params[:node])
    @files.to_json

  end

  def get_dir_list(path, parentnode)
    list = []
    iconv = Iconv.new($SYSTEM_ENCODING, $FILESYSTEM_ENCODING)
    iconv2 = Iconv.new($FILESYSTEM_ENCODING, $SYSTEM_ENCODING)
    path_conv = iconv2.iconv(path)
    parentnode_conv = iconv2.iconv(parentnode)

    Dir.foreach(path_conv) do |f|
      next if f == "."
      next if f == ".."
      ftype = File.ftype(path_conv + f)
      next if ftype != "directory"
      entries = Dir.entries(path_conv + f)

      list.push({
        :text => iconv.iconv(f),
        :id => parentnode + iconv.iconv(f) + "/",
        :leaf => false, #entries.length==2 ? true : false,
        :cls => "folder"
      })
    end

    list
  end

  def new_item
  end



end
