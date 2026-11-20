# How to Scrape Brazil Jobs: Vagas.com.br, InfoJobs Brasil and Gupy in One Run (Brazil Jobs API)

> **Run it now, no code: [brazil-jobs-scraper on the Apify Store](https://apify.com/bibian/brazil-jobs-scraper)** &nbsp;|&nbsp; $0.0018 per job posting ($1.80 per 1,000) &nbsp;|&nbsp; no login, no browser required

Brazil has no single job feed: vagas de emprego are spread over Vagas.com.br, InfoJobs Brasil and the career pages that large employers publish on Gupy, each with its own page layout, its own fields and its own duplicates. This guide shows how to get all three in one dataset instead of writing and maintaining three parsers: one search by job title and city, one unified schema (the same field names on every posting), postings that appear on several boards returned once, and the salary whenever the employer states it. It uses a free-to-try Apify Actor, from the console or from code, with no login and no proxy to set up.

Searches this page answers: Brazil jobs scraper, vagas de emprego API, Vagas.com.br scraper, InfoJobs Brasil scraper, Gupy jobs scraper, Brazilian job postings dataset, how to scrape Brazil job boards, job market data Brazil, monitor new vagas daily.

## What you get from the Brazil jobs scraper

- **Three boards in one run.** [Vagas.com.br](https://www.vagas.com.br), [InfoJobs Brasil](https://www.infojobs.com.br) and [Gupy](https://www.gupy.io) (by default the career pages of 40 large employers such as Ambev, Itaú, Localiza, WEG and Vivo), with `source` on every row to filter or split by board.
- **One schema everywhere.** `title`, `companyName`, `city`, `region`, `employmentType`, `remote`, `salaryMin` / `salaryMax` / `salaryPeriod`, `datePosted` and `url` are the same on every posting, whichever site it came from.
- **Filters that work across boards.** `keywords`, `location`, `remote` and `publishedWithinDays` apply the same way to every board, on the site when it has the filter and on the returned postings when it does not.
- **No duplicates.** The same posting listed on several boards is returned once.
- **A daily watch that charges only for what is new.** Tick `onlyNew` and set `publishedWithinDays` to `1`: each scheduled run delivers, and bills, only the postings no earlier run of that search delivered.
- **No contact details.** Lines with an e-mail address, a phone number or a WhatsApp link are removed from the descriptions, and no recruiter or candidate name is read.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five postings from a live run on 20 November 2026, descriptions shortened, no personal data) is in [`sample-output.json`](sample-output.json).

## Output fields

| Field | What it is |
|---|---|
| `id`, `sourceId` | Stable identifier (`<source>:<native id>`), the same from one run to the next, and the id on the source site |
| `url`, `title` | Public page of the posting and the job title as published |
| `companyName`, `companyUrl` | Employer name (`null` when hidden, then `confidentialCompany` is `true`) and its page on the source site, when there is one |
| `locationLabel`, `city`, `region`, `postalCode`, `country` | Location as displayed, split into city, state and postal code (CEP) when given; `country` is `BR` |
| `remote` | `remote`, `hybrid`, `onsite` or `unknown` (read from the board's own data, never guessed) |
| `employmentType` | `full_time`, `part_time`, `contract`, `freelance`, `internship`, `apprenticeship`, `temporary` or `unknown` |
| `salaryMin`, `salaryMax`, `salaryCurrency`, `salaryPeriod` | Salary range as numbers, currency `BRL`, period `hour`, `day`, `month` or `year`; empty when the posting states none |
| `datePosted`, `validThrough` | Publication and expiry dates, ISO 8601 |
| `description` | Plain-text description, when `includeDescriptions` is on (default) |
| `experienceLevel`, `industry`, `skills` | As named by the board, when it gives them |
| `source` | Board the posting came from: `vagas.com.br`, `infojobs.com.br` or `gupy.io` |
| `scrapedAt` | Extraction time, ISO 8601 |

Four real rows from the sample run:

| Title | Company | City | Salary | Source |
|---|---|---|---|---|
| Tech Lead Desenvolvedor Shopify | Econverse | São Paulo | not stated | vagas.com.br |
| Desenvolvedor de Automações e Inteligência Artificial | Don Contabil Assessoria Empresarial | São Paulo | R$ 4,000 to 6,000 / month | infojobs.com.br |
| Analista de Implantação | HS Prevent | São Paulo | R$ 3,700 to 3,850 / month | infojobs.com.br |
| Desenvolvedor Plataforma Digital Consultor | Vivo (Telefônica Brasil) | São Paulo | not stated | gupy.io |

## Use cases

- **Track the Brazilian job market.** Count postings by role, city, contract type or remote policy across three boards without building three pipelines.
- **Salary benchmarks.** Keep the postings that state a range (`salaryMin` not empty) and group by city and role.
- **Recruitment and lead lists.** See which employers are hiring for a role in a city, with links to their postings.
- **Job alerts and aggregators.** Schedule a daily run with `onlyNew` and push the new postings to your site, a spreadsheet or a chat channel.
- **Follow large employers.** The Gupy source reads the career pages of big Brazilian employers by default, or the ones you list in `gupyCompanies`.

## Input

| Field | What it does |
|---|---|
| `keywords` | Job title, skill or trade, for example `desenvolvedor` or `enfermeiro`. Empty means every posting. |
| `location` | Brazilian city or state, for example `São Paulo`, `Curitiba` or `MG`. Empty means no location filter. |
| `sources` | Which boards to query: `vagas`, `infojobsbr`, `gupy`. All three by default. |
| `gupyCompanies` | Gupy only. Employer subdomains to read instead of the built-in 40, for example `ambev` for `ambev.gupy.io` (up to 100). |
| `publishedWithinDays` | Keep only postings published in the last N days. Use `1` for a daily monitoring run. |
| `remote` | `any` (default), `remote`, `hybrid` or `onsite`. |
| `maxItems` | The run stops once this many postings are saved, across all boards combined (default 200). |
| `includeDescriptions` | Add the description as plain text (default on). Turn it off for a faster run when you only need the listing fields. |
| `onlyNew` | For scheduled runs: skip postings an earlier run of this same search already delivered. |

Ready-to-copy inputs.

Developers in São Paulo, all three boards (the default input of the form):

```json
{
  "keywords": "desenvolvedor",
  "location": "São Paulo",
  "maxItems": 100
}
```

A daily watch for new postings, charged only for what is new:

```json
{
  "keywords": "analista de dados",
  "location": "Curitiba",
  "publishedWithinDays": 1,
  "onlyNew": true,
  "maxItems": 200
}
```

Remote engineering roles at four chosen employers on Gupy, listing fields only:

```json
{
  "keywords": "engenheiro",
  "remote": "remote",
  "sources": ["gupy"],
  "gupyCompanies": ["ambev", "weg", "localiza", "vivo"],
  "includeDescriptions": false,
  "maxItems": 300
}
```

## Three ways to use it

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/brazil-jobs-scraper) and click **Try for free** (a free Apify account is enough). The form is already filled with developers in São Paulo.
2. Replace the keywords and the city with yours, then click **Start**.
3. When the run finishes, open the **Output** tab, then **Export** as CSV, Excel or JSON.
4. For a daily watch, open **Schedules**, create a daily schedule for the Actor, and tick `onlyNew` with `publishedWithinDays` set to `1` in the input.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/brazil-jobs-scraper').call({
    keywords: 'desenvolvedor',
    location: 'São Paulo',
    maxItems: 100,
}, { memory: 1024 });

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const job of items) {
    console.log(`${job.title} | ${job.companyName} | ${job.city} | ${job.source}`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later). The `memory: 1024` option runs the Actor with 1 GB, which is enough and keeps the start fee low.

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/brazil-jobs-scraper").call(
    run_input={
        "keywords": "desenvolvedor",
        "location": "São Paulo",
        "maxItems": 100,
    },
    memory_mbytes=1024,
)

for job in client.dataset(run.default_dataset_id).iterate_items():
    print(f"{job['title']} | {job['companyName']} | {job['city']} | {job['source']}")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

## Pricing

Pay per result: **$0.0018 per job posting** ($1.80 per 1,000 postings), plus a start fee of $0.0025 per GB of run memory (so $0.0025 at the 1 GB the examples ask for), with no monthly subscription. These are the free-plan prices; paid Apify plans get lower ones. A run that saves 100 postings costs about $0.18. Apify's free plan includes monthly credits, enough to try it. Prices are those shown on the [Store page](https://apify.com/bibian/brazil-jobs-scraper) when this guide was written (20 November 2026); the Store page is the reference.

## Limits and honest notes

- **`maxItems` is a ceiling, not a promise.** InfoJobs Brasil shows one page of results per search (around 20 to 30 postings), Vagas.com.br lists only about 100 postings when no keyword is given, and a narrow search (a small city, `publishedWithinDays: 1`, one remote policy) simply matches fewer postings. The default search, developers in São Paulo, has only a handful of postings on Vagas.com.br today.
- **Salaries are real or empty.** Vagas.com.br postings almost always say "a combinar" (negotiable) and Gupy postings never carry a salary: they come back with `salaryMin` and `salaryMax` empty rather than a made-up figure.
- **Gupy has no search across employers.** Each company publishes at its own `<company>.gupy.io` page, so the Actor reads a built-in list of 40 large employers, or yours through `gupyCompanies`. An employer that does not exist on Gupy is skipped with a warning in the run log.
- **`remote` is read, not guessed.** When a board does not say it, the value is `unknown`.
- **Employer names are those the boards publish.** A few small employers on InfoJobs Brasil are named like a person because the board presents them as companies; the dataset never contains a recruiter or candidate name, e-mail address or phone number.
- A board that is down ends the run with the postings already collected instead of failing it.
- This is an unofficial tool, not affiliated with Vagas.com.br, InfoJobs Brasil or Gupy. Check the rules that apply to your use of the data, for example the LGPD.

