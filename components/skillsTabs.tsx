import { Code2, Users } from 'lucide-react'
import { Tabs, TabsTrigger, TabsList, TabsContent } from './ui/tabs'
import SkillList from './skillsList'

const SkillTabs = () => {
  return (
    <Tabs defaultValue="hard" className="w-64 md:w-full">
      <TabsList className="flex justify-center items-center bg-gray-700">
        <TabsTrigger
          value="hard"
          className="w-full data-[state=active]:bg-[#7e22ce] data-[state=active]:text-white text-gray-300 hover:text-white transition-colors"
        >
          <Code2 className="w-4 h-4 mr-2" />
          Hard Skills
        </TabsTrigger>
        <TabsTrigger
          value="soft"
          className="w-full data-[state=active]:bg-[#7e22ce] data-[state=active]:text-white text-gray-300 hover:text-white transition-colors"
        >
          <Users className="w-4 h-4 mr-2" />
          Soft Skills
        </TabsTrigger>
      </TabsList>

      <TabsContent value="hard" className="w-full flex justify-center">
        <div className="mt-4 w-full">
          <SkillList
            skills={[
              'HTML & CSS',
              'JavaScript',
              'Typescript',
              'PHP',
              'Nodejs',
              'Reactjs',
              'Nextjs',
              'MongoDB',
              'MySQL',
              'PostgreSQL',
              'Git/Github',
            ]}
          />
        </div>
      </TabsContent>

      <TabsContent value="soft" className="w-full flex justify-center">
        <div className="mt-4 w-full">
          <SkillList
            skills={[
              'Capacidade de dar e receber feedback',
              'Trabalho em equipe',
              'Comunicação',
              'Resolução de problemas',
              'Abordagem lógica e organizada',
              'Autonomia e proatividade',
              'Aprendizado contínuo',
              'Responsabilidade',
              'Capacidade de lidar com mudanças',
            ]}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default SkillTabs
