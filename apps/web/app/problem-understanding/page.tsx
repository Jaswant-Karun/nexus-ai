"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import ModuleLayout from "@/components/layout/ModuleLayout";
import {
  createOrchestrationPlan,
  executeAgentCouncil,
  generateSolutionReport,
  OrchestrationResponse,
  SolutionReport,
} from "@/services/orchestration.service";

const exampleProblem =
  "I want to develop a low-cost smart irrigation system for small farmers.";

export default function ProblemUnderstandingPage() {
  const router = useRouter();
  const [problem, setProblem] = useState(exampleProblem);
  const [result, setResult] = useState<OrchestrationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<SolutionReport | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!problem.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      setResult(await createOrchestrationPlan({ problem }));
      setReport(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReport() {
    if (!result) return;
    setError("");
    try {
      setReport(await generateSolutionReport({ problem: result.problem }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Report generation failed.");
    }
  }

  function handleCreateProject() {
    if (!report) return;
    window.localStorage.setItem("nexus_solution_report", JSON.stringify(report));
    router.push("/projects/create?source=orchestration");
  }

  async function handleExecution() {
    if (!result || executing) return;
    setExecuting(true);
    setError("");
    try {
      setResult(await executeAgentCouncil({ problem: result.problem }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Execution failed.");
    } finally {
      setExecuting(false);
    }
  }

  return (
    <ModuleLayout
      title="Problem Understanding"
      subtitle="Turn a real-world challenge into an explainable multi-agent plan."
      badge="Core Demo"
      subnav={[
        { label: "Problem Understanding", href: "/problem-understanding" },
        { label: "AI Chat", href: "/chat" },
        { label: "Workflow Builder", href: "/workflows" },
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6">
          <div>
            <label htmlFor="problem" className="text-sm font-semibold text-white">What are you trying to solve?</label>
            <p className="mt-1 text-xs text-dark-400">Describe the goal, audience, and constraints in plain language.</p>
          </div>
          <textarea
            id="problem"
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            rows={8}
            className="w-full resize-y rounded-xl border border-white/10 bg-dark-950 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            placeholder="Describe the problem you want Nexus AI to investigate..."
          />
          {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">{error}</p>}
          <button type="submit" disabled={loading || !problem.trim()} className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Building orchestration plan..." : "Understand and plan"}
          </button>
        </form>

        <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6">
          {!result ? (
            <div className="flex min-h-64 items-center justify-center text-center text-sm text-dark-400">
              Submit a problem to see intent, domain, agents, and next actions.
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">{result.domain}</p>
                <h2 className="mt-1 text-lg font-bold text-white">{result.intent}</h2>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400">Adaptive plan</h3>
                <ol className="mt-3 space-y-2">
                  {result.plan.map((step, index) => <li key={step} className="flex gap-3 text-sm text-dark-200"><span className="text-brand-400">0{index + 1}</span>{step}</li>)}
                </ol>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400">Agent council</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {result.agents.map((agent) => <div key={agent.name} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-white">{agent.name}</p><span className="text-[10px] uppercase text-emerald-400">{agent.status}</span></div><p className="mt-1 text-xs text-dark-400">{agent.role}</p><p className="mt-2 text-xs leading-5 text-dark-300">{agent.output}</p></div>)}
                </div>
              </div>
              <button type="button" onClick={handleExecution} disabled={executing || result.agents.every((agent) => agent.status === "completed")} className="w-full rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm font-semibold text-brand-300 transition hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50">
                {executing ? "Running agent council..." : result.agents.every((agent) => agent.status === "completed") ? "Agent council completed" : "Run agent council"}
              </button>
              <button type="button" onClick={handleReport} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Generate solution report
              </button>
            </>
          )}
        </section>
      </div>
      {report && (
        <section className="mt-6 space-y-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Generated report</p><h2 className="mt-1 text-xl font-bold text-white">{report.title}</h2><p className="mt-2 text-sm text-dark-300">{report.summary}</p></div>
          <div><h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400">Recommendation</h3><p className="mt-2 text-sm leading-6 text-white">{report.recommendation}</p></div>
          <div className="grid gap-5 md:grid-cols-2"><div><h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400">Implementation</h3><ol className="mt-2 space-y-2 text-sm text-dark-200">{report.implementation_steps.map((step, index) => <li key={step}><span className="mr-2 text-emerald-400">{index + 1}.</span>{step}</li>)}</ol></div><div><h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400">Cost and risks</h3><p className="mt-2 text-sm text-white">{report.cost_estimate}</p><ul className="mt-3 space-y-2 text-sm text-dark-300">{report.risks.map((risk) => <li key={risk}>• {risk}</li>)}</ul></div></div>
          <button type="button" onClick={handleCreateProject} className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">Create project from this report</button>
        </section>
      )}
    </ModuleLayout>
  );
}