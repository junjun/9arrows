module AppFormHelper

=begin
	###########################################################
	# メソッド：date_field
	# 概　　要：日付ピックアップダイアログのアイコンを持つ
	#					 日付入力フィールドのタグを出力する
	# 引　　数：object_name	 インスタンス名
	#					 method				属性名
	#					 options			 オプションハッシュ
	# 戻 り 値：日付入力フィールドタグ文字列
	###########################################################
	def date_field(object_name, method, options = {})
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var df = new Ext.form.DateField({format:"Y-m-d", id:"' + (object_name.to_s+'_'+method.to_s) + '"}); df.applyToMarkup("' + (object_name.to_s+'_'+method.to_s) + '") ; });' + "\n" 
		end

		return '<span class="app_component_parent">' + text_field( object_name, method, options, false ) + '</span>'
	end

	###########################################################
	# メソッド：date_field_tag
	# 概　　要：日付ピックアップダイアログのアイコンを持つ
	#					 日付入力フィールドのタグを出力する
	# 引　　数：name			 エレメント名
	#					 value			値
	#					 options		オプションハッシュ
	# 戻 り 値：日付入力フィールドタグ文字列
	###########################################################
	def date_field_tag(name, value = nil, options = {})
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var df = new Ext.form.DateField({format:"Y-m-d", id:"' + (name.to_s) + '"}); df.applyToMarkup("' + (name.to_s) + '") ; });' + "\n" 
		end

		return '<span class="app_component_parent">' + text_field_tag( name, value, options, false ) + '</span>'
	end

	###########################################################
	# メソッド：text_field
	# 概　　要：テキストフィールドのタグを出力する
	# 引　　数：object_name	 インスタンス名
	#					 method				属性名
	#					 options			 オプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：テキストフィールドタグ文字列
	###########################################################
	def text_field(object_name, method, options = {}, ext=true)
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.TextField({id:"'+ (object_name.to_s+'_'+method.to_s) +'"}); cmp.applyToMarkup("'+ (object_name.to_s+'_'+method.to_s) +'") ; });' + "\n"
		end
		return '<span class="app_component_parent">' + super( object_name, method, options ) + '</span>'
	end

	###########################################################
	# メソッド：text_field_tag
	# 概　　要：テキストフィールドのタグを出力する
	# 引　　数：name			 エレメント名
	#					 value			値
	#					 options		オプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：日付入力フィールドタグ文字列
	###########################################################
	def text_field_tag(name, value = nil, options = {}, ext=true)
		content_for(:for_ext_scripts) do
			tmp_name = (options[:id]) ? options[:id] : name
      'Ext.onReady(function(){ var cmp = new Ext.form.TextField({id:"'+ (tmp_name.to_s) +'"}); cmp.applyToMarkup("'+ (tmp_name.to_s) +'") ; });'
		end

		return '<span class="app_component_parent">' + super( name, value, options ) + '</span>'
	end

	###########################################################
	# メソッド：password_field
	# 概　　要：パスワードフィールドのタグを出力する
	# 引　　数：object_name	 インスタンス名
	#					 method				属性名
	#					 options			 オプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：テキストフィールドタグ文字列
	###########################################################
	def password_field(object_name, method, options = {}, ext=true)
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.TextField({id:"'+ (object_name.to_s+'_'+method.to_s) +'"}); cmp.applyToMarkup("'+ (object_name.to_s+'_'+method.to_s) +'") ; });' + "\n"
		end
		return '<span class="app_component_parent">' + super( object_name, method, options ) + '</span>'
	end

	###########################################################
	# メソッド：text_area_tag
	# 概　　要：テキストフィールドのタグを出力する
	# 引　　数：name			 エレメント名
	#					 value			値
	#					 options		オプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：日付入力フィールドタグ文字列
	###########################################################
	def text_area_tag(name, value = nil, options = {}, ext=true)
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.TextArea({id:"'+ (name.to_s) +'"}); cmp.applyToMarkup("'+ (name.to_s) +'") ; });'
		end

		return '<span class="app_component_parent">' + super( name, value, options ) + '</span>'
	end

	###########################################################
	# メソッド：text_field
	# 概　　要：テキストフィールドのタグを出力する
	# 引　　数：object_name	 インスタンス名
	#					 method				属性名
	#					 options			 オプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：テキストフィールドタグ文字列
	###########################################################
	def text_area(object_name, method, options = {}, ext=true)
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.TextArea({id:"'+ (object_name.to_s+'_'+method.to_s) +'"}); cmp.applyToMarkup("'+ (object_name.to_s+'_'+method.to_s) +'") ; });' + "\n"
		end
		return '<span class="app_component_parent">' + super( object_name, method, options ) + '</span>'
	end

	###########################################################
	# メソッド：number_text_field
	# 概　　要：数値入力用テキストフィールドのタグを出力する
	# 引　　数：object_name	 インスタンス名
	#					 method				属性名
	#					 options			 オプションハッシュ
	# 戻 り 値：数値入力用テキストフィールドタグ文字列
	###########################################################
	def number_text_field(object_name, method, options = {})
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.NumberField({id:"'+ (object_name.to_s+'_'+method.to_s) +'", allowDecimals:false, validateOnBlur:false, allowNegative:false}); cmp.applyToMarkup("'+ (object_name.to_s+'_'+method.to_s) +'") ; });'
		end
		return '<span class="app_component_parent">' + text_field( object_name, method, options, false ) + '</span>'
	end
	
	###########################################################
	# メソッド：number_text_field_tag
	# 概　　要：数値入力用テキストフィールドのタグを出力する
	# 引　　数：name			 エレメント名
	#					 value			値
	#					 options		オプションハッシュ
	# 戻 り 値：日付入力フィールドタグ文字列
	###########################################################
	def number_text_field_tag(name, value = nil, options = {})
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.NumberField({id:"'+ (name.to_s) +'", allowDecimals:false, validateOnBlur:false, allowNegative:false}); cmp.applyToMarkup("'+ (name.to_s) +'") ; });'
		end
		return '<span class="app_component_parent">' + text_field_tag( name, value, options, false ) + '</span>'
	end
	
	###########################################################
	# メソッド：check_box
	# 概　　要：チェックボックスのタグを出力する
	# 引　　数：object_name			 インスタンス名
	#					 method						属性名
	#					 options					 オプションハッシュ
	#					 checked_value		 チェック時の値
	#					 unchecked_value	 非チェック時の値
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：チェックボックスタグ文字列
	###########################################################
	def check_box(object_name, method, options = {}, checked_value = "1", unchecked_value = "0", ext=true)
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.Checkbox({id:"'+ (object_name.to_s+'_'+method.to_s) +'"}); cmp.applyToMarkup("'+ (object_name.to_s+'_'+method.to_s) +'") ; });'
		end
		return '<span class="app_component_parent">' + super( object_name, method, options, checked_value, unchecked_value ) + '</span>'
	end

	###########################################################
	# メソッド：check_box_tag
	# 概　　要：チェックボックスのタグを出力する
	# 引　　数：name			 エレメント名
	#					 value			値
	#					 checked		チェックフラグ
	#					 options		オプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：日付入力フィールドタグ文字列
	###########################################################
	def check_box_tag(name, value = "1", checked = false, options = {}, ext=true)
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.Checkbox({id:"'+ (name.to_s) +'"}); cmp.applyToMarkup("'+ (name.to_s) +'") ; });'
		end

		return '<span class="app_component_parent">' + super( name, value, checked, options ) + '</span>'
	end

	###########################################################
	# メソッド：select
	# 概　　要：選択プルダウンのタグを出力する
	# 引　　数：object_name	 インスタンス名
	#					 method				属性名
	#					 choices			 オプションデータハッシュ
	#					 options			 オプションハッシュ
	#					 html_options	HTMLオプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：選択プルダウンタグ文字列
	###########################################################
	def select(object, method, choices, options = {}, html_options = {}, ext=true)
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cb = new Ext.form.ComboBox({editable:false, transform:"'+ (object.to_s+'_'+method.to_s) +'", hiddenId:"'+ (object.to_s+'_'+method.to_s) +'", id:"'+ (object.to_s+'_'+method.to_s) +'", typeAhead: true, triggerAction: "all", forceSelection:true, defaultAutoCreate : {tag: "input", type: "text", autocomplete: "off", style :"'+html_options[:style].to_s+'" }}); });'
		end
		return '<span class="app_component_parent">' + super( object, method, choices, options, html_options ) + '</span>'
	end

	###########################################################
	# メソッド：select_tag
	# 概　　要：選択プルダウンのタグを出力する
	# 引　　数：name			 エレメント名
	#					 option_tags オプションタグ文字列
	#					 options		オプションハッシュ
	#					 ext					 Ext使用（true:使用する、false:使用しない）
	# 戻 り 値：選択プルダウンタグ文字列
	###########################################################
	def select_tag(name, option_tags = nil, options = {}, ext=true)
		option_tags = "<option value=\"\"></option>\n" + option_tags if options[:include_blank]
		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cb = new Ext.form.ComboBox({editable:false, transform:"'+ (name.to_s) +'", hiddenId:"'+ (name.to_s) +'", id:"'+ (name.to_s) +'", typeAhead: true, triggerAction: "all", forceSelection:true, defaultAutoCreate : {tag: "input", type: "text", autocomplete: "off", style :"'+options[:style].to_s+'" }}); });'
		end
		return '<span class="app_component_parent">' + super( name, option_tags, options ) + '</span>'
	end

	###########################################################
	# メソッド：select_combo
	# 概　　要：選択コンボボックスのタグを出力する
	# 引　　数：object_name	 インスタンス名
	#					 method				属性名
	#					 choices			 オプションデータハッシュ
	#					 options			 オプションハッシュ
	#					 html_options	HTMLオプションハッシュ
	# 戻 り 値：選択コンボボックスタグ文字列
	###########################################################
	def select_combo(object, method, choices, options = {}, html_options = {}, item_width = nil)
		listWidth = ""
		unless item_width.blank?
			listWidth = "listWidth : " + item_width.to_s + ", "
		end
		return '<span class="app_component_parent">' + select( object, method, choices, options, html_options, false ) + '</span>'
	end

	###########################################################
	# メソッド：select_combo_tag
	# 概　　要：選択コンボボックスのタグを出力する
	# 引　　数：name			 エレメント名
	#					 option_tags オプションタグ文字列
	#					 options		オプションハッシュ
	# 戻 り 値：選択コンボボックスタグ文字列
	###########################################################
	def select_combo_tag(name, option_tags = nil, options = {}, item_width = nil)
		listWidth = ""
		unless item_width.blank?
			listWidth = "listWidth : " + item_width.to_s + ", "
		end
		return '<span class="app_component_parent">' + select_tag( name, option_tags, options, false ) + '</span>'
	end

	###########################################################
	# メソッド：time_text_field
	# 概　　要：時刻入力フィールドのタグを出力する
	# 引　　数：variable	 インスタンス名
	#					 attribute	属性名
	#					 options		オプションハッシュ
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

		content_for(:for_ext_scripts) do
			'Ext.onReady(function(){ var cmp = new Ext.form.TextField({id:"'+ (variable.to_s+'_'+attribute.to_s) +'_4i"}); cmp.applyToMarkup("'+ (variable.to_s+'_'+attribute.to_s) +'_4i") ; });' + "\n" + 
			'Ext.onReady(function(){ var cmp = new Ext.form.TextField({id:"'+ (variable.to_s+'_'+attribute.to_s) +'_5i"}); cmp.applyToMarkup("'+ (variable.to_s+'_'+attribute.to_s) +'_5i") ; });' + "\n"
		end

		return "<input type='hidden' id='#{variable}_#{attribute}_1i' name='#{variable}[#{attribute}(1i)]' value='#{year}'>" +
		"<input type='hidden' id='#{variable}_#{attribute}_2i' name='#{variable}[#{attribute}(2i)]' value='#{month}'>" +
		"<input type='hidden' id='#{variable}_#{attribute}_3i' name='#{variable}[#{attribute}(3i)]' value='#{day}'>" +
		"<input type='text' id='#{variable}_#{attribute}_4i' name='#{variable}[#{attribute}(4i)]' value='#{hour}' style='width:30px;ime-mode:disabled;' maxlength='2'> ： " +
		"<input type='text' id='#{variable}_#{attribute}_5i' name='#{variable}[#{attribute}(5i)]' value='#{minute}' style='width:30px;ime-mode:disabled;' maxlength='2'>"

	end
=end

end