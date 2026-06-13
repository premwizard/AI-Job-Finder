import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Dict
from src.config import SMTP_EMAIL, SMTP_PASSWORD, RECEIVER_EMAIL, SMTP_SERVER, SMTP_PORT

def send_job_email(jobs: List[Dict]):
    if not jobs:
        print("No new jobs to send.")
        return

    if not SMTP_EMAIL or not SMTP_PASSWORD or not RECEIVER_EMAIL:
        print("SMTP configuration missing. Cannot send email.")
        return

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"AI Job Finder: {len(jobs)} New Jobs Today!"
    msg['From'] = SMTP_EMAIL
    msg['To'] = RECEIVER_EMAIL

    # Create HTML content
    html_content = """
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          h2 { color: #333; text-align: center; }
          .job-card { border-bottom: 1px solid #ddd; padding: 15px 0; }
          .job-card:last-child { border-bottom: none; }
          .job-title { font-size: 18px; color: #0056b3; margin: 0 0 5px 0; }
          .company { font-weight: bold; color: #555; }
          .details { color: #777; font-size: 14px; margin-bottom: 10px; }
          .apply-btn { display: inline-block; padding: 8px 15px; background: #28a745; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Daily Job Matches</h2>
    """

    for job in jobs:
        html_content += f"""
          <div class="job-card">
            <p class="job-title">{job['role']}</p>
            <p class="company">{job['company']} <span style="font-size: 12px; color: #888;">(via {job['source']})</span></p>
            <p class="details">📍 {job['location']} | 📅 {job['date_posted']}</p>
            <a href="{job['apply_link']}" class="apply-btn">Apply Now</a>
          </div>
        """

    html_content += """
        </div>
        <div class="footer">
          <p>Automated by AI Job Finder.</p>
        </div>
      </body>
    </html>
    """

    msg.attach(MIMEText(html_content, 'html'))

    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
