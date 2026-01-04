import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Square, Clock, ChevronRight } from 'lucide-react';

const TimeTracker = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [activeEntry, setActiveEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
    checkActiveTask();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject);
    } else {
      setTasks([]);
      setSelectedTask('');
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/time-tracking/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await axios.get(`/time-tracking/projects/${projectId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const checkActiveTask = async () => {
    // In a real app, we'd have an endpoint to get the current active task
    // For now, we'll just check if we can find one in the list of entries if we had that endpoint
  };

  const handleStart = async () => {
    if (!selectedProject || !selectedTask) {
      setError('Please select both project and task');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/time-tracking/start', {
        projectId: selectedProject,
        taskId: selectedTask
      });
      setActiveEntry(res.data);
      // Refresh tasks to remove the one we just started if needed
      fetchTasks(selectedProject);
    } catch (err) {
      setError(err.response?.data?.message || 'Error starting timer');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await axios.post('/time-tracking/stop');
      setActiveEntry(null);
      setSelectedProject('');
      setSelectedTask('');
      if (selectedProject) fetchTasks(selectedProject);
    } catch (err) {
      setError(err.response?.data?.message || 'Error stopping timer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Consultant Time Tracker</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project</label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            disabled={activeEntry || loading}
          >
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Task</label>
          <select
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            disabled={!selectedProject || activeEntry || loading}
          >
            <option value="">Select Task</option>
            {tasks.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          {!activeEntry ? (
            <button
              onClick={handleStart}
              disabled={loading || !selectedTask}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Square className="w-5 h-5 fill-current" />
              Stop
            </button>
          )}
        </div>
      </div>

      {activeEntry && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg animate-pulse">
          <div className="flex items-center justify-between text-blue-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="font-semibold">Currently Tracking:</span>
              <span className="font-medium opacity-80">{projects.find(p => p._id === activeEntry.project)?.name}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="font-medium opacity-80">{tasks.find(t => t._id === activeEntry.task)?.name}</span>
            </div>
            <div className="font-mono font-bold text-lg">Active</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
