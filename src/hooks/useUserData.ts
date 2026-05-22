import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { saveUserData, loadUserData, STORAGE_KEYS } from '../lib/storage'

export interface PersonalData {
  id?: string
  user_id: string
  first_name?: string
  last_name?: string
  middle_name?: string
  date_of_birth?: string
  ssn_encrypted?: string
  email?: string
  phone?: string
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  emergency_contact_name?: string
  emergency_contact_relationship?: string
  emergency_contact_phone?: string
  created_at?: string
  updated_at?: string
}

export interface LicenseInfo {
  id?: string
  user_id: string
  license_number?: string
  license_class?: string
  issued_date?: string
  expiration_date?: string
  restrictions?: string
  endorsements?: string
  issuing_state?: string
  created_at?: string
  updated_at?: string
}

export interface VehicleInfo {
  id?: string
  user_id: string
  vin?: string
  make?: string
  model?: string
  year?: number
  color?: string
  license_plate?: string
  odometer_reading?: number
  registration_number?: string
  registration_expiration?: string
  title_number?: string
  purchase_date?: string
  purchase_price?: number
  created_at?: string
  updated_at?: string
}

export interface InsuranceInfo {
  id?: string
  user_id: string
  provider?: string
  policy_number?: string
  coverage_type?: string
  policy_start_date?: string
  policy_expiration?: string
  agent_name?: string
  agent_phone?: string
  created_at?: string
  updated_at?: string
}

export interface ProcessedForm {
  id?: string
  user_id: string
  form_type: string
  form_name?: string
  original_filename?: string
  processed_filename?: string
  confidence_score?: number
  status?: string
  fields_detected?: number
  fields_filled?: number
  created_at?: string
  updated_at?: string
}

export interface Document {
  id: string
  user_id: string
  name: string
  type: string
  category: string
  file_data?: string // Base64 encoded for localStorage
  file_size?: number
  created_at: string
  updated_at: string
}

export function useUserData() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [personalData, setPersonalData] = useState<PersonalData | null>(null)
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null)
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null)
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo | null>(null)
  const [processedForms, setProcessedForms] = useState<ProcessedForm[]>([])
  const [documents, setDocuments] = useState<Document[]>([])

  // Load all user data from localStorage
  const loadAllData = useCallback(() => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      const personal = loadUserData<PersonalData>(STORAGE_KEYS.personalData, user.id)
      setPersonalData(personal)
      
      const license = loadUserData<LicenseInfo>(STORAGE_KEYS.licenseInfo, user.id)
      setLicenseInfo(license)
      
      const vehicle = loadUserData<VehicleInfo>(STORAGE_KEYS.vehicleInfo, user.id)
      setVehicleInfo(vehicle)
      
      const insurance = loadUserData<InsuranceInfo>(STORAGE_KEYS.insuranceInfo, user.id)
      setInsuranceInfo(insurance)
      
      const forms = loadUserData<ProcessedForm[]>(STORAGE_KEYS.processedForms, user.id)
      setProcessedForms(forms || [])
      
      const docs = loadUserData<Document[]>(STORAGE_KEYS.documents, user.id)
      setDocuments(docs || [])
    } catch (err) {
      console.error('Error loading user data:', err)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadAllData()
    }
  }, [user, loadAllData])

  // Update functions
  async function updatePersonalData(data: Partial<PersonalData>) {
    if (!user) throw new Error('User not authenticated')
    
    const updated: PersonalData = {
      ...personalData,
      ...data,
      user_id: user.id,
      id: personalData?.id || `pd_${Date.now()}`,
      updated_at: new Date().toISOString(),
      created_at: personalData?.created_at || new Date().toISOString()
    }
    
    saveUserData(STORAGE_KEYS.personalData, user.id, updated)
    setPersonalData(updated)
    return updated
  }

  async function updateLicenseInfo(data: Partial<LicenseInfo>) {
    if (!user) throw new Error('User not authenticated')
    
    const updated: LicenseInfo = {
      ...licenseInfo,
      ...data,
      user_id: user.id,
      id: licenseInfo?.id || `li_${Date.now()}`,
      updated_at: new Date().toISOString(),
      created_at: licenseInfo?.created_at || new Date().toISOString()
    }
    
    saveUserData(STORAGE_KEYS.licenseInfo, user.id, updated)
    setLicenseInfo(updated)
    return updated
  }

  async function updateVehicleInfo(data: Partial<VehicleInfo>) {
    if (!user) throw new Error('User not authenticated')
    
    const updated: VehicleInfo = {
      ...vehicleInfo,
      ...data,
      user_id: user.id,
      id: vehicleInfo?.id || `vi_${Date.now()}`,
      updated_at: new Date().toISOString(),
      created_at: vehicleInfo?.created_at || new Date().toISOString()
    }
    
    saveUserData(STORAGE_KEYS.vehicleInfo, user.id, updated)
    setVehicleInfo(updated)
    return updated
  }

  async function updateInsuranceInfo(data: Partial<InsuranceInfo>) {
    if (!user) throw new Error('User not authenticated')
    
    const updated: InsuranceInfo = {
      ...insuranceInfo,
      ...data,
      user_id: user.id,
      id: insuranceInfo?.id || `ii_${Date.now()}`,
      updated_at: new Date().toISOString(),
      created_at: insuranceInfo?.created_at || new Date().toISOString()
    }
    
    saveUserData(STORAGE_KEYS.insuranceInfo, user.id, updated)
    setInsuranceInfo(updated)
    return updated
  }

  async function createProcessedForm(data: Partial<ProcessedForm>) {
    if (!user) throw new Error('User not authenticated')
    
    const newForm: ProcessedForm = {
      ...data,
      user_id: user.id,
      id: `pf_${Date.now()}`,
      form_type: data.form_type || 'unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const updatedForms = [newForm, ...processedForms]
    saveUserData(STORAGE_KEYS.processedForms, user.id, updatedForms)
    setProcessedForms(updatedForms)
    return newForm
  }

  async function addDocument(doc: Omit<Document, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    if (!user) throw new Error('User not authenticated')
    
    const newDoc: Document = {
      ...doc,
      user_id: user.id,
      id: `doc_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const updatedDocs = [newDoc, ...documents]
    saveUserData(STORAGE_KEYS.documents, user.id, updatedDocs)
    setDocuments(updatedDocs)
    return newDoc
  }

  async function deleteDocument(docId: string) {
    if (!user) throw new Error('User not authenticated')
    
    const updatedDocs = documents.filter(d => d.id !== docId)
    saveUserData(STORAGE_KEYS.documents, user.id, updatedDocs)
    setDocuments(updatedDocs)
  }

  return {
    loading,
    error,
    personalData,
    licenseInfo,
    vehicleInfo,
    insuranceInfo,
    processedForms,
    documents,
    updatePersonalData,
    updateLicenseInfo,
    updateVehicleInfo,
    updateInsuranceInfo,
    createProcessedForm,
    addDocument,
    deleteDocument,
    refreshData: loadAllData
  }
}