## FAQ

**Does it need a browser, cookies or a proxy on my side?**  
No. The Actor starts with plain requests and moves up to a proxy by itself when a board refuses them.

**Can I search only one board?**  
Yes: set `sources` to `["vagas"]`, `["infojobsbr"]` or `["gupy"]`.

**Which language should the keywords be in?**  
Portuguese, as employers write the job titles (`desenvolvedor`, `enfermeiro`, `analista de dados`), because the boards match the words of the posting.

**How do I get only new postings every day?**  
Set `publishedWithinDays` to `1`, tick `onlyNew` and schedule the Actor daily. Each run delivers, and charges, only what no earlier run of the same search delivered.

**Can I export to Excel or a database?**  
Yes: JSON, CSV, Excel and XML downloads, the Apify API, or integrations such as Google Sheets, webhooks and Zapier.

## Em português

**Brazil Jobs Scraper: três portais de vagas brasileiros em uma única execução, um só esquema, sem login nem proxy.** Vagas de emprego do Vagas.com.br, do InfoJobs Brasil e do Gupy, reunidas em um único conjunto de dados, sem duplicatas entre os portais, com salário quando o anúncio informa. Busque por cargo (`keywords`) e cidade (`location`), filtre por trabalho remoto e data de publicação, e marque `onlyNew` para receber, e pagar, apenas os anúncios novos a cada execução diária.

## Related Actors

- [Germany Jobs Scraper · 7 Boards, One Schema](https://apify.com/bibian/germany-jobs-scraper): the same one-run, one-schema approach for Germany.
- [Bumeran, Zonajobs & Laborum Scraper · 7 Countries](https://apify.com/bibian/latam-jobs-bumeran-scraper): the Spanish-speaking Latin American boards, seven countries in one run.

## Feedback

Need another board, filter or field? Open an issue in the Issues tab of the Actor on Apify and say what you need: requests are read, and the most asked ones are built next.
