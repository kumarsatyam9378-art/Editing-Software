import { create } from 'zustand';

const defaultProject = {
  name: 'Untitled Project',
  width: 3840,
  height: 2160,
  fps: 30,
  tracks: [
    { id: 'video-1', type: 'video', clips: [] },
    { id: 'audio-1', type: 'audio', clips: [] },
    { id: 'text-1', type: 'text', clips: [] }
  ]
};

const useEditorStore = create((set) => ({
  project: defaultProject,
  selectedClipId: null,
  playhead: 0,
  duration: 120,
  isPlaying: false,
  addClip: (trackId, clip) =>
    set((state) => ({
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) =>
          track.id === trackId
            ? { ...track, clips: [...track.clips, { ...clip, id: crypto.randomUUID() }] }
            : track
        )
      }
    })),
  setPlayhead: (playhead) => set({ playhead }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  selectClip: (selectedClipId) => set({ selectedClipId }),
  setProjectName: (name) =>
    set((state) => ({ project: { ...state.project, name } })),
  loadProject: (project) => set({ project }),
  reset: () => set({ project: defaultProject, selectedClipId: null, playhead: 0, isPlaying: false })
}));

export default useEditorStore;
