import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Bell, MapPin, Clock, Phone,
  Plus, X, Check, AlertTriangle
} from 'lucide-react';

export default function IDGuardWebsite() {
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  // Load initial data
  useEffect(() => {
    setEmergencyContacts([
      { id: 1, name: 'Mom', phone: '+91 98765 43210', relation: 'Mother' },
      { id: 2, name: 'Dad', phone: '+91 98765 43211', relation: 'Father' }
    ]);
    setAttendanceRecords([
      { id: 1, date: '2025-11-05', time: '09:15 AM', location: 'Main Campus Library', status: 'Present' },
      { id: 2, date: '2025-11-04', time: '09:10 AM', location: 'Main Campus Library', status: 'Present' },
      { id: 3, date: '2025-11-03', time: '09:20 AM', location: 'Main Campus Library', status: 'Present' }
    ]);
  }, []);

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = { id: Date.now(), ...newContact };
      setEmergencyContacts([...emergencyContacts, contact]);
      setNewContact({ name: '', phone: '', relation: '' });
      setShowContactForm(false);
    }
  };

  const handleDeleteContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
  };

  const simulateSOSAlert = () => {
    const newAlert = {
      id: Date.now(),
      name: 'John Doe',
      time: new Date().toLocaleString(),
      location: 'Pune, Maharashtra',
      coordinates: '18.5204° N, 73.8567° E'
    };
    setSosAlerts([newAlert, ...sosAlerts]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-pulse flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <p className="font-bold">🚨 SOS ALERT SENT!</p>
            <p className="text-sm">Emergency contacts notified</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ID Guard</h1>
              <p className="text-xs text-gray-500">Safety & Attendance System</p>
            </div>
          </div>
          <button
            onClick={simulateSOSAlert}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition flex items-center space-x-2"
          >
            <Bell className="w-5 h-5" />
            <span>Test SOS Alert</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex sm:justify-center space-x-1 min-w-max">
            {[
              { id: 'home', label: 'Home', icon: Shield },
              { id: 'contacts', label: 'Emergency Contacts', icon: Users },
              { id: 'alerts', label: 'SOS Alerts', icon: Bell },
              { id: 'attendance', label: 'Attendance', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 sm:px-6 border-b-2 text-sm sm:text-base transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        {/* HOME */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Welcome to ID Guard</h2>
              <p className="text-lg sm:text-xl mb-6">Your personal safety companion and smart attendance system</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: 'Emergency SOS', desc: 'Send GPS location instantly' },
                  { icon: MapPin, title: 'Real-time Tracking', desc: 'GPS-based attendance sharing' },
                  { icon: Clock, title: 'RFID Access', desc: 'Seamless facility access' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur rounded-lg p-4">
                    <item.icon className="w-8 h-8 mb-2 mx-auto sm:mx-0" />
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-800">Emergency Contacts</h2>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add Contact</span>
              </button>
            </div>

            {showContactForm && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold mb-4">Add New Emergency Contact</h3>
                <div className="space-y-4">
                  {['name', 'phone', 'relation'].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                      <input
                        type="text"
                        value={newContact[field]}
                        onChange={(e) => setNewContact({ ...newContact, [field]: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col sm:flex-row sm:space-x-3 gap-3">
                    <button
                      onClick={handleAddContact}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                    >
                      Save Contact
                    </button>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-3">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.relation}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-800">Attendance Records</h2>
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <p className="text-sm text-gray-500">Total Present</p>
                <p className="text-2xl font-bold text-green-600">{attendanceRecords.length} days</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Time</th>
                    <th className="px-6 py-4 text-left">Location</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium">{record.date}</td>
                      <td className="px-6 py-4">{record.time}</td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{record.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6" />
            <span className="text-xl font-bold">ID Guard</span>
          </div>
          <p className="text-gray-400">Making life safer and smoother, one card at a time</p>
          <p className="text-sm text-gray-500 mt-4">© 2025 ID Guard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
