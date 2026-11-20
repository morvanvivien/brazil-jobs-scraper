// Minimal example: run the brazil-jobs-scraper Actor and print one line per job posting.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
    keywords: 'desenvolvedor',
    location: 'São Paulo',
    maxItems: 100,
};

// 1024 MB is enough for this Actor and keeps the start fee low.
const run = await client.actor('bibian/brazil-jobs-scraper').call(input, { memory: 1024 });
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} job postings`);
for (const job of items) {
    const salary = job.salaryMin
        ? `${job.salaryMin}-${job.salaryMax ?? '?'} ${job.salaryCurrency}/${job.salaryPeriod}`
        : 'salary not stated';
    console.log(`${job.title} | ${job.companyName} | ${job.city} | ${salary} | ${job.source}`);
}
