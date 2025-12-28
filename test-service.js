const service = require('./src/services/marketIndices.service.js');

console.log('Service type:', typeof service);
console.log('Service keys:', Object.keys(service));
console.log('Has forceInitialUpdate?', typeof service.forceInitialUpdate);
console.log('Has startAutoUpdate?', typeof service.startAutoUpdate);
console.log('Has getAllIndices?', typeof service.getAllIndices);
console.log('Has updateAllIndices?', typeof service.updateAllIndices);
console.log('Constructor:', service.constructor.name);

// Try calling the method
console.log('\n--- Testing method call ---');
try {
  console.log('Calling isMarketOpen():', service.isMarketOpen());
} catch (e) {
  console.error('Error:', e.message);
}
