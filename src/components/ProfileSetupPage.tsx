import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserData } from '../hooks/useUserData'
import { Link, useNavigate } from 'react-router-dom'

type TabType = 'personal' | 'license' | 'vehicle' | 'insurance'

const ProfileSetupPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { 
    personalData, 
    licenseInfo, 
    vehicleInfo, 
    insuranceInfo,
    updatePersonalData,
    updateLicenseInfo,
    updateVehicleInfo,
    updateInsuranceInfo
  } = useUserData()
  
  const [activeTab, setActiveTab] = useState<TabType>('personal')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form states
  const [personal, setPersonal] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '',
    email: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: ''
  })

  const [license, setLicense] = useState({
    license_number: '',
    license_class: '',
    issued_date: '',
    expiration_date: '',
    restrictions: '',
    endorsements: '',
    issuing_state: ''
  })

  const [vehicle, setVehicle] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    color: '',
    license_plate: '',
    odometer_reading: '',
    registration_number: '',
    registration_expiration: '',
    title_number: '',
    purchase_date: '',
    purchase_price: ''
  })

  const [insurance, setInsurance] = useState({
    provider: '',
    policy_number: '',
    coverage_type: '',
    policy_start_date: '',
    policy_expiration: '',
    agent_name: '',
    agent_phone: ''
  })

  // Load existing data into forms
  useEffect(() => {
    if (personalData) {
      setPersonal({
        first_name: personalData.first_name || '',
        last_name: personalData.last_name || '',
        middle_name: personalData.middle_name || '',
        date_of_birth: personalData.date_of_birth || '',
        email: personalData.email || '',
        phone: personalData.phone || '',
        street_address: personalData.street_address || '',
        city: personalData.city || '',
        state: personalData.state || '',
        zip_code: personalData.zip_code || '',
        country: personalData.country || 'USA',
        emergency_contact_name: personalData.emergency_contact_name || '',
        emergency_contact_relationship: personalData.emergency_contact_relationship || '',
        emergency_contact_phone: personalData.emergency_contact_phone || ''
      })
    }
  }, [personalData])

  useEffect(() => {
    if (licenseInfo) {
      setLicense({
        license_number: licenseInfo.license_number || '',
        license_class: licenseInfo.license_class || '',
        issued_date: licenseInfo.issued_date || '',
        expiration_date: licenseInfo.expiration_date || '',
        restrictions: licenseInfo.restrictions || '',
        endorsements: licenseInfo.endorsements || '',
        issuing_state: licenseInfo.issuing_state || ''
      })
    }
  }, [licenseInfo])

  useEffect(() => {
    if (vehicleInfo) {
      setVehicle({
        vin: vehicleInfo.vin || '',
        make: vehicleInfo.make || '',
        model: vehicleInfo.model || '',
        year: vehicleInfo.year?.toString() || '',
        color: vehicleInfo.color || '',
        license_plate: vehicleInfo.license_plate || '',
        odometer_reading: vehicleInfo.odometer_reading?.toString() || '',
        registration_number: vehicleInfo.registration_number || '',
        registration_expiration: vehicleInfo.registration_expiration || '',
        title_number: vehicleInfo.title_number || '',
        purchase_date: vehicleInfo.purchase_date || '',
        purchase_price: vehicleInfo.purchase_price?.toString() || ''
      })
    }
  }, [vehicleInfo])

  useEffect(() => {
    if (insuranceInfo) {
      setInsurance({
        provider: insuranceInfo.provider || '',
        policy_number: insuranceInfo.policy_number || '',
        coverage_type: insuranceInfo.coverage_type || '',
        policy_start_date: insuranceInfo.policy_start_date || '',
        policy_expiration: insuranceInfo.policy_expiration || '',
        agent_name: insuranceInfo.agent_name || '',
        agent_phone: insuranceInfo.agent_phone || ''
      })
    }
  }, [insuranceInfo])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      switch (activeTab) {
        case 'personal':
          await updatePersonalData(personal)
          break
        case 'license':
          await updateLicenseInfo(license)
          break
        case 'vehicle':
          await updateVehicleInfo({
            ...vehicle,
            year: vehicle.year ? parseInt(vehicle.year) : undefined,
            odometer_reading: vehicle.odometer_reading ? parseInt(vehicle.odometer_reading) : undefined,
            purchase_price: vehicle.purchase_price ? parseFloat(vehicle.purchase_price) : undefined
          })
          break
        case 'insurance':
          await updateInsuranceInfo(insurance)
          break
      }
      setMessage({ type: 'success', text: 'Saved successfully!' })
    } catch (error) {
      console.error('Error saving:', error)
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', complete: !!personalData },
    { id: 'license', label: 'License', complete: !!licenseInfo },
    { id: 'vehicle', label: 'Vehicle', complete: !!vehicleInfo },
    { id: 'insurance', label: 'Insurance', complete: !!insuranceInfo }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600">DocAutofill</Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <button onClick={handleSignOut} className="text-gray-600 hover:text-gray-900">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Setup</h1>
          <p className="text-gray-600 mt-2">Enter your information to autofill forms quickly.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.complete && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Personal Info Form */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={personal.first_name}
                      onChange={e => setPersonal({ ...personal, first_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      value={personal.middle_name}
                      onChange={e => setPersonal({ ...personal, middle_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Michael"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={personal.last_name}
                      onChange={e => setPersonal({ ...personal, last_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={personal.date_of_birth}
                      onChange={e => setPersonal({ ...personal, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={personal.email}
                      onChange={e => setPersonal({ ...personal, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={personal.phone}
                    onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={personal.street_address}
                    onChange={e => setPersonal({ ...personal, street_address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={personal.city}
                      onChange={e => setPersonal({ ...personal, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Los Angeles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={personal.state}
                      onChange={e => setPersonal({ ...personal, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={personal.zip_code}
                      onChange={e => setPersonal({ ...personal, zip_code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="90001"
                    />
                  </div>
                </div>

                <hr className="my-6" />
                <h3 className="font-semibold text-gray-900">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={personal.emergency_contact_name}
                      onChange={e => setPersonal({ ...personal, emergency_contact_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={personal.emergency_contact_relationship}
                      onChange={e => setPersonal({ ...personal, emergency_contact_relationship: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Spouse"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={personal.emergency_contact_phone}
                      onChange={e => setPersonal({ ...personal, emergency_contact_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* License Form */}
            {activeTab === 'license' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                    <input
                      type="text"
                      value={license.license_number}
                      onChange={e => setLicense({ ...license, license_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="D1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Class</label>
                    <select
                      value={license.license_class}
                      onChange={e => setLicense({ ...license, license_class: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select class</option>
                      <option value="C">Class C - Standard</option>
                      <option value="M">Class M - Motorcycle</option>
                      <option value="A">Class A - Commercial</option>
                      <option value="B">Class B - Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={license.issued_date}
                      onChange={e => setLicense({ ...license, issued_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <input
                      type="date"
                      value={license.expiration_date}
                      onChange={e => setLicense({ ...license, expiration_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuing State</label>
                  <input
                    type="text"
                    value={license.issuing_state}
                    onChange={e => setLicense({ ...license, issuing_state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="California"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restrictions</label>
                    <input
                      type="text"
                      value={license.restrictions}
                      onChange={e => setLicense({ ...license, restrictions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Corrective lenses"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endorsements</label>
                    <input
                      type="text"
                      value={license.endorsements}
                      onChange={e => setLicense({ ...license, endorsements: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Motorcycle"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Form */}
            {activeTab === 'vehicle' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                    <input
                      type="number"
                      value={vehicle.year}
                      onChange={e => setVehicle({ ...vehicle, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                    <input
                      type="text"
                      value={vehicle.make}
                      onChange={e => setVehicle({ ...vehicle, make: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Toyota"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                    <input
                      type="text"
                      value={vehicle.model}
                      onChange={e => setVehicle({ ...vehicle, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Camry"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                    <input
                      type="text"
                      value={vehicle.vin}
                      onChange={e => setVehicle({ ...vehicle, vin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1HGBH41JXMN109186"
                      maxLength={17}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      value={vehicle.color}
                      onChange={e => setVehicle({ ...vehicle, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Silver"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input
                      type="text"
                      value={vehicle.license_plate}
                      onChange={e => setVehicle({ ...vehicle, license_plate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ABC1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Odometer Reading</label>
                    <input
                      type="number"
                      value={vehicle.odometer_reading}
                      onChange={e => setVehicle({ ...vehicle, odometer_reading: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                    <input
                      type="text"
                      value={vehicle.registration_number}
                      onChange={e => setVehicle({ ...vehicle, registration_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Expiration</label>
                    <input
                      type="date"
                      value={vehicle.registration_expiration}
                      onChange={e => setVehicle({ ...vehicle, registration_expiration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title Number</label>
                    <input
                      type="text"
                      value={vehicle.title_number}
                      onChange={e => setVehicle({ ...vehicle, title_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={vehicle.purchase_date}
                      onChange={e => setVehicle({ ...vehicle, purchase_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                    <input
                      type="number"
                      value={vehicle.purchase_price}
                      onChange={e => setVehicle({ ...vehicle, purchase_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Insurance Form */}
            {activeTab === 'insurance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider *</label>
                    <input
                      type="text"
                      value={insurance.provider}
                      onChange={e => setInsurance({ ...insurance, provider: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State Farm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number *</label>
                    <input
                      type="text"
                      value={insurance.policy_number}
                      onChange={e => setInsurance({ ...insurance, policy_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="POL-12345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Type</label>
                  <select
                    value={insurance.coverage_type}
                    onChange={e => setInsurance({ ...insurance, coverage_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select coverage</option>
                    <option value="Liability">Liability Only</option>
                    <option value="Collision">Collision</option>
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Full">Full Coverage</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Start Date</label>
                    <input
                      type="date"
                      value={insurance.policy_start_date}
                      onChange={e => setInsurance({ ...insurance, policy_start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Expiration</label>
                    <input
                      type="date"
                      value={insurance.policy_expiration}
                      onChange={e => setInsurance({ ...insurance, policy_expiration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <hr className="my-6" />
                <h3 className="font-semibold text-gray-900">Agent Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                    <input
                      type="text"
                      value={insurance.agent_name}
                      onChange={e => setInsurance({ ...insurance, agent_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent Phone</label>
                    <input
                      type="tel"
                      value={insurance.agent_phone}
                      onChange={e => setInsurance({ ...insurance, agent_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfileSetupPage
