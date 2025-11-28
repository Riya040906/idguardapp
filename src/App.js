import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Bell,
  MapPin,
  Clock,
  Phone,
  Plus,
  X,
  AlertTriangle,
} from "lucide-react";

/**
 * App.js - ID Guard (final version)
 *
 * - Attendance is fetched from a backend API (placeholder URL).
 * - Home & SOS have "Track Me Live" which opens Google Maps with current phone GPS.
 * - Attendance table displays Lat / Long labels (coming from backend hardware).
 *
 * Replace ATTENDANCE_API_URL with your real backend when ready.
 */

const ATTENDANCE_API_URL = "https://your-backend-url.com/attendance"; // <-- replace later

export default function IDGuardWebsite() {
  const [activeTab, setActiveTab] = useState("home");

  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relation: "",
  });

  // attendance fetch state
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState(null);

  // small location error state for track-me-live actions
  const [locationError, setLocationError] = useState(null);

  // Demo seed (contacts + optional example attendance)
  useEffect(() => {
    setEmergencyContacts([
      { id: 1, name: "Mom", phone: "+91 98765 43210", relation: "Mother" },
      { id: 2, name: "Dad", phone: "+91 98765 43211", relation: "Father" },
    ]);

    // optional initial local example record (will be overwritten by backend fetch)
    setAttendanceRecords((prev) =>
      prev.length === 0
        ? [
            {
              id: 1,
              uid: "RFID1234",
              name: "Demo Student",
              date: "2025-11-05",
              time: "09:15",
              latitude: "18.520400",
              longitude: "73.856700",
              status: "Present",
              location: "Campus-GPS",
            },
          ]
        : prev
    );
  }, []);

  // -------------------------
  // Fetch attendance from backend
  // -------------------------
  const fetchAttendance = async () => {
    setAttLoading(true);
    setAttError(null);
    try {
      // placeholder fetch - expected response: array of attendance records
      // Example record shape expected from backend:
      // { id, uid, name, date, time, latitude, longitude, status, location }
      const res = await fetch(ATTENDANCE_API_URL);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();

      // Basic validation / normalization: ensure array and string fields exist
      const normalized = Array.isArray(data)
        ? data.map((r) => ({
            id: r.id ?? Date.now() + Math.floor(Math.random() * 1000),
            uid: r.uid ?? r.userId ?? r.cardId ?? "—",
            name: r.name ?? r.fullname ?? "—",
            date: r.date ?? r.timestamp?.split?.("T")?.[0] ?? "—",
            time:
              r.time ??
              (r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"),
            latitude: r.latitude?.toString() ?? r.lat?.toString() ?? "—",
            longitude: r.longitude?.toString() ?? r.lng?.toString() ?? "—",
            status: r.status ?? "Present",
            location: r.location ?? "GPS Location",
          }))
        : [];

      setAttendanceRecords(normalized);
    } catch (err) {
      console.error("Fetch attendance error:", err);
      setAttError(err.message || "Failed to fetch attendance");
    } finally {
      setAttLoading(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    fetchAttendance();
    // note: you can add a polling interval here if you want automatic refresh
    // e.g. setInterval(fetchAttendance, 10000)
  }, []);

  // -------------------------
  // Track Me Live (Home & SOS)
  // -------------------------
  const trackMeLive = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported by this browser.");
      return;
    }
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        // Open Google Maps showing the device point
        const url = `https://www.google.com/maps?q=${lat},${lon}`;
        window.open(url, "_blank");
      },
      (err) => {
        console.warn("trackMeLive geolocation error:", err);
        setLocationError("Permission denied or unable to fetch location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // -------------------------
  // SOS: simulate local SOS alert (for UI only)
  // -------------------------
  const simulateSOSAlert = () => {
    // For simulation, try to capture device GPS for more realistic demo
    if (!navigator.geolocation) {
      const fallbackAlert = {
        id: Date.now(),
        name: "John Doe",
        time: new Date().toLocaleString(),
        location: "Unknown",
        coordinates: "—",
      };
      setSosAlerts((p) => [fallbackAlert, ...p]);
      setActiveTab("sos");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        const newAlert = {
          id: Date.now(),
          name: "John Doe",
          time: new Date().toLocaleString(),
          location: "Live GPS Captured",
          coordinates: `${lat}, ${lon}`,
        };
        setSosAlerts((p) => [newAlert, ...p]);
        setActiveTab("sos");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      },
      (err) => {
        console.warn("simulateSOSAlert error:", err);
        alert("Could not capture device location for SOS simulation.");
      }
    );
  };

  // -------------------------
  // Emergency contacts handlers
  // -------------------------
  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = { id: Date.now(), ...newContact };
      setEmergencyContacts((p) => [contact, ...p]);
      setNewContact({ name: "", phone: "", relation: "" });
      setShowContactForm(false);
    }
  };

  const handleDeleteContact = (id) => {
    setEmergencyContacts((p) => p.filter((c) => c.id !== id));
  };

  // -------------------------
  // UI render
  // -------------------------
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

          <div className="flex items-center gap-3">
            <button
              onClick={simulateSOSAlert}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition flex items-center space-x-2"
            >
              <Bell className="w-5 h-5" />
              <span>Test SOS Alert</span>
            </button>

            <button
              onClick={fetchAttendance}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full shadow-sm flex items-center space-x-2"
              title="Refresh attendance from backend"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex sm:justify-center space-x-1 min-w-max">
            {[
              { id: "home", label: "Home", icon: Shield },
              { id: "contacts", label: "Emergency Contacts", icon: Users },
              { id: "sos", label: "SOS Alerts", icon: Bell },
              { id: "attendance", label: "Attendance", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 sm:px-6 border-b-2 text-sm sm:text-base transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        {/* HOME */}
        {activeTab === "home" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2">Welcome to ID Guard</h2>
                  <p className="text-lg sm:text-xl">Your personal safety companion and smart attendance system</p>
                </div>

                {/* Track Me Live - Home */}
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={trackMeLive}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-lg inline-flex items-center space-x-2"
                    title="Open Google Maps to show your live location"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Track Me Live</span>
                  </button>
                </div>
              </div>

              {locationError && <p className="mt-3 text-red-100 font-medium">{locationError}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: Shield, title: "Emergency SOS", desc: "Send GPS location instantly" },
                  { icon: MapPin, title: "Real-time Tracking", desc: "GPS-based attendance sharing" },
                  { icon: Clock, title: "RFID Access", desc: "Seamless facility access" },
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
        {activeTab === "contacts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-800">Emergency Contacts</h2>

              <button
                onClick={() => setShowContactForm((s) => !s)}
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
                  {["name", "phone", "relation"].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                      <input
                        type="text"
                        value={newContact[field]}
                        onChange={(e) => setNewContact((p) => ({ ...p, [field]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter ${field}`}
                      />
                    </div>
                  ))}

                  <div className="flex flex-col sm:flex-row sm:space-x-3 gap-3">
                    <button onClick={handleAddContact} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                      Save Contact
                    </button>
                    <button onClick={() => setShowContactForm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact) => (
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

                    <button onClick={() => handleDeleteContact(contact.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
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

        {/* SOS */}
        {activeTab === "sos" && (
          <div className="sos-tab-container p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Active SOS Alerts</h2>

              <div className="flex items-center space-x-3">
                <button
                  onClick={trackMeLive}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Track Me Live</span>
                </button>

                <button onClick={simulateSOSAlert} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Test SOS</span>
                </button>
              </div>
            </div>

            {locationError && <p className="text-red-600">{locationError}</p>}

            {sosAlerts.length === 0 ? (
              <p className="text-center text-gray-500">No active SOS alerts yet.</p>
            ) : (
              <div className="space-y-4">
                {sosAlerts.map((alert, index) => (
                  <div key={alert.id} className={`p-4 rounded-xl shadow-md border border-gray-300 ${index === 0 ? "bg-red-50 border-red-400" : "bg-white"}`}>
                    <h3 className="text-lg font-semibold text-red-600">⚠️ SOS Triggered by {alert.name}</h3>
                    <p className="text-gray-700 mt-2"><strong>Location:</strong> {alert.location}</p>
                    <p className="text-gray-700"><strong>Coordinates:</strong> {alert.coordinates}</p>
                    <p className="text-gray-500 text-sm"><strong>Time:</strong> {alert.time}</p>

                    <button
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => {
                        // open map if coordinates available
                        if (alert.coordinates) {
                          window.open(`https://www.google.com/maps?q=${alert.coordinates}`, "_blank");
                        } else {
                          window.open("https://www.google.com/maps", "_blank");
                        }
                      }}
                    >
                      🗺 Track on Map
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="space-y-6 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-800">Attendance Records</h2>

              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <p className="text-sm text-gray-500">Total Present</p>
                <p className="text-2xl font-bold text-green-600">{attendanceRecords.length} days</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">UID / Name</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Time</th>
                    <th className="px-6 py-4 text-left">Lat</th>
                    <th className="px-6 py-4 text-left">Long</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attLoading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading attendance...</td>
                    </tr>
                  )}

                  {attError && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-red-600">Error: {attError}</td>
                    </tr>
                  )}

                  {!attLoading && !attError && attendanceRecords.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No attendance records found.</td>
                    </tr>
                  )}

                  {!attLoading && attendanceRecords.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 font-medium">
                        <div className="text-sm text-gray-700">{record.uid}</div>
                        <div className="text-xs text-gray-500">{record.name}</div>
                      </td>

                      <td className="px-6 py-4">{record.date}</td>
                      <td className="px-6 py-4">{record.time}</td>

                      <td className="px-6 py-4">
                        {record.latitude && record.latitude !== "—" ? (
                          <div className="text-sm text-gray-700">
                            <strong>Lat:</strong> {String(record.latitude)}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {record.longitude && record.longitude !== "—" ? (
                          <div className="text-sm text-gray-700">
                            <strong>Long:</strong> {String(record.longitude)}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${record.status === "Present" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                onClick={fetchAttendance}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Refresh Attendance
              </button>
              <button
                onClick={() => {
                  // quick debug: show sample record format
                  alert("Attendance must be sent from hardware backend. Expected fields: uid, name, date, time, latitude, longitude, status");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                How data arrives
              </button>
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
