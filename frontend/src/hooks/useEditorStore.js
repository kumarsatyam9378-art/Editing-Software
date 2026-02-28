import { create } from 'zustand';

const createDefaultProject = () => ({
  name: 'Untitled Project',
  width: 3840,
  height: 2160,
  fps: 30,
  zoom: 1,
  tracks: [
    { id: 'video-1', type: 'video', clips: [] },
    { id: 'audio-1', type: 'audio', clips: [] },
    { id: 'text-1', type: 'text', clips: [] },
    { id: 'overlay-1', type: 'overlay', clips: [] }
  ]
});

function pushHistory(state) {
  return [...state.history, JSON.parse(JSON.stringify(state.project))].slice(-100);
}

const useEditorStore = create((set) => ({
  project: createDefaultProject(),
  selectedClipId: null,
  playhead: 0,
  duration: 120,
  isPlaying: false,
  activeTool: 'select',
  history: [],
  future: [],
  addClip: (trackId, clip) =>
    set((state) => ({
      history: pushHistory(state),
      future: [],
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) =>
          track.id === trackId
            ? { ...track, clips: [...track.clips, { ...clip, id: crypto.randomUUID() }] }
            : track
        )
      }
    })),
  updateClip: (clipId, updates) =>
    set((state) => ({
      history: pushHistory(state),
      future: [],
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) => ({
          ...track,
          clips: track.clips.map((clip) => (clip.id === clipId ? { ...clip, ...updates } : clip))
        }))
      }
    })),
  splitClip: (clipId, at) =>
    set((state) => ({
      history: pushHistory(state),
      future: [],
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) => ({
          ...track,
          clips: track.clips.flatMap((clip) => {
            if (clip.id !== clipId || at <= clip.start || at >= clip.end) {
              return [clip];
            }
            return [
              { ...clip, id: crypto.randomUUID(), end: at },
              { ...clip, id: crypto.randomUUID(), start: at }
            ];
          })
        }))
      }
    })),
  removeClip: (clipId) =>
    set((state) => ({
      history: pushHistory(state),
      future: [],
      selectedClipId: state.selectedClipId === clipId ? null : state.selectedClipId,
      project: {
        ...state.project,
        tracks: state.project.tracks.map((track) => ({
          ...track,
          clips: track.clips.filter((clip) => clip.id !== clipId)
        }))
      }
    })),
  moveClip: (clipId, toTrackId) =>
    set((state) => {
      let moving = null;
      const detachedTracks = state.project.tracks.map((track) => ({
        ...track,
        clips: track.clips.filter((clip) => {
          if (clip.id === clipId) {
            moving = clip;
            return false;
          }
          return true;
        })
      }));

      if (!moving) {
        return state;
      }

      return {
        history: pushHistory(state),
        future: [],
        project: {
          ...state.project,
          tracks: detachedTracks.map((track) =>
            track.id === toTrackId ? { ...track, clips: [...track.clips, moving] } : track
          )
        }
      };
    }),
  setPlayhead: (playhead) => set({ playhead }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  selectClip: (selectedClipId) => set({ selectedClipId }),
  setProjectName: (name) =>
    set((state) => ({ project: { ...state.project, name } })),
  setActiveTool: (activeTool) => set({ activeTool }),
  setProjectZoom: (zoom) =>
    set((state) => ({
      project: { ...state.project, zoom: Math.max(0.25, Math.min(4, zoom)) }
    })),
  loadProject: (project) => set({ project }),
  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      return {
        project: previous,
        history: state.history.slice(0, -1),
        future: [JSON.parse(JSON.stringify(state.project)), ...state.future].slice(0, 100)
      };
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        project: next,
        history: [...state.history, JSON.parse(JSON.stringify(state.project))].slice(-100),
        future: state.future.slice(1)
      };
    }),
  reset: () =>
    set({
      project: createDefaultProject(),
      selectedClipId: null,
      playhead: 0,
      isPlaying: false,
      history: [],
      future: []
    })
}));

export default useEditorStore;
