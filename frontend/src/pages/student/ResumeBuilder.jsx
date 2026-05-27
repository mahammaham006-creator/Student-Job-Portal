import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { generateResumePDF } from '../../utils/resumeBuilder';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!user?.profile?.skills?.length) {
      toast.error('Please add skills to your profile first');
      return;
    }
    setGenerating(true);
    try {
      generateResumePDF(user);
      toast.success('Resume downloaded!');
    } catch {
      toast.error('Failed to generate resume');
    } finally {
      setGenerating(false);
    }
  };

  const profile = user?.profile || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <p className="text-gray-500 text-sm mt-1">Generate a clean PDF resume from your profile data.</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="btn-primary flex items-center gap-2">
          📄 {generating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Preview */}
      <div className="card font-mono text-sm space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Your Name'}</h2>
          <p className="text-gray-500 mt-1">
            {[user?.email, profile.phone, profile.location].filter(Boolean).join(' | ')}
          </p>
          {(profile.linkedIn || profile.github) && (
            <p className="text-gray-500">
              {[profile.linkedIn, profile.github].filter(Boolean).join(' | ')}
            </p>
          )}
        </div>

        {/* Summary */}
        {profile.bio && (
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2">Summary</h3>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Education */}
        {profile.university && (
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2">Education</h3>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{profile.university}</p>
                <p className="text-gray-600">{profile.branch} {profile.cgpa && `| CGPA: ${profile.cgpa}`}</p>
              </div>
              <p className="text-gray-500">{profile.graduationYear}</p>
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2">Skills</h3>
            <p className="text-gray-700">{profile.skills.join(' • ')}</p>
          </div>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2">Experience</h3>
            {profile.experience.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <p className="font-semibold">{e.title} — {e.company}</p>
                  <p className="text-gray-500">{e.duration}</p>
                </div>
                {e.description && <p className="text-gray-600 mt-1">{e.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2">Projects</h3>
            {profile.projects.map((p, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold">{p.name}</p>
                {p.description && <p className="text-gray-600">{p.description}</p>}
                {p.techStack?.length > 0 && <p className="text-gray-500 text-xs mt-1">Tech: {p.techStack.join(', ')}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        💡 To improve your resume, <Link to="/student/profile" className="underline font-medium">update your profile</Link> with experience, projects, and more details.
      </div>
    </div>
  );
}
