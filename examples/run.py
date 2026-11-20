"""Minimal example: run the brazil-jobs-scraper Actor and print one line per job posting.

Usage: APIFY_TOKEN=... python run.py   (pip install apify-client)
"""
import os
import sys

from apify_client import ApifyClient

token = os.environ.get("APIFY_TOKEN")
if not token:
    sys.exit("Set the APIFY_TOKEN environment variable first.")

client = ApifyClient(token)

run_input = {
    "keywords": "desenvolvedor",
    "location": "São Paulo",
    "maxItems": 100,
}

# 1024 MB is enough for this Actor and keeps the start fee low.
run = client.actor("bibian/brazil-jobs-scraper").call(run_input=run_input, memory_mbytes=1024)

count = 0
for job in client.dataset(run.default_dataset_id).iterate_items():
    count += 1
    if job.get("salaryMin"):
        salary = f"{job['salaryMin']}-{job.get('salaryMax') or '?'} {job['salaryCurrency']}/{job['salaryPeriod']}"
    else:
        salary = "salary not stated"
    print(f"{job['title']} | {job['companyName']} | {job['city']} | {salary} | {job['source']}")
print(f"{count} job postings")
