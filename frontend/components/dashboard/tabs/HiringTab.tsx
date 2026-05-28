'use client'
import { Company } from '@/lib/mockData'
import HiringDistribution from '../HiringDistribution'

interface Props { company: Company }

export default function HiringTab({ company }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
          <div className="text-xs text-secondary mb-1">Total Openings (30d)</div>
          <div className="text-3xl font-black text-green">
            {company.hiringData.reduce((s,d)=>s+d.count,0)}
          </div>
          <div className="text-sm text-secondary mt-1">
            {company.scores.hiringVelocity > 0 ? '+' : ''}{company.scores.hiringVelocity}% MoM velocity
          </div>
        </div>
        <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
          <div className="text-xs text-secondary mb-1">Engineering Ratio</div>
          <div className="text-3xl font-black text-indigo">64%</div>
          <div className="text-sm text-secondary mt-1">Strong product build signal</div>
        </div>
        <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
          <div className="text-xs text-secondary mb-1">New Postings (7d)</div>
          <div className="text-3xl font-black text-blue">
            {Math.round(company.hiringData.reduce((s,d)=>s+d.count,0) * 0.18)}
          </div>
          <div className="text-sm text-secondary mt-1">Accelerating pace</div>
        </div>
      </div>
      <HiringDistribution data={company.hiringData} />
      <div className="bg-[#0A1628] border border-white/6 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Top Open Roles</h3>
        <div className="space-y-2">
          {['Senior AI Infrastructure Engineer', 'CUDA Software Engineer', 'Enterprise Account Executive — Data Center', 'ML Systems Engineer', 'Deep Learning Compiler Engineer', 'Principal GPU Architect'].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm text-secondary">{r}</span>
              <span className="text-xs text-muted">{['Engineering','Engineering','Sales','Engineering','Engineering','Engineering'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
