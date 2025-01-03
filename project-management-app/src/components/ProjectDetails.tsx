import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface Project {
  id: string;
  name: string;
  description: string;
}

export function ProjectDetails({ projects }: { projects: Project[] }) {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-gray-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{project.name}</h2>
        <p className="mt-2 text-gray-600">{project.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            No personas added yet.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research Studies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            No research studies added yet.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
