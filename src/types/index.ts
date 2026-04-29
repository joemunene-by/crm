export interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  company?: string | null
  position?: string | null
  status: string
  source?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  userId?: string | null
  companyId?: string | null
}

export interface Deal {
  id: string
  title: string
  value: number
  stage: string
  probability: number
  expectedCloseDate?: Date | null
  status: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  userId?: string | null
  contactId?: string | null
  companyId?: string | null
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  dueDate?: Date | null
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  userId?: string | null
  contactId?: string | null
  dealId?: string | null
}

export interface Company {
  id: string
  name: string
  industry?: string | null
  website?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  userId?: string | null
}
