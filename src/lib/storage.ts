// Local Storage based data persistence
// No backend required - all data stored in browser

const STORAGE_KEYS = {
  user: 'docautofill_user',
  personalData: 'docautofill_personal_data',
  licenseInfo: 'docautofill_license_info',
  vehicleInfo: 'docautofill_vehicle_info',
  insuranceInfo: 'docautofill_insurance_info',
  processedForms: 'docautofill_processed_forms',
  documents: 'docautofill_documents'
}

// Generic storage functions
export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export function loadData<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

export function removeData(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// User management
export interface LocalUser {
  id: string
  email: string
  name: string
  createdAt: string
}

export function createUser(email: string, password: string, name: string): LocalUser {
  const users = loadData<Record<string, { user: LocalUser; password: string }>>(STORAGE_KEYS.user + '_all') || {}
  
  // Check if user already exists with this email
  if (users[email]) {
    // Update password and return existing user
    users[email].password = password
    saveData(STORAGE_KEYS.user + '_all', users)
    saveData(STORAGE_KEYS.user, users[email].user)
    return users[email].user
  }
  
  // Create new user
  const user: LocalUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
    createdAt: new Date().toISOString()
  }
  users[email] = { user, password }
  saveData(STORAGE_KEYS.user + '_all', users)
  saveData(STORAGE_KEYS.user, user)
  return user
}

export function loginUser(email: string, password: string): LocalUser | null {
  const users = loadData<Record<string, { user: LocalUser; password: string }>>(STORAGE_KEYS.user + '_all') || {}
  const record = users[email]
  if (record && record.password === password) {
    saveData(STORAGE_KEYS.user, record.user)
    return record.user
  }
  return null
}

export function getCurrentUser(): LocalUser | null {
  return loadData<LocalUser>(STORAGE_KEYS.user)
}

export function logoutUser(): void {
  removeData(STORAGE_KEYS.user)
}

// Data access functions with user scoping
function getUserDataKey(baseKey: string, userId: string): string {
  return `${baseKey}_${userId}`
}

export function saveUserData<T>(baseKey: string, userId: string, data: T): void {
  saveData(getUserDataKey(baseKey, userId), data)
}

export function loadUserData<T>(baseKey: string, userId: string): T | null {
  return loadData<T>(getUserDataKey(baseKey, userId))
}

// Export storage keys for use in hooks
export { STORAGE_KEYS }
