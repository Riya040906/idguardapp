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
 * FINAL App.js
 * LIVE FETCH from Blynk:
 * V2 = RFID
 * V3 = Location
 * V4 = SOS alert
 */

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

  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const TOKEN = "lvThIBPsnFcLoZsiiyGL1L9ZGGX7vy8B";

  useEffect(() => {
    setEmergencyContacts([
      { id: 1, name: "Mom", phone: "+91 98765 43210", relation: "Mother" },
      { id: 2, name: "Dad", phone: "+91 98765 43211", relation: "Father" },
    ]);

    setAttendanceRecords([]);
  }, []);

  // ---------------------------
  // Fetch Attendance from V2 + V3
  // ---------------------------
  const fetchAttendance = async () => {
    setAttLoading(true);
    setAttError(null);

    try {
      const rfidRes = await fetch(
        `https://blynk.cloud/external/api/get?token=${TOKEN}&V2`
      );
      const locRes = await fetch(
        `https://blynk.cloud/external/api/get?token=${TOKEN}&V3`
      );

      const rfid = await rfidRes.text();
      const loc = await locRes.text();

      let lat = "—",
        lng = "—";
      if (loc.includes(",")) {
        const p = loc.split(",");
        lat = p[0];
        lng = p[1];
      }

      const record = {
        id: Date.now(),
        uid: rfid || "—",
        name: "Student",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        latitude: lat,
        longitude: lng,
        status: rfid ? "Present" : "—",
      };

      setAttendanceRecords([record]);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setAttError("Unable to fetch from Blynk Cloud");
    } finally {
      setAttLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ---------------------------
  // Fetch SOS from V4 (ONLY when ESP sends)
  // ---------------------------
  const fetchSOS = async () => {
    try {
      const sosRes = await fetch(
        `https://blynk.cloud/external/api/get?token=${TOKEN}&V4`
      );

      const sosText = await sosRes.text();

      if (!sosText || sosText === "null" || sosText.trim() === "") return;

      let coordinates = "—";
      let location = "SOS Alert";

      if (sosText.includes(":")) {
        const parts = sosText.split(":");
        coordinates = parts[1].trim();
        location = "Captured GPS";
      }

      const newAlert = {
        id: Date.now(),
        name: "Student",
        time: new Date().toLocaleString(),
        location,
        coordinates,
      };

      setSosAlerts((prev) => [newAlert, ...prev]);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    } catch (e) {
      console.log("SOS fetch error", e);
    }
  };

  // Fetch SOS when user opens SOS tab
  useEffect(() => {
    if (activeTab === "sos") {
      fetchSOS();
    }
  }, [activeTab]);

  // ---------------------------
  // Track Me Live
  // ---------------------------
  const trackMeLive = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
      },
      () => setLocationError("Permission denied or GPS unavailable.")
    );
  };

  // ---------------------------
  // SOS local simulation
  // ---------------------------
  const simulateSOSAlert = () => {
    const alert = {
      id: Date.now(),
      name: "John Doe",
      time: new Date().toLocaleString(),
      location: "Simulated GPS",
      coordinates: "18.52, 73.85",
    };
    setSosAlerts((p) => [alert, ...p]);
    setActiveTab("sos");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  // ---------------------------
  // Emergency Contact Handlers
  // ---------------------------
  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const c = { id: Date.now(), ...newContact };
      setEmergencyContacts((p) => [c, ...p]);
      setNewContact({ name: "", phone: "", relation: "" });
      setShowContactForm(false);
    }
  };

  const handleDeleteContact = (id) => {
    setEmergencyContacts((p) => p.filter((c) => c.id !== id));
  };

  // ---------------------------
  // UI BELOW (UNCHANGED)
  // ---------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-pulse flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <p className="font-bold">🚨 SOS ALERT RECEIVED!</p>
            <p className="text-sm">Emergency contacts notified</p>
          </div>
        </div>
      )}

      {/* ------------ HEADER ------------- */}
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
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------ NAVIGATION ------------- */}
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

      {/* ------------ MAIN CONTENT ------------- */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        {/* HOME */}
        {activeTab === "home" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                    Welcome to ID Guard
                  </h2>
                  <p className="text-lg sm:text-xl">
                    Your personal safety companion and smart attendance system
                  </p>
                </div>

                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={trackMeLive}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-lg inline-flex items-center space-x-2"
                  >
                    <MapPin className="w-5 h-5" />
                    <span>Track Me Live</span>
                  </button>
                </div>
              </div>

              {locationError && (
                <p className="mt-3 text-red-100 font-medium">{locationError}</p>
              )}
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {activeTab === "contacts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-800">
                Emergency Contacts
              </h2>

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
                <h3 className="text-xl font-bold mb-4">
                  Add New Emergency Contact
                </h3>
                <div className="space-y-4">
                  {["name", "phone", "relation"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {field}
                      </label>
                      <input
                        type="text"
                        value={newContact[field]}
                        onChange={(e) =>
                          setNewContact((p) => ({
                            ...p,
                            [field]: e.target.value,
                          }))
                        }
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
              {emergencyContacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full p-3">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{c.name}</h3>
                        <p className="text-sm text-gray-500">{c.relation}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{c.phone}</span>
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
              <h2 className="text-2xl font-bold text-gray-800">
                Active SOS Alerts
              </h2>

              <div className="flex items-center space-x-3">
                <button
                  onClick={trackMeLive}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Track Me Live</span>
                </button>

                <button
                  onClick={simulateSOSAlert}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Test SOS</span>
                </button>
              </div>
            </div>

            {locationError && (
              <p className="text-red-600">{locationError}</p>
            )}

            {sosAlerts.length === 0 ? (
              <p className="text-center text-gray-500">
                No active SOS alerts yet.
              </p>
            ) : (
              <div className="space-y-4">
                {sosAlerts.map((alert, index) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl shadow-md border border-gray-300 ${
                      index === 0
                        ? "bg-red-50 border-red-400"
                        : "bg-white"
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-red-600">
                      ⚠️ SOS Triggered by {alert.name}
                    </h3>
                    <p className="text-gray-700 mt-2">
                      <strong>Location:</strong> {alert.location}
                    </p>
                    <p className="text-gray-700">
                      <strong>Coordinates:</strong> {alert.coordinates}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>Time:</strong> {alert.time}
                    </p>

                    <button
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps?q=${alert.coordinates}`,
                          "_blank"
                        );
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
              <h2 className="text-3xl font-bold text-gray-800">
                Attendance Records
              </h2>

              <div className="bg-white rounded-lg px-4 py-2 shadow">
                <p className="text-sm text-gray-500">Total Present</p>
                <p className="text-2xl font-bold text-green-600">
                  {attendanceRecords.length} days
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      UID / Name
                    </th>
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
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Loading attendance...
                      </td>
                    </tr>
                  )}

                  {attError && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-red-600"
                      >
                        Error: {attError}
                      </td>
                    </tr>
                  )}

                  {!attLoading &&
                    !attError &&
                    attendanceRecords.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No attendance records.
                        </td>
                      </tr>
                    )}

                  {!attLoading &&
                    attendanceRecords.map((record, index) => (
                      <tr
                        key={record.id}
                        className={
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }
                      >
                        <td className="px-6 py-4 font-medium">
                          <div className="text-sm text-gray-700">
                            {record.uid}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.name}
                          </div>
                        </td>

                        <td className="px-6 py-4">{record.date}</td>
                        <td className="px-6 py-4">{record.time}</td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {record.latitude}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {record.longitude}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
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
                  alert(
                    "Live data comes from Blynk Cloud.\nV2 = RFID\nV3 = Location\nV4 = SOS alert"
                  );
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                How data arrives
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ------------ FOOTER ------------- */}
      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6" />
            <span className="text-xl font-bold">ID Guard</span>
          </div>
          <p className="text-gray-400">
            Making life safer and smoother, one card at a time
          </p>
          <p className="text-sm text-gray-500 mt-4">
            © 2025 ID Guard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
