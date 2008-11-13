#
#= アプリケーションメーラー
#
#サインアップ完了通知・招待・プロジェクト召集のメールを送信する。
#
class AppMailer < Iso2022jpMailer

  helper ApplicationHelper


  #
  #=== サインアップ完了メールを送信する
  #
  #
  def mail_signup_confirm( user, info )
    recipients user.email
    subject NKF.nkf('-j', info[:subject])
    from ActionMailer::Base.smtp_settings[:app_default_from]
    body :user=>user, :info=>info
  end


  #
  #=== 招待メールを送信する
  #
  #
  def mail_invite(user, info)
    recipients user.email
    subject NKF.nkf('-j', info[:subject])
    from ActionMailer::Base.smtp_settings[:app_default_from]
    body :user=>user, :info=>info
  end


  #
  #=== プロジェクト召集メールを送信する
  #
  #
  def mail_invite_project(user, info)
    recipients user.email
    subject NKF.nkf('-j', info[:subject])
    from ActionMailer::Base.smtp_settings[:app_default_from]
    body :user=>user, :info=>info
  end


  #
  #=== テストメールを送信する
  #
  #
  def mail_test( to, plan )
    recipients ""
    subject "テストメール"
    from ActionMailer::Base.smtp_settings[:app_default_from]
  end
end
