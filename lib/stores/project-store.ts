import { create } from "zustand"

interface ProjectState {
  selectedProject: string
  setSelectedProject: (project: string) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProject: "",
  setSelectedProject: (project) => set({ selectedProject: project }),
}))

