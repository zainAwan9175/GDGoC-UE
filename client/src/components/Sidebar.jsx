import React from 'react';
import { Users, Calendar, History } from 'lucide-react';
import { Button } from './ui/button';

const Sidebar = ({ setActiveSection, googleColors }) => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: googleColors.blue }}>
          GDGOC Admin
        </h2>
        <div className="space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveSection('team')}
          >
            <Users className="mr-2 h-5 w-5" style={{ color: googleColors.red }} />
            Team Management
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveSection('events')}
          >
            <Calendar className="mr-2 h-5 w-5" style={{ color: googleColors.green }} />
            Event Management
          </Button>
         
        </div>
      </div>
    </div>
  );
};

export default Sidebar;