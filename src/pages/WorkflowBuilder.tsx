import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Save, ArrowLeft, FileText, Settings, Clock, AlertTriangle, Users } from 'lucide-react';

interface TaskTemplate {
  title: string;
  description: string;
  category: 'documentation' | 'setup' | 'training' | 'compliance';
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // days from start
}

function WorkflowBuilder() {
  const { workflowTemplates, addWorkflowTemplate, updateWorkflowTemplate } = useData();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    isActive: true,
    tasks: [] as TaskTemplate[]
  });

  const [newTask, setNewTask] = useState<TaskTemplate>({
    title: '',
    description: '',
    category: 'documentation',
    priority: 'medium',
    dueDate: '7'
  });

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const categories = ['documentation', 'setup', 'training', 'compliance'];
  const priorities = ['low', 'medium', 'high'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      department: '',
      isActive: true,
      tasks: []
    });
    setNewTask({
      title: '',
      description: '',
      category: 'documentation',
      priority: 'medium',
      dueDate: '7'
    });
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleSaveTemplate = () => {
    if (!formData.name || !formData.department || formData.tasks.length === 0) {
      alert('Please fill in all required fields and add at least one task');
      return;
    }

    if (editingTemplate) {
      updateWorkflowTemplate(editingTemplate, formData);
    } else {
      addWorkflowTemplate(formData);
    }
    
    resetForm();
  };

  const handleEditTemplate = (template: any) => {
    setFormData({
      name: template.name,
      description: template.description,
      department: template.department,
      isActive: template.isActive,
      tasks: template.tasks
    });
    setEditingTemplate(template.id);
    setIsCreating(true);
  };

  const addTask = () => {
    if (!newTask.title || !newTask.description) {
      alert('Please fill in task title and description');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { ...newTask }]
    }));

    setNewTask({
      title: '',
      description: '',
      category: 'documentation',
      priority: 'medium',
      dueDate: '7'
    });
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="h-4 w-4" />;
      case 'setup': return <Settings className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      case 'compliance': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isCreating) {
    return (
      <Layout title="Workflow Builder">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 transition duration-150"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTemplate ? 'Edit Workflow Template' : 'Create Workflow Template'}
                </h2>
                <p className="text-gray-600 mt-1">Design a custom onboarding workflow</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Template Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Engineering Onboarding"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe this workflow..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                      Active template
                    </label>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Template Stats</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>Tasks: {formData.tasks.length}</p>
                    <p>Estimated Duration: {Math.max(...formData.tasks.map(t => parseInt(t.dueDate) || 0), 0)} days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Task Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Task</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Complete Personal Information Form"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe what the employee needs to do..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Days (from start date)
                    </label>
                    <input
                      type="number"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="7"
                      min="1"
                    />
                  </div>
                </div>

                <button
                  onClick={addTask}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Tasks List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tasks ({formData.tasks.length})
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Tasks will be assigned in the order listed below
                  </p>
                </div>
                <div className="p-6">
                  {formData.tasks.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No tasks added yet</p>
                      <p className="text-gray-400 text-sm">Add your first task above</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.tasks.map((task, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                {getCategoryIcon(task.category)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="capitalize">{task.category}</span>
                                  <span>Due in {task.dueDate} days</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeTask(index)}
                              className="p-2 text-red-400 hover:text-red-600 transition duration-150"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Workflow Builder">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Workflow Templates</h2>
            <p className="text-gray-600 mt-1">Create and manage onboarding workflows for different departments</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/admin"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium">{template.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tasks</span>
                  <span className="font-medium">{template.tasks.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {Math.max(...template.tasks.map(t => parseInt(t.dueDate) || 0), 0)} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition duration-150 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => updateWorkflowTemplate(template.id, { isActive: !template.isActive })}
                  className={`flex-1 py-2 px-3 rounded-lg transition duration-150 text-sm font-medium ${
                    template.isActive
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {template.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default WorkflowBuilder;