import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config.config import EMAIL, EMAIL_PASSWORD, SMTP_SERVER, SMTP_PORT

def send_password_reset_email(to_email: str, reset_link: str, otp: str):
    # Always print for development and debugging
    print(f"[DEV] Reset Link: {reset_link}")
    print(f"[DEV] OTP: {otp}")

    if not EMAIL or not EMAIL_PASSWORD:
        print("Email configuration is missing. Cannot send email.")
        return

    subject = "AI Job Finder - Password Reset Request"
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">AI Job Finder</h2>
        <h3>Reset Your Password</h3>
        <p>We received a request to reset your password. Click the button below to proceed.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{reset_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        
        <p>You will also need the following Verification Code:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 6px; margin: 20px 0;">
          {otp}
        </div>
        
        <p style="color: #dc2626; font-size: 14px;"><strong>This link and code will expire in 10 minutes.</strong></p>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you didn't request this, you can safely ignore this email. Your password will not be changed.<br>
          For support, contact support@aijobfinder.com
        </p>
      </body>
    </html>
    """
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"AI Job Finder <{EMAIL}>"
    msg["To"] = to_email
    
    msg.attach(MIMEText(html_content, "html"))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")

def send_verification_email(to_email: str, verification_link: str):
    # Always print for development and debugging
    print(f"[DEV] Verification Link: {verification_link}")

    if not EMAIL or not EMAIL_PASSWORD:
        print("Email configuration is missing. Cannot send verification email.")
        return

    subject = "AI Job Finder - Verify Your Email Address"
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">AI Job Finder</h2>
        <h3>Welcome!</h3>
        <p>Please verify your email address by clicking the button below to unlock all platform features.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{verification_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        
        <p style="color: #dc2626; font-size: 14px;"><strong>This verification link expires in 24 hours.</strong></p>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you didn't create this account, you can safely ignore this email.<br>
          For support, contact support@aijobfinder.com
        </p>
      </body>
    </html>
    """
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"AI Job Finder <{EMAIL}>"
    msg["To"] = to_email
    
    msg.attach(MIMEText(html_content, "html"))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Failed to send verification email to {to_email}: {str(e)}")

def send_password_change_otp_email(to_email: str, otp: str):
    print(f"[DEV] Password Change OTP: {otp}")

    if not EMAIL or not EMAIL_PASSWORD:
        print("Email configuration is missing. Cannot send email.")
        return

    subject = "AI Job Finder - Confirm Password Change"
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">AI Job Finder</h2>
        <h3>Confirm Password Change</h3>
        <p>Hello,</p>
        <p>We received a request to change your password.</p>
        
        <p>Verification Code:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 6px; margin: 20px 0;">
          {otp}
        </div>
        
        <p style="color: #dc2626; font-size: 14px;"><strong>This code expires in 10 minutes.</strong></p>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you did not request this change, please ignore this email. Your password will remain the same.<br>
          For support, contact support@aijobfinder.com
        </p>
      </body>
    </html>
    """
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"AI Job Finder <{EMAIL}>"
    msg["To"] = to_email
    
    msg.attach(MIMEText(html_content, "html"))
    
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Failed to send password change email to {to_email}: {str(e)}")

def send_account_deletion_otp_email(to_email: str, otp: str):
    print(f"[DEV] Account Deletion OTP: {otp}")

    if not EMAIL or not EMAIL_PASSWORD:
        print("Email configuration is missing. Cannot send email.")
        return

    subject = "AI Job Finder - Confirm Account Deletion"

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">AI Job Finder</h2>
        <h3>Confirm Account Deletion</h3>
        <p>Hello,</p>
        <p>We received a request to <strong>permanently delete</strong> your AI Job Finder account.</p>
        <p>This will remove your profile, saved jobs, applications, resume, and AI history.</p>

        <p>Verification Code:</p>
        <div style="background-color: #fef2f2; border: 2px solid #dc2626; padding: 15px; text-align: center; font-size: 28px; letter-spacing: 8px; font-weight: bold; border-radius: 6px; margin: 20px 0; color: #dc2626;">
          {otp}
        </div>

        <p style="color: #dc2626; font-size: 14px;"><strong>This code expires in 10 minutes.</strong></p>

        <p style="font-size: 14px; color: #6b7280; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you did not request this, your account is safe. Please ignore this email or contact support immediately.<br>
          For support, contact support@aijobfinder.com
        </p>
      </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"AI Job Finder <{EMAIL}>"
    msg["To"] = to_email

    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Failed to send account deletion email to {to_email}: {str(e)}")
