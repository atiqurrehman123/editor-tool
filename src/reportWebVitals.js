import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Initialize web-vitals-help if available
let webVitalHelpersLogger = null;

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
  
  // Use web-vitals-help logger if available
  if (webVitalHelpersLogger) {
    // You can use the logger here if needed
    // webVitalHelpersLogger.info('Web vitals reported');
  }
};

// Export web-vitals-help logger for use elsewhere if needed
export { webVitalHelpersLogger };
export default reportWebVitals;
