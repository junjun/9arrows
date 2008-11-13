module Result

  #
  #指定されたパラメータの内容でJSONデータを生成して返す
  #_success_ :: 処理結果(true:成功、false:失敗)をBoolean型で指定します
  #_message_ :: messageデータに渡すメッセージを指定します
  #_result_ :: resultというキーで生成されるデータが表示されます，結果情報ハッシュデータを指定します
  #
  #戻り値:: JSONデータ
  #
  def result_for_json(success, message, result)
    ret = {
      :success => success,
      :message => message,
      :result  => result
    }
    return ret.to_json
  end

end
