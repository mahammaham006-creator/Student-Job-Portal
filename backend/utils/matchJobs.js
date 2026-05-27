/**
 * AI Matchmaking: scores jobs based on student skill overlap
 * Returns top N jobs sorted by match score
 */
const matchJobsForStudent = (studentSkills = [], jobs = [], topN = 10) => {
  if (!studentSkills.length) return jobs.slice(0, topN);

  const normalizedSkills = studentSkills.map(s => s.toLowerCase());

  const scored = jobs.map(job => {
    const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());
    const matches = jobSkills.filter(s => normalizedSkills.includes(s)).length;
    const score = jobSkills.length > 0 ? matches / jobSkills.length : 0;
    return { job, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ job }) => job);
};

module.exports = matchJobsForStudent;
