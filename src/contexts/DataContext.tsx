import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'setup' | 'training' | 'compliance';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  assignedTo?: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  url: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  startDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  avatar?: string;
  tasks: Task[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  tasks: Omit<Task, 'id' | 'completed' | 'completedAt' | 'assignedTo' | 'documents'>[];
  createdAt: string;
  isActive: boolean;
}

interface DataContextType {
  employees: Employee[];
  workflowTemplates: WorkflowTemplate[];
  addEmployee: (employee: Omit<Employee, 'id' | 'progress' | 'tasks'>) => void;
  updateEmployeeTask: (employeeId: string, taskId: string, updates: Partial<Task>) => void;
  addWorkflowTemplate: (template: Omit<WorkflowTemplate, 'id' | 'createdAt'>) => void;
  updateWorkflowTemplate: (templateId: string, updates: Partial<WorkflowTemplate>) => void;
  assignWorkflowToEmployee: (employeeId: string, templateId: string) => void;
  uploadDocument: (taskId: string, employeeId: string, document: Omit<Document, 'id' | 'uploadedAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mockEmployees: Employee[] = [
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Software Developer',
    startDate: '2024-01-15',
    status: 'in-progress',
    progress: 65,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    tasks: [
      {
        id: 't1',
        title: 'Complete Personal Information Form',
        description: 'Fill out the employee personal information form with emergency contacts and basic details.',
        category: 'documentation',
        priority: 'high',
        dueDate: '2024-01-20',
        completed: true,
        completedAt: '2024-01-16',
        documents: []
      },
      {
        id: 't2',
        title: 'Review Employee Handbook',
        description: 'Read through the complete employee handbook and acknowledge receipt.',
        category: 'compliance',
        priority: 'high',
        dueDate: '2024-01-22',
        completed: true,
        completedAt: '2024-01-18',
        documents: []
      },
      {
        id: 't3',
        title: 'Set up Development Environment',
        description: 'Install required software and configure development tools.',
        category: 'setup',
        priority: 'medium',
        dueDate: '2024-01-25',
        completed: false,
        documents: []
      },
      {
        id: 't4',
        title: 'Security Training',
        description: 'Complete mandatory cybersecurity training modules.',
        category: 'training',
        priority: 'high',
        dueDate: '2024-01-30',
        completed: false,
        documents: []
      }
    ]
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'Marketing',
    position: 'Marketing Specialist',
    startDate: '2024-01-22',
    status: 'pending',
    progress: 20,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    tasks: [
      {
        id: 't5',
        title: 'Complete Personal Information Form',
        description: 'Fill out the employee personal information form with emergency contacts and basic details.',
        category: 'documentation',
        priority: 'high',
        dueDate: '2024-01-27',
        completed: true,
        completedAt: '2024-01-23',
        documents: []
      },
      {
        id: 't6',
        title: 'Review Employee Handbook',
        description: 'Read through the complete employee handbook and acknowledge receipt.',
        category: 'compliance',
        priority: 'high',
        dueDate: '2024-01-29',
        completed: false,
        documents: []
      },
      {
        id: 't7',
        title: 'Marketing Tools Setup',
        description: 'Get access to marketing tools and platforms.',
        category: 'setup',
        priority: 'medium',
        dueDate: '2024-02-02',
        completed: false,
        documents: []
      }
    ]
  }
];

const mockWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: 'wt1',
    name: 'Engineering Onboarding',
    description: 'Standard onboarding workflow for engineering team members',
    department: 'Engineering',
    isActive: true,
    createdAt: '2024-01-01',
    tasks: [
      {
        title: 'Complete Personal Information Form',
        description: 'Fill out the employee personal information form with emergency contacts and basic details.',
        category: 'documentation',
        priority: 'high',
        dueDate: '5', // days from start
        documents: []
      },
      {
        title: 'Review Employee Handbook',
        description: 'Read through the complete employee handbook and acknowledge receipt.',
        category: 'compliance',
        priority: 'high',
        dueDate: '7',
        documents: []
      },
      {
        title: 'Set up Development Environment',
        description: 'Install required software and configure development tools.',
        category: 'setup',
        priority: 'medium',
        dueDate: '10',
        documents: []
      },
      {
        title: 'Security Training',
        description: 'Complete mandatory cybersecurity training modules.',
        category: 'training',
        priority: 'high',
        dueDate: '15',
        documents: []
      }
    ]
  },
  {
    id: 'wt2',
    name: 'Marketing Onboarding',
    description: 'Standard onboarding workflow for marketing team members',
    department: 'Marketing',
    isActive: true,
    createdAt: '2024-01-01',
    tasks: [
      {
        title: 'Complete Personal Information Form',
        description: 'Fill out the employee personal information form with emergency contacts and basic details.',
        category: 'documentation',
        priority: 'high',
        dueDate: '5',
        documents: []
      },
      {
        title: 'Review Employee Handbook',
        description: 'Read through the complete employee handbook and acknowledge receipt.',
        category: 'compliance',
        priority: 'high',
        dueDate: '7',
        documents: []
      },
      {
        title: 'Marketing Tools Setup',
        description: 'Get access to marketing tools and platforms.',
        category: 'setup',
        priority: 'medium',
        dueDate: '10',
        documents: []
      }
    ]
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>(mockWorkflowTemplates);

  const addEmployee = (newEmployee: Omit<Employee, 'id' | 'progress' | 'tasks'>) => {
    const employee: Employee = {
      ...newEmployee,
      id: `emp_${Date.now()}`,
      progress: 0,
      tasks: []
    };
    setEmployees(prev => [...prev, employee]);
  };

  const updateEmployeeTask = (employeeId: string, taskId: string, updates: Partial<Task>) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const updatedTasks = emp.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        );
        const completedTasks = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);
        
        let status: Employee['status'] = 'pending';
        if (progress > 0 && progress < 100) status = 'in-progress';
        if (progress === 100) status = 'completed';
        
        return { ...emp, tasks: updatedTasks, progress, status };
      }
      return emp;
    }));
  };

  const addWorkflowTemplate = (template: Omit<WorkflowTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: WorkflowTemplate = {
      ...template,
      id: `wt_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setWorkflowTemplates(prev => [...prev, newTemplate]);
  };

  const updateWorkflowTemplate = (templateId: string, updates: Partial<WorkflowTemplate>) => {
    setWorkflowTemplates(prev => prev.map(template =>
      template.id === templateId ? { ...template, ...updates } : template
    ));
  };

  const assignWorkflowToEmployee = (employeeId: string, templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;

    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const startDate = new Date(employee.startDate);
    const tasks: Task[] = template.tasks.map((templateTask, index) => {
      const dueDate = new Date(startDate);
      dueDate.setDate(startDate.getDate() + parseInt(templateTask.dueDate));
      
      return {
        ...templateTask,
        id: `task_${Date.now()}_${index}`,
        dueDate: dueDate.toISOString().split('T')[0],
        completed: false,
        assignedTo: employeeId,
        documents: []
      };
    });

    setEmployees(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, tasks, progress: 0, status: 'pending' } : emp
    ));
  };

  const uploadDocument = (taskId: string, employeeId: string, document: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };

    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const updatedTasks = emp.tasks.map(task => 
          task.id === taskId 
            ? { ...task, documents: [...task.documents, newDocument] }
            : task
        );
        return { ...emp, tasks: updatedTasks };
      }
      return emp;
    }));
  };

  return (
    <DataContext.Provider value={{
      employees,
      workflowTemplates,
      addEmployee,
      updateEmployeeTask,
      addWorkflowTemplate,
      updateWorkflowTemplate,
      assignWorkflowToEmployee,
      uploadDocument
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}