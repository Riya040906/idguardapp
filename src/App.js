import React, { useState, useEffect } from 'react';
import { Shield, Users, Bell, MapPin, Clock, Phone, Mail, Plus, X, Check, AlertTriangle } from 'lucide-react';

export default function IDGuardWebsite() {
  const [activeTab, setActiveTab] = useState('home');
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  // Load data from memory on mount
  useEffect(() => {
    const savedContacts = [
      { id: 1, name: 'Mom', phone: '+91 98765 43210', relation: 'Mother' },
      { id: 2, name: 'Dad', phone: '+91 98765 43211', relation: 'Father' }
    ];
    const savedAttendance = [
      { id: 1, date: '2025-11-05', time: '09:15 AM', location: 'Main Campus Library', status: 'Present' },
      { id: 2, date: '2025-11-04', time: '09:10 AM', location: 'Main Campus Library', status: 'Present' },
      { id: 3, date: '2025-11-03', time: '09:20 AM', location: 'Main Campus Library', status: 'Present' }
    ];
    setEmergencyContacts(savedContacts);
    setAttendanceRecords(savedAttendance);
  }, []);

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = {
        id: Date.now(),
        ...newContact
      };
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
      {/* Notification Popup */}
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition flex items-center space-x-2"
          >
            <Bell className="w-5 h-5" />
            <span>Test SOS Alert</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'home', label: 'Home', icon: Shield },
              { id: 'contacts', label: 'Emergency Contacts', icon: Users },
              { id: 'alerts', label: 'SOS Alerts', icon: Bell },
              { id: 'attendance', label: 'Attendance', icon: Clock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-4xl font-bold mb-4">Welcome to ID Guard</h2>
              <p className="text-xl mb-6">Your personal safety companion and smart attendance system</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <Shield className="w-8 h-8 mb-2" />
                  <h3 className="font-bold mb-1">Emergency SOS</h3>
                  <p className="text-sm">Send GPS location to trusted contacts instantly</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <MapPin className="w-8 h-8 mb-2" />
                  <h3 className="font-bold mb-1">Real-time Tracking</h3>
                  <p className="text-sm">GPS-based attendance and location sharing</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <Clock className="w-8 h-8 mb-2" />
                  <h3 className="font-bold mb-1">RFID Access</h3>
                  <p className="text-sm">Seamless attendance and facility access</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Press SOS Button</p>
                      <p className="text-sm text-gray-600">Activate emergency alert on your ID card</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">GSM Sends SMS</p>
                      <p className="text-sm text-gray-600">Real-time GPS location sent to contacts</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2 mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Buzzer Alerts Nearby</p>
                      <p className="text-sm text-gray-600">Loud alarm notifies people around you</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-purple-600" />
                  Features
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>GPS-based attendance tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>RFID/NFC access control</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Emergency contact management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Real-time SOS alerts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span>Buzzer alarm system</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
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
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Relation</label>
                    <input
                      type="text"
                      value={newContact.relation}
                      onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Mother, Father, Friend"
                    />
                  </div>
                  <div className="flex space-x-3">
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

            <div className="grid md:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOS Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Received SOS Alerts</h2>
            {sosAlerts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No SOS alerts received yet</p>
                <p className="text-sm text-gray-400 mt-2">Click "Test SOS Alert" button to simulate an alert</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sosAlerts.map(alert => (
                  <div key={alert.id} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-red-100 rounded-full p-3">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-red-600">EMERGENCY ALERT</h3>
                          <p className="text-gray-600 mt-1">From: <span className="font-semibold">{alert.name}</span></p>
                          <p className="text-sm text-gray-500 mt-2">Time: {alert.time}</p>
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center space-x-2 text-gray-700">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span className="font-medium">Location: {alert.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600 text-sm">
                              <span>GPS: {alert.coordinates}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                          View Map
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">
                          Call Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-800">Attendance Records</h2>
              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <p className="text-sm text-gray-500">Total Present</p>
                <p className="text-2xl font-bold text-green-600">{attendanceRecords.length} days</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
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