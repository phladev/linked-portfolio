import { Card, CardContent } from '@/components/ui/card'

interface SkillListProps {
  skills: string[]
}

export default function SkillList({ skills }: SkillListProps) {
  return (
    <Card className="h-[320px] bg-gray-800 border-gray-700 hover:border-purple-700 transition-colors md:h-[400px]">
      <CardContent className="mt-4">
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          {skills.map((skill, index) => (
            <li key={index} className="text-sm md:text-lg">
              {skill}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
