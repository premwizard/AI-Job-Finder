import smtplib
from collections import defaultdict
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, List

from src.config import (EMAIL, EMAIL_PASSWORD, RECEIVER_EMAIL, SMTP_PORT,
                        SMTP_SERVER)


def send_job_email(jobs: List[Dict]):
    if not jobs:
        print("No new jobs to send.")
        return

    # Validate that secrets exist
    if not EMAIL or not EMAIL_PASSWORD:
        print(
            "ERROR: Email credentials missing! Please set EMAIL and EMAIL_PASSWORD secrets in GitHub Actions."
        )
        return

    if not RECEIVER_EMAIL:
        print(
            "ERROR: RECEIVER_EMAIL is missing (and EMAIL is also empty). Cannot send email."
        )
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"AI Job Finder: {len(jobs)} New Fresher Jobs Today!"
    msg["From"] = EMAIL
    msg["To"] = RECEIVER_EMAIL

    # Group jobs by category
    grouped_jobs = defaultdict(list)
    for job in jobs:
        cat = job.get("category", "Other")
        grouped_jobs[cat].append(job)

    # Create HTML content
    html_content = """
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 700px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          h2.title { color: #333; text-align: center; }
          h3.category { color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 5px; margin-top: 30px; }
          .job-card { border-bottom: 1px solid #eee; padding: 15px 0; }
          .job-card:last-child { border-bottom: none; }
          .job-title { font-size: 16px; color: #333; margin: 0 0 5px 0; font-weight: bold; }
          .company { color: #555; }
          .details { color: #777; font-size: 13px; margin-bottom: 10px; }
          .apply-btn { display: inline-block; padding: 6px 12px; background: #28a745; color: #fff; text-decoration: none; border-radius: 4px; font-size: 14px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="title">Daily Fresher Job Matches</h2>
    """

    for category, cat_jobs in sorted(grouped_jobs.items()):
        # Sort jobs within category by highest score
        cat_jobs.sort(key=lambda x: x.get("score", 0), reverse=True)

        html_content += f"<h3 class='category'>{category} ({len(cat_jobs)})</h3>\n"
        for job in cat_jobs:
            score = job.get("score", 0)
            html_content += f"""
              <div class="job-card">
                <p class="job-title">{job["role"]} <span style="color: #28a745; font-size: 14px;">[Score: {score}]</span></p>
                <p class="company">🏢 {job["company"]} <span style="font-size: 12px; color: #888;">(via {job["source"]})</span></p>
                <p class="details">📍 {job["location"]} | 📅 {job["date_posted"]}</p>
                <a href="{job["apply_link"]}" class="apply-btn">Apply Now</a>
              </div>
            """

    html_content += """
        </div>
        <div class="footer">
          <p>Automated by AI Job Finder V2.</p>
        </div>
      </body>
    </html>
    """

    msg.attach(MIMEText(html_content, "html"))

    try:
        # Use port 587 and starttls for standard Gmail SMTP security
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.login(EMAIL, EMAIL_PASSWORD)
        server.sendmail(EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        print("SUCCESS: Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_weekly_email(weekly_stats: List[Dict]):
    if not EMAIL or not EMAIL_PASSWORD or not RECEIVER_EMAIL:
        print("ERROR: Email credentials missing. Cannot send weekly summary.")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "AI Job Finder: Weekly Analytics Report"
    msg["From"] = EMAIL
    msg["To"] = RECEIVER_EMAIL

    total_raw = sum(day.get("raw_jobs", 0) for day in weekly_stats)
    total_new = sum(day.get("new_jobs", 0) for day in weekly_stats)
    days_run = len(weekly_stats)

    html_content = f"""
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
          .container {{ max-width: 700px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
          h2.title {{ color: #333; text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px; }}
          .stat-box {{ background: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 5px solid #28a745; }}
          .stat-title {{ font-size: 14px; color: #555; text-transform: uppercase; }}
          .stat-value {{ font-size: 24px; font-weight: bold; color: #333; }}
          .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #999; }}
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="title">Weekly Analytics Report</h2>
          <p>Here is your system's performance over the last {days_run} days:</p>
          
          <div class="stat-box">
            <div class="stat-title">Total Raw Jobs Fetched</div>
            <div class="stat-value">{total_raw}</div>
          </div>
          
          <div class="stat-box">
            <div class="stat-title">Perfect Matches Sent</div>
            <div class="stat-value">{total_new}</div>
          </div>
          
          <div class="stat-box">
            <div class="stat-title">Noise Filtered</div>
            <div class="stat-value">{total_raw - total_new}</div>
          </div>
        </div>
        <div class="footer">
          <p>Automated by AI Job Finder V3.1.</p>
        </div>
      </body>
    </html>
    """

    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.login(EMAIL, EMAIL_PASSWORD)
        server.sendmail(EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        print("SUCCESS: Weekly Summary Email sent successfully!")
    except Exception as e:
        print(f"Failed to send weekly email: {e}")
