'use client';

import React, { useState } from 'react';
import ModuleLayout from '@/components/layout/ModuleLayout';
import { Lightbulb, ThumbsUp, Plus, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';

const helpSubnav = [
  { label: 'Help Center', href: '/help' },
  { label: 'FAQ', href: '/help/faq' },
  { label: 'Contact Support', href: '/help/support' },
  { label: 'Report Bug', href: '/help/report-bug' },
  { label: 'Feature Request', href: '/help/feature-request' },
];

export default function FeatureRequestPage() {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: 'Local Ollama & vLLM Direct GPU Inference Engine',
      description: 'Support local zero-latency agent reasoning without sending prompt payloads outside customer VPCs.',
      votes: 142,
      status: 'IN PROGRESS',
      category: 'MODELS'
    },
    {
      id: 2,
      title: 'Visual Multi-Modal Diffusion Canvas Editor',
      description: 'Native node inside the workflow DAG to generate, upscale, and mask image layers via FLUX.1.',
      votes: 98,
      status: 'UNDER REVIEW',
      category: 'WORKFLOWS'
    },
    {
      id: 3,
      title: 'Native GitHub Actions & GitLab CI Pipeline Step for Agent Triggers',
      description: 'Trigger autonomous code reviewer agents straight from git push webhooks.',
      votes: 76,
      status: 'PLANNED',
      category: 'INTEGRATIONS'
    }
  ]);

  const [showSubmit, setShowSubmit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleVote = (id: number) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea));
  };

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setIdeas([
      {
        id: Date.now(),
        title: newTitle,
        description: newDesc,
        votes: 1,
        status: 'UNDER REVIEW',
        category: 'COMMUNITY'
      },
      ...ideas
    ]);
    setNewTitle('');
    setNewDesc('');
    setShowSubmit(false);
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 3000);
  };

  return (
    <ModuleLayout
      title="Feature Requests & Community Roadmap"
      subtitle="Vote on upcoming enhancements, suggest novel agent capabilities, and track platform evolution"
      subnav={helpSubnav}
      actions={
        <button
          onClick={() => setShowSubmit(!showSubmit)}
          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all shadow-md shadow-amber-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Suggest Feature
        </button>
      }
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {submittedMessage && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Thank you! Your feature suggestion has been published to the community voting pool.
          </div>
        )}

        {showSubmit && (
          <form onSubmit={handleCreateIdea} className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Submit a New Feature Proposal
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Feature title (e.g., Slack Interactive App Integration)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500"
              />
              <textarea
                rows={3}
                placeholder="Describe why this feature is valuable, intended use case, and workflows..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl p-3.5 focus:outline-none focus:border-amber-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmit(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Publish Suggestion
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Feature List */}
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700/80 transition-all flex items-start gap-4"
            >
              {/* Vote count button */}
              <button
                onClick={() => handleVote(idea.id)}
                className="flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-xl bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all p-2"
                title="Upvote feature"
              >
                <ThumbsUp className="w-3.5 h-3.5 mb-1" />
                <span className="text-xs font-bold">{idea.votes}</span>
              </button>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-bold text-white">{idea.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    idea.status === 'IN PROGRESS' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    idea.status === 'PLANNED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {idea.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{idea.category}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{idea.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  );
}
