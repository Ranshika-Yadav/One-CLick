import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { CheckCircle, Clock, Calendar, FileText, Upload, Download, User, AlertCircle } from 'lucide-react';

function EmployeeDashboard() {
  const { user } = useAuth();
  const { employees, updateEmployeeTask, uploadDocument } = useData();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const employee = employees.find(e => e.id === user?.id);
  if (!employee) return <div>Employee not found</div>;

  const completedTasks = employee.tasks.filter(t => t.completed);
  const pendingTasks = employee.tasks.filter(t => !t.completed);
  const overdueTasks = pendingTasks.filter(t => new Date(t.dueDate) < new Date());

  const handleTaskComplete = (taskId: string) => {
    updateEmployeeTask(employee.id, taskId, { 
      completed: true, 
      completedAt: new Date().toISOString() 
    });
  };

  const handleFileUpload = (taskId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a storage service
      const document = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file) // Mock URL
      };
      uploadDocument(taskId, employee.id, document);
    }
  };

  const getTaskIcon = (category: string, completed: boolean) => {
    const iconClass = completed ? "text-green-500" : "text-gray-400";
    switch (category) {
      case 'documentation': return <FileText className={`h-5 w-5 ${iconClass}`} />;
      case 'setup': return <CheckCircle className={`h-5 w-5 ${iconClass}`} />;
      case 'training': return <User className={`h-5 w-5 ${iconClass}`} />;
      case 'compliance': return <AlertCircle className={`h-5 w-5 ${iconClass}`} />;
      default: return <Clock className={`h-5 w-5 ${iconClass}`} />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout title="My Onboarding">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome, {employee.name}!</h2>
              <p className="text-blue-100 mb-4">
                Complete your onboarding tasks to get started at {employee.department}
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{employee.progress}%</p>
                  <p className="text-blue-100 text-sm">Complete</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{completedTasks.length}</p>
                  <p className="text-blue-100 text-sm">Tasks Done</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{pendingTasks.length}</p>
                  <p className="text-blue-100 text-sm">Remaining</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Link
                to="/employee/profile"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-150 flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>View Profile</span>
              </Link>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${employee.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-800 font-medium">
                You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
                <p className="text-gray-600 text-sm mt-1">Tasks you need to complete</p>
              </div>
              <div className="p-6">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">All tasks completed! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTasks.map((task) => {
                      const isOverdue = new Date(task.dueDate) < new Date();
                      return (
                        <div
                          key={task.id}
                          className={`border rounded-lg p-4 transition duration-150 ${
                            isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              {getTaskIcon(task.category, task.completed)}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                  {isOverdue && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Due: {formatDate(task.dueDate)}</span>
                                  </div>
                                  <span className="capitalize">{task.category}</span>
                                </div>
                                
                                {/* File Upload */}
                                {task.category === 'documentation' && (
                                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700">Required Documents</span>
                                      <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium">
                                        <input
                                          type="file"
                                          className="hidden"
                                          onChange={(e) => handleFileUpload(task.id, e)}
                                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        <Upload className="h-4 w-4 inline mr-1" />
                                        Upload
                                      </label>
                                    </div>
                                    {task.documents.length > 0 ? (
                                      <div className="space-y-2">
                                        {task.documents.map((doc) => (
                                          <div key={doc.id} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">{doc.name}</span>
                                            <button className="text-blue-600 hover:text-blue-700">
                                              <Download className="h-4 w-4" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-gray-500">No documents uploaded yet</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleTaskComplete(task.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150 text-sm font-medium"
                            >
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium">{formatDate(employee.startDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium">{employee.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Position</span>
                  <span className="font-medium">{employee.position}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    employee.status === 'completed' ? 'bg-green-100 text-green-800' :
                    employee.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Tasks</h3>
              {completedTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks completed yet</p>
              ) : (
                <div className="space-y-3">
                  {completedTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          {task.completedAt && formatDate(task.completedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {completedTasks.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{completedTasks.length - 5} more completed
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EmployeeDashboard;