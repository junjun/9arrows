require 'digest/sha1'
class User < ActiveRecord::Base
  set_table_name 'mst_users'

  # Virtual attribute for the unencrypted password
  # attr_accessor :password

  before_save :encrypt_password
  
  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  attr_accessible :login_id, :srcpassword, :user_name, :email

  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(login_id, srcpassword)
    u = find_by_login_id(login_id) # need to get the salt
    u && u.authenticated?(srcpassword) ? u : nil
  end

  # Encrypts some data with the salt.
  def self.encrypt(srcpassword)#, salt)
    Digest::SHA1.hexdigest("change-me--#{srcpassword}--")
  end

  # Encrypts the password with the user salt
  def encrypt(srcpassword)
    self.class.encrypt(srcpassword)#, salt)
  end

  def authenticated?(srcpassword)
    password == encrypt(srcpassword)
  end

  def remember_token?
    remember_token_expires_at && Time.now.utc < remember_token_expires_at 
  end

  # These create and unset the fields required for remembering users between browser closes
  def remember_me
    remember_me_for 2.weeks
  end

  def remember_me_for(time)
    remember_me_until time.from_now.utc
  end

  def remember_me_until(time)
    self.remember_token_expires_at = time
    self.remember_token            = encrypt("#{email}--#{remember_token_expires_at}")
    save(false)
  end

  def forget_me
    # self.remember_token_expires_at = nil
    # self.remember_token            = nil
    # save(false)
  end

  # Returns true if the user has just been activated.
  def recently_activated?
    @activated
  end

  protected
    # before filter 
    def encrypt_password
      return if srcpassword.blank?
      # self.salt = Digest::SHA1.hexdigest("--#{Time.now.to_s}--#{login}--") if new_record?
      self.password = encrypt(srcpassword)
    end
      
    def password_required?
      password.blank? || !password.blank?
    end
    
    
end
