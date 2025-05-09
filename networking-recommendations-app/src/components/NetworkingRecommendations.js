import React, { useState, useEffect } from 'react';
import './NetworkingRecommendations.css';

const NetworkingRecommendations = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load JSON directly instead of Excel
        const response = await fetch('/data/networking_data.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        // Fall back to sample data
        const sampleData = [
          {
            "First Name": "Emily",
            "Last Name": "Daly",
            "Full Name": "Emily Daly",
            "email": "eagostino@gmail.com",
            "recommended_name_1": "Jennifer Cogliano",
            "rationale_1": "Both are in the 'Colleagues & Friends & Meeting & New & Product' cluster, suggesting shared interests in product manager and networking goals.",
            "recommended_name_2": "Rashmi Kapur",
            "rationale_2": "Both are in the 'Colleagues & Friends & Meeting & New & Product' cluster, likely overlapping in roles such as product manager and shared event goals."
          },
          {
            "First Name": "Jennifer",
            "Last Name": "Cogliano",
            "Full Name": "Jennifer Cogliano",
            "email": "jennifercogliano@gmail.com",
            "recommended_name_1": "Emily Daly",
            "rationale_1": "Both are in the 'Colleagues & Friends & Meeting & New & Product' cluster, suggesting shared interests in product manager and networking goals.",
            "recommended_name_2": "Matt Landers",
            "rationale_2": "Both are in the 'Colleagues & Friends & Meeting & New & Product' cluster, likely overlapping in roles such as product designer and shared event goals."
          },
          {
            "First Name": "Matt",
            "Last Name": "Landers",
            "Full Name": "Matt Landers",
            "email": "mlanders87@gmail.com",
            "recommended_name_1": "Rob Winikates",
            "rationale_1": "Both are in the 'Colleagues & Friends & Meeting & New & Product' cluster, suggesting shared interests in product designer and networking goals.",
            "recommended_name_2": "Jennifer Cogliano",
            "rationale_2": "Both are in the 'Colleagues & Friends & Meeting & New & Product' cluster, likely overlapping in roles such as product manager and shared event goals."
          }
        ];
        setData(sampleData);
        setError('Using sample data. JSON file could not be loaded.');
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
    <div className="container">
    <div className="logoContainer">
      <img src="/logo.png" alt="PCamp Boston Logo" className="logo" />
    </div>
      <h1 className="title">Who to meet at ProductCamp Boston?</h1>
      
      {loading ? (
        <p className="loading">Loading networking data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <div className="searchContainer">
            <input
              type="text"
              value={searchName}
              onChange={handleSearchChange}
              placeholder="Enter a name to find buddies..."
              className="searchInput"
            />
            <button
              onClick={findRecommendations}
              className="searchButton"
            >
              Find
            </button>
          </div>

          {searchPerformed && (
            <div className="recommendations">
              {recommendations ? (
                <div>
                  <h2 className="recommendationTitle">Recommendations for {recommendations.name}</h2>
                  <div className="recommendationList">
                    {recommendations.recommendations.map((rec, index) => (
                      <div key={index} className="recommendationCard">
                        <h3 className="recommendationName">
                          {index + 1}. {rec.name}
                        </h3>
                        <p className="recommendationRationale">{rec.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="noMatch">No matches found. Please try another name.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NetworkingRecommendations;