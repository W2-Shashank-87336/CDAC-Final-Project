import { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false
  });

  const handleToggle = async () => {
    try {
      await axios.patch('/api/admin/settings', {
        key: 'maintenanceMode',
        value: !settings.maintenanceMode
      });
      setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Maintenance Mode</h3>
          <p className="text-sm text-gray-500">
            Temporarily disable the platform for maintenance
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
export default Settings;