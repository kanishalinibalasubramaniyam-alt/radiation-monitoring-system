import React, { useState, useRef } from 'react';
import { MapPin, Search, Plus, Loader, X } from 'lucide-react';
import { mapService, MapLocation, SearchResult } from '../services/mapService';
import { radiationService, RadiationData } from '../services/radiationService';

interface MappingScreenProps {
  onBack: () => void;
}

const MappingScreen: React.FC<MappingScreenProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocations, setSearchedLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(false);

  // Search autocomplete states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // No initialization needed for simplified version

  // Handle search input changes
  const handleSearchInputChange = async (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setSearchLoading(true);
        try {
          const suggestions = await mapService.searchPlaces(value);
          setSearchSuggestions(suggestions);
        } catch (error) {
          console.error('Search suggestions error:', error);
          setSearchSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300);
    } else {
      setSearchSuggestions([]);
    }
  };

  // Handle search
  const handleSearch = async (selectedSuggestion?: SearchResult) => {
    const query = selectedSuggestion ? selectedSuggestion.description : searchQuery;
    if (!query.trim()) return;

    setLoading(true);
    try {
      let coordinates: {lat: number, lng: number} | null = null;
      let locationName = query;

      if (selectedSuggestion) {
        const placeDetails = await mapService.getPlaceDetails(selectedSuggestion.place_id);
        if (placeDetails) {
          coordinates = { lat: placeDetails.lat, lng: placeDetails.lng };
          locationName = placeDetails.address;
        }
      } else {
        coordinates = await mapService.geocodeAddress(query);
      }

      if (!coordinates) {
        alert(`Could not find location: ${query}`);
        return;
      }

      const radiationData = await radiationService.getRadiationData(coordinates.lat, coordinates.lng);
      if (!radiationData) {
        alert(`Could not get radiation data for: ${query}`);
        return;
      }

      const newLocation: MapLocation = {
        id: `${coordinates.lat}_${coordinates.lng}_${Date.now()}`,
        name: locationName,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        radiationData
      };

      setSearchedLocations(prev => [...prev, newLocation]);
      setSearchQuery('');

      const statusEmoji = radiationData.status === 'safe' ? '🟢' : radiationData.status === 'warning' ? '🟡' : '🔴';
      alert(`${statusEmoji} Radiation at ${locationName}: ${radiationData.level} µSv/h (${radiationData.status.toUpperCase()})`);

    } catch (error) {
      console.error('Search error:', error);
      alert(`Error searching for location: ${query}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear all locations
  const clearAllLocations = () => {
    if (window.confirm('Clear all searched locations?')) {
      setSearchedLocations([]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Search Bar */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="text-slate-400" size={24} />
            <input
              type="text"
              placeholder="Search locations (e.g., 'Central Park')..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-transparent border-none outline-none text-lg w-full font-medium placeholder-slate-400"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !searchQuery.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                >
                  <div className="font-medium text-slate-800">{suggestion.description}</div>
                  {suggestion.structured_formatting?.secondary_text && (
                    <div className="text-sm text-slate-500">{suggestion.structured_formatting.secondary_text}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Clear All Button */}
          {searchedLocations.length > 0 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={clearAllLocations}
                className="px-4 py-2 rounded-full text-sm font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-2"
              >
                <X size={14} />
                Clear All Locations ({searchedLocations.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {searchedLocations.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="mx-auto mb-4 text-slate-300" size={48} />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No locations searched yet</h3>
              <p className="text-slate-500">Search for a location above to check its radiation levels</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Radiation Results</h2>
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {searchedLocations.length} location{searchedLocations.length !== 1 ? 's' : ''}
                </span>
              </div>

              {searchedLocations.map((location) => {
                const level = location.radiationData?.level || 0;
                const status = location.radiationData?.status || 'safe';

                return (
                  <div
                    key={location.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          status === 'danger' ? 'bg-rose-50 text-rose-600' :
                          status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{location.name}</h3>
                          <p className="text-sm text-slate-500">
                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                        status === 'danger' ? 'bg-rose-100 text-rose-700' :
                        status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-slate-800">{level.toFixed(2)}</p>
                        <p className="text-sm text-slate-500">µSv/h (microsieverts per hour)</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Last updated</p>
                        <p className="text-sm font-medium text-slate-700">
                          {new Date(location.radiationData?.timestamp || '').toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default MappingScreen;
