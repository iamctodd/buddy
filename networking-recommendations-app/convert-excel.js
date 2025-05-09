const XLSX = require('xlsx');
const fs = require('fs');

// Create directories if they don't exist
if (!fs.existsSync('./public/data')) {
  fs.mkdirSync('./public/data', { recursive: true });
}

// Read the Excel file
const workbook = XLSX.readFile('./public/data/networking_recommendations.xlsx');

// Get the first worksheet
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Write to file
fs.writeFileSync('./public/data/networking_data.json', 
                JSON.stringify(jsonData, null, 2));

console.log('Conversion complete! JSON file saved to public/data/networking_data.json');