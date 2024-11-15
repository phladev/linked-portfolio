import { ArrowUp } from 'lucide-react'
import Link from 'next/link'

const BackToTop = () => {
  return (
    <div className="fixed right-5 bottom-5 bg-zinc-300 rounded-full p-2 text-black">
      <Link href="#">
        <span className="sr-only">Voltar ao topo</span>
        <ArrowUp size={24} />
      </Link>
    </div>
  )
}

export default BackToTop
