
module Messages

  ###########################################################
  # メソッド：loadMessage
  # 概　　要：ローカライズ用テーブルデータ(多言語データ）を読み込み、
  #           ハッシュに格納する
  # 引　　数：なし
  # 戻 り 値：なし
  ###########################################################
  def loadMessage
    # 取得対象カラムの判定
    lang  = 'jp'
    langs = [:jp, :en, :cn]
    lang  = langs.include?(lang.intern) ? lang : 'base'
    
    select     = " id,msg_code,msg_kbn,msg_#{lang.to_s} as msg "
    conditions = " valid_flg = 1 "
    # 検索実施
    opt = {
      :select     => select,
      :conditions => conditions
    }
    @app_messages = MstMessage.find(:all, opt)

    #-----------------------------
    # 区分、コードをキーにハッシュへ格納
    #-----------------------------
    @app_messages_hash = Hash.new
    for app_message in @app_messages
      msg_kbn = case app_message.msg_kbn
                when 1 then :label   # ラベル
                when 2 then :confirm # 確認メッセージ
                when 3 then :error   # エラーメッセージ
                else        :other   # その他
                end
      # ローカライズ用ハッシュへ格納
      @app_messages_hash[msg_kbn.to_s + "_" + app_message.msg_code] = app_message.attributes
    end
  end

end
