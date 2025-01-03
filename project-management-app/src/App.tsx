import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectDetails } from './components/ProjectDetails'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Project {
  id: string
  name: string
  description: string
}

function Home({ projects, isDialogOpen, setIsDialogOpen, newProject, setNewProject, handleAddProject }: {
  projects: Project[]
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  newProject: { name: string; description: string }
  setNewProject: (project: { name: string; description: string }) => void
  handleAddProject: () => void
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">UX Testbed</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <Button onClick={handleAddProject}>Save Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card 
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      setProjects([...projects, {
        id: crypto.randomUUID(),
        name: newProject.name,
        description: newProject.description
      }])
      setNewProject({ name: '', description: '' })
      setIsDialogOpen(false)
    }
  }

  return (
    <BrowserRouter>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={
            <Home
              projects={projects}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              newProject={newProject}
              setNewProject={setNewProject}
              handleAddProject={handleAddProject}
            />
          } />
          <Route path="/projects/:id" element={<ProjectDetails projects={projects} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
