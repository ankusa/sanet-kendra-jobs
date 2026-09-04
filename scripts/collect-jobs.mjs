import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sources = [
  { name: 'Sarkari Result', url: 'https://www.sarkariresult.com/', section: /Latest Job[\s\S]*?View More/i },
  { name: 'Sarkari CSC', url: 'https://sarkaricsc.com/latest-job/', section: /Latest Jobs[\s\S]*?Important Tools/i },
];
const strip = (text) => text.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;|&ndash;/g, '–').replace(/&#8217;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
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
  for (const match of selected.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const title = strip(match[2]).replace(/^•\s*/, '');
    if (title.length < 18 || /view more|latest job/i.test(title)) continue;
    const sourceUrl = new URL(match[1], source.url).href;
    const qualification = /10th|मैट्रिक/i.test(title) ? '10th Pass' : /12th|इंटर/i.test(title) ? '12th Pass' : /ITI/i.test(title) ? 'ITI' : /graduate|degree|B\.Tech|BTech|BA\b/i.test(title) ? 'Graduate' : 'See notification';
    const location = /UPSSSC|UPPSC|Uttar Pradesh|UP Police|UP Anganwadi/i.test(title) ? 'Uttar Pradesh' : 'All India / State-wise';
    records.push({ id: `${source.name}-${sourceUrl}`, title, source: source.name, sourceUrl, href: sourceUrl, qualification, location, lastDate: 'See source', verification: 'needs-review', collectedAt: new Date().toISOString() });
  }
}
const unique = [...new Map(records.map((item) => [item.sourceUrl, item])).values()];
await mkdir('public', { recursive: true });
await writeFile('public/jobs.json', JSON.stringify({ generatedAt: new Date().toISOString(), notice: 'Discovery index only. Verify every vacancy with the recruiting organization.', jobs: unique }, null, 2));
console.log(`Indexed ${unique.length} job headlines.`);
