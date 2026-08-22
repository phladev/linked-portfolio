import HomeView from '@/components/home-view'
import { getPublishedProjects } from '@/lib/db/queries/projects'

export default async function Home() {
  const projects = await getPublishedProjects()

  return <HomeView projects={projects} />
}
