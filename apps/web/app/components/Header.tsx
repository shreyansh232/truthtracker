import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-b from-black to-gray-400 text-transparent bg-clip-text mr-2">TruthTracker</h1>
          </div>
          
          {/* <div className="flex w-full md:w-auto items-center space-x-2">
            <div className="relative w-full md:w-80">
              <Input
                type="text"
                placeholder="Search news..."
                className="pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button size="sm">Search</Button>
          </div> */}
          
          {/* <nav className="hidden md:flex space-x-4">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Latest</Button>
            <Button variant="ghost">About</Button>
          </nav> */}
        </div>
      </div>
    </header>
  );
};

export default Header;