'use client';

import { useMemo, useState } from 'react';
import { Search, MapPin, GraduationCap, CalendarDays, ShieldCheck, ExternalLink, Printer } from 'lucide-react';
import jobsData from '../public/jobs.json';

type Job = { title: string; source: string; qualification: string; location: string; lastDate: string; href: string };
const sampleJobs: Job[] = [
  { title: 'UPSSSC Computer Operator Bharti 2026', source: 'Sarkari CSC', qualification: 'Intermediate', location: 'Uttar Pradesh', lastDate: '28 Sep 2026', href: 'https://sarkaricsc.com/latest-job/' },
  { title: 'UPSC Combined Geo Scientist 2027', source: 'Sarkari Result', qualification: 'Graduate', location: 'All India', lastDate: '22 Sep 2026', href: 'https://www.sarkariresult.com/latestjob/' },
  { title: 'SSC Junior Engineer JE 2026', source: 'Both sources', qualification: 'Diploma / B.Tech', location: 'All India', lastDate: 'See notification', href: 'https://ssc.gov.in/' },
  { title: 'DRDO CVRDE Apprentice 2026', source: 'Sarkari CSC', qualification: 'ITI', location: 'All India', lastDate: 'See notification', href: 'https://www.drdo.gov.in/' },
  { title: 'India Post GDS 2026', source: 'Both sources', qualification: '10th Pass', location: 'All India', lastDate: 'See notification', href: 'https://indiapostgdsonline.gov.in/' },
  { title: 'UP Anganwadi Bharti 2026', source: 'Both sources', qualification: '12th Pass', location: 'Uttar Pradesh', lastDate: 'District-wise', href: 'https://upanganwadibharti.in/' },
];

export default function Home() {
  const [jobs] = useState<Job[]>(jobsData.jobs.length ? jobsData.jobs : sampleJobs);
  const [query, setQuery] = useState('');
  const [qualification, setQualification] = useState('All');
  const visible = useMemo(() => jobs.filter((job) => {
    const matchesQuery = `${job.title} ${job.location} ${job.qualification}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (qualification === 'All' || job.qualification.includes(qualification));
  }), [query, qualification]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top"><span>नौकरी</span> सूचना केंद्र</a>
        <div className="updated"><span className="live-dot" /> अपडेट: 4 सितम्बर 2026</div>
      </header>
      <section className="intro" id="top">
        <div>
          <p className="eyebrow">SANET KENDRA · PALA FATAK, ALIGARH</p>
          <h1>नई नौकरी खोजें।<br/><em>सही लिंक से आवेदन करें।</em></h1>
          <p className="intro-copy">सरकारी नौकरियां, अप्रेंटिस और अंतिम तिथि—मोबाइल पर साफ और आसान जानकारी।</p>
        </div>
        <button className="print-button" onClick={() => window.print()}><Printer size={19}/> नोटिस बोर्ड प्रिंट करें</button>
      </section>
      <section className="search-panel" aria-label="Job filters">
        <label className="search-box"><Search size={21}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="पद, योग्यता या स्थान खोजें" /></label>
        <div className="chips">{['All', '10th', '12th', 'ITI', 'Graduate'].map((item) => <button key={item} className={qualification === item ? 'active' : ''} onClick={() => setQualification(item)}>{item === 'All' ? 'सभी' : item}</button>)}</div>
      </section>
      <section className="content-grid">
        <div>
          <div className="section-heading"><div><p className="eyebrow">APPLICATIONS OPEN</p><h2>अभी आवेदन करें</h2></div><span>{visible.length} नौकरियां</span></div>
          <div className="job-list">
            {visible.map((job, index) => <article className="job-card" key={job.title}>
              <div className="number">{String(index + 1).padStart(2, '0')}</div>
              <div className="job-main"><p className="source">{job.source}</p><h3>{job.title}</h3><div className="meta"><span><GraduationCap size={16}/>{job.qualification}</span><span><MapPin size={16}/>{job.location}</span><span><CalendarDays size={16}/>{job.lastDate}</span></div></div>
              <div className="job-action"><span className="verify"><ShieldCheck size={14}/> जाँच बाकी</span><a href={job.href} target="_blank" rel="noreferrer">जानकारी <ExternalLink size={15}/></a></div>
            </article>)}
          </div>
        </div>
        <aside className="notice-card"><p className="eyebrow">CSC HELP DESK</p><h2>फॉर्म भरवाने में मदद चाहिए?</h2><p>आधार, फोटो, हस्ताक्षर और प्रमाणपत्र साथ लेकर केंद्र पर आएं।</p><div className="address"><MapPin size={20}/><span><strong>Sanet Kendra</strong><br/>Pala Fatak, Aligarh</span></div><div className="warning"><ShieldCheck size={20}/><span>आवेदन से पहले विभाग की आधिकारिक अधिसूचना अवश्य पढ़ें।</span></div></aside>
      </section>
      <section className="print-poster">
        <p className="poster-kicker">SANET KENDRA · PALA FATAK</p><h1>आज की नई भर्तियां</h1><p className="poster-sub">10वीं · 12वीं · ITI · Diploma · Graduate</p>
        <div className="poster-jobs">{jobs.slice(0, 5).map((job, i) => <div key={job.title}><b>{i + 1}</b><span>{job.title}</span><strong>{job.lastDate}</strong></div>)}</div>
        <div className="qr-placeholder"><img src="qr.svg" alt="Scan to open the jobs webpage"/><p><strong>पूरी जानकारी मोबाइल पर देखें</strong><br/>कैमरा खोलें और QR स्कैन करें</p></div>
        <p className="poster-warning">केवल आधिकारिक वेबसाइट पर आवेदन करें · किसी अनजान व्यक्ति को पैसे न दें</p>
      </section>
      <footer>सूचनाएं Sarkari Result और Sarkari CSC से खोजी जाती हैं तथा आधिकारिक स्रोत से सत्यापन आवश्यक है। यह वेबसाइट किसी सरकारी विभाग या निजी स्रोत वेबसाइट से संबद्ध नहीं है।</footer>
    </main>
  );
}
