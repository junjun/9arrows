class FilesController < ApplicationController

  def index
    respond_to do |f|
      f.html # render index.html.erb
      f.json { render :json => json_for_files() }
    end
  end

  def new
    respond_to do |f|
      f.html { render :partial => 'dialog_new' }
      f.json { render :json => new_item }
    end
  end

  def show
    project_id = @current_project.id
    parent_node = params[:projectfile_download_parent_node] || ''
    target_file = params[:projectfile_download_target_file] || ''
    browser_ie = params[:projectfile_download_browser_ie] || ''

    iconv = Iconv.new($FILESYSTEM_ENCODING, $SYSTEM_ENCODING)
    rootpath = get_project_files_root(project_id)

    fname = target_file
    fname = iconv.iconv(fname)
    fullfname = rootpath + fname

    fname = File.basename(fname)
    if browser_ie == "1"
      iconv = Iconv.new("SHIFT_JIS", $FILESYSTEM_ENCODING)
      fname = iconv.iconv(fname)
    else
      iconv = Iconv.new($SYSTEM_ENCODING, $FILESYSTEM_ENCODING)
      fname = iconv.iconv(fname)
    end

    send_file fullfname, :filename => fname
  end

  def create
    if !params[:update_flg]
      render :text => check
    else
      render :text => update
    end
  end

  def check
    project_id = @current_project.id
    parent_node = params[:dlg_fil_upload_parent_node] || ''
    upload_file_name = params[:dlg_fil_upload_upload_file_name] || ''

    iconv = Iconv.new($FILESYSTEM_ENCODING, $SYSTEM_ENCODING)
    # パスの取得    
    rootpath = get_project_files_root(project_id)
    target_path = rootpath + iconv.iconv(parent_node)

    # ファイル名の取得
    fname = iconv.iconv( File.basename(upload_file_name) )
    fullfname = target_path + fname
    # ファイル名存在チェック
    if FileTest.exist?(fullfname)
      # 上書き確認
      message = app_localized_message(:confirm, :file_already_exist)
      return result_for_json(true, message, {})
    else
      return update
    end
  end

  def update
    project_id = @current_project.id
    parent_node = params[:dlg_fil_upload_parent_node] || ''

    iconv = Iconv.new($FILESYSTEM_ENCODING, $SYSTEM_ENCODING)
    rootpath = get_project_files_root(project_id)
    target_path = rootpath + iconv.iconv(parent_node)

    file = params[:dlg_fil_upload_upload_file]
    fname = file.original_filename
    fname = iconv.iconv(fname)
    fullfname = target_path + fname

    if fullfname != ""
      if FileTest.exist?(fullfname)
        File.delete(fullfname)
      end
      File.open(fullfname, "wb"){ |f| f.write(file.read) }
    end

    return result_for_json(true, '', {})

  end

  def destroy
    project_id = @current_project.id

    target_file = params[:file_target_file]

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

  def json_for_files
    project_id = @current_project.id

    rootpath = get_project_files_root(project_id)
    @files = get_file_list(rootpath + params[:node].to_s, params[:node])
    @files.to_json

  end

  def get_file_list(path, parentnode)
    list = []
    iconv = Iconv.new($SYSTEM_ENCODING, $FILESYSTEM_ENCODING)
    iconv2 = Iconv.new($FILESYSTEM_ENCODING, $SYSTEM_ENCODING)
    path_conv = iconv2.iconv(path)
    parentnode_conv = iconv2.iconv(parentnode)

    Dir.foreach(path_conv) do |f|
      next if f == "."
      next if f == ".."

      fstat = File::Stat.new(path_conv + f) 

      list.push({
        :id => parentnode + iconv.iconv(f) ,
        :fname => iconv.iconv(f),
        :ftype => fstat.ftype,
        :size => fstat.size,
        :mtime => fstat.mtime,
        :mode => fstat.mode
     })
    end

    list

  end

  def new_item
  end

end
