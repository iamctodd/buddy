import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const NetworkingRecommendations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load Excel data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await window.fs.readFile('networking_recommendations2.xlsx');
        const workbook = XLSX.read(response, {
          cellDates: true,
        });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading Excel file:', err);
        setError('Failed to load networking data. Please try again.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
    setSearchPerformed(false);
  };

  // Find recommendations for the entered name
  const findRecommendations = () => {
    setSearchPerformed(true);
    
    if (!searchName.trim()) {
      setRecommendations(null);
      return;
    }
    
    const lowerSearchName = searchName.toLowerCase().trim();
    
    // Find the person by name (partial match on Full Name)
    const person = data.find(p => 
      p['Full Name']?.toLowerCase().includes(lowerSearchName)
    );
    
    if (person) {
      setRecommendations({
        name: person['Full Name'],
        recommendations: [
          {
            name: person['recommended_name_1'],
            rationale: person['rationale_1']
          },
          {
            name: person['recommended_name_2'],
            rationale: person['rationale_2']
          }
        ]
      });
    } else {
      setRecommendations(null);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Networking Recommendations</h1>
      
      {loading ? (
        <p className="text-gray-600">Loading networking data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="text"
              value={searchName}
              onChange={handleSearchChange}
              placeholder="Enter a name..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={findRecommendations}
              className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Find
            </button>
          </div>

          {searchPerformed && (
            <div className="mt-4">
              {recommendations ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Recommendations for {recommendations.name}</h2>
                  <div className="space-y-6">
                    {recommendations.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium text-blue-600 mb-2">
                          {index + 1}. {rec.name}
                        </h3>
                        <p className="text-gray-700">{rec.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-orange-500">No matches found. Please try another name.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkingRecommendations;
