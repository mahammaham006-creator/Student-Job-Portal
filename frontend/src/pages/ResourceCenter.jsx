const resources = [
  {
    category: 'Resume Tips',
    items: [
      { title: 'How to Write a Winning Resume', desc: 'Key sections, formatting tips, and common mistakes to avoid.', link: 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume' },
      { title: 'Action Verbs for Your Resume', desc: 'Power words that make your experience stand out.', link: 'https://www.themuse.com/advice/185-powerful-verbs-that-will-make-your-resume-awesome' },
      { title: 'ATS-Friendly Resume Guide', desc: 'How to format your resume to pass automated screening.', link: 'https://www.jobscan.co/blog/ats-resume/' },
    ]
  },
  {
    category: 'Interview Prep',
    items: [
      { title: 'Top 50 Interview Questions', desc: 'Common questions with sample answers for freshers.', link: 'https://www.interviewbit.com/hr-interview-questions/' },
      { title: 'STAR Method Explained', desc: 'How to structure behavioral interview answers.', link: 'https://www.themuse.com/advice/star-interview-method' },
      { title: 'Technical Interview Prep', desc: 'DSA, system design, and coding round tips.', link: 'https://leetcode.com/explore/' },
    ]
  },
  {
    category: 'Career Growth',
    items: [
      { title: 'Building Your LinkedIn Profile', desc: 'Optimize your profile to attract recruiters.', link: 'https://university.linkedin.com/linkedin-for-students' },
      { title: 'Networking for Students', desc: 'How to build professional connections early.', link: 'https://www.themuse.com/advice/the-ultimate-guide-to-networking-for-students' },
      { title: 'Internship to Full-Time Conversion', desc: 'Tips to turn your internship into a job offer.', link: 'https://www.glassdoor.com/blog/internship-to-full-time/' },
    ]
  }
];

export default function ResourceCenter() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resource Center</h1>
        <p className="text-gray-500 mt-1">Everything you need to land your dream internship or job.</p>
      </div>

      <div className="space-y-10">
        {resources.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{category}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {items.map(({ title, desc, link }) => (
                <a key={title} href={link} target="_blank" rel="noreferrer"
                  className="card hover:shadow-md transition-shadow group block">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                  <span className="text-xs text-primary-600 mt-3 block">Read more →</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
