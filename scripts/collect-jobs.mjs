import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sources = [
  { name: 'Sarkari Result', url: 'https://www.sarkariresult.com/latestjob/', section: /All Latest Jobs[\s\S]*/i, limit: 125 },
  { name: 'Sarkari CSC', url: 'https://sarkaricsc.com/latest-job/', section: /Latest Jobs[\s\S]*?Important Tools/i, limit: 100 },
];
const strip = (text) => text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;|&ndash;/g, '–').replace(/&#8217;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
let previous = [];
try { previous = JSON.parse(await readFile('public/jobs.json', 'utf8')).jobs ?? []; } catch {}
const records = [];

for (const source of sources) {
  let html;
  try {
    const response = await fetch(source.url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; Sanet-Kendra-Jobs/1.0; +https://github.com/ankusa/sanet-kendra-jobs)' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    html = await response.text();
  } catch (error) {
    console.warn(`${source.name} unavailable; keeping its last successful index (${error.message}).`);
    records.push(...previous.filter((item) => item.source === source.name));
    continue;
  }
  const selected = html.match(source.section)?.[0] ?? html;
  let collected = 0;
  for (const match of selected.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const title = strip(match[2]).replace(/^•\s*/, '');
    const isJob = /online form|vacanc(?:y|ies)|recruitment|apprentice|bharti|jobs?|rojgar mela|walk[ -]?in|notification/i.test(title);
    const isOtherSection = /result|admit card|answer key|syllabus|scholarship|admission|counselling|certificate/i.test(title);
    if (title.length < 18 || !isJob || isOtherSection || /view more|all latest jobs/i.test(title)) continue;
    const sourceUrl = new URL(match[1], source.url).href;
    const qualification = /10th|मैट्रिक/i.test(title) ? '10th Pass' : /12th|इंटर/i.test(title) ? '12th Pass' : /ITI/i.test(title) ? 'ITI' : /graduate|degree|B\.Tech|BTech|BA\b/i.test(title) ? 'Graduate' : 'See notification';
    const location = /UPSSSC|UPPSC|Uttar Pradesh|UP Police|UP Anganwadi/i.test(title) ? 'Uttar Pradesh' : 'All India / State-wise';
    const dateMatch = title.match(/Last Date\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
    const lastDate = dateMatch ? dateMatch[1] : /district[- ]?wise/i.test(title) ? 'District-wise' : 'See notification';
    records.push({ id: `${source.name}-${sourceUrl}`, title, source: source.name, sourceUrl, href: sourceUrl, qualification, location, lastDate, verification: 'needs-review', collectedAt: new Date().toISOString() });
    collected += 1;
    if (collected >= source.limit) break;
  }
}
const unique = [...new Map(records.map((item) => [item.sourceUrl, item])).values()];
await mkdir('public', { recursive: true });
await writeFile('public/jobs.json', JSON.stringify({ generatedAt: new Date().toISOString(), notice: 'Discovery index only. Verify every vacancy with the recruiting organization.', jobs: unique }, null, 2));
console.log(`Indexed ${unique.length} job headlines.`);
