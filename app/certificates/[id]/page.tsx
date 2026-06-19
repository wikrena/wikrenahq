import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return { title: `Certificate ${params.id ?? ""} — Wikrena Academy` }
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#F6F8FA] flex items-center justify-center p-8">
      <div className="bg-white border-4 border-navy-800 rounded-3xl p-12 max-w-2xl w-full text-center shadow-float">
        <div className="text-5xl mb-4">🎓</div>
        <div className="text-xs font-code text-neutral-400 uppercase tracking-widest mb-6">Certificate of Completion</div>
        <h1 className="font-display font-black text-3xl text-navy-800 mb-2">Wikrena Academy</h1>
        <p className="text-neutral-500 mb-8 text-sm">This certifies that the holder has successfully completed</p>
        <div className="bg-teal-50 border border-teal-200 rounded-2xl py-6 px-8 mb-8">
          <div className="font-display font-black text-2xl text-teal-700">Data Analytics Professional</div>
        </div>
        <div className="text-xs font-code text-neutral-400 mb-2">Certificate ID: {params.id}</div>
        <div className="text-xs text-neutral-300 font-code">Verify at academy.wikrena.com/certificates/{params.id}</div>
      </div>
    </div>
  )
}
