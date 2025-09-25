// API service for communicating with the backend

// Configure API URL from environment or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Detect crop disease from image
 * @param imageData - Base64 encoded image or File object
 * @param cropType - Optional crop type for more accurate detection
 */
export async function detectDisease(imageData: string | File, cropType?: string) {
  try {
    let response;
    
    // If imageData is a File object
    if (imageData instanceof File) {
      const formData = new FormData();
      formData.append('image', imageData);
      
      if (cropType) {
        formData.append('crop_type', cropType);
      }
      
      response = await fetch(`${API_URL}/ml/detect`, {
        method: 'POST',
        body: formData,
      });
    } 
    // If imageData is a base64 string
    else {
      response = await fetch(`${API_URL}/ml/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          crop_type: cropType,
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error detecting disease');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in detectDisease:', error);
    throw error;
  }
}

/**
 * Get disease outbreaks data
 * @param params - Query parameters for filtering outbreaks
 */
export async function getOutbreaks(params?: { region?: string; crop?: string; days?: number }) {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.region) queryParams.append('region', params.region);
    if (params?.crop) queryParams.append('crop', params.crop);
    if (params?.days) queryParams.append('days', params.days.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/ml/outbreaks${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error fetching outbreaks');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getOutbreaks:', error);
    throw error;
  }
}

/**
 * Check health of ML service
 */
export async function checkMlHealth() {
  try {
    const response = await fetch(`${API_URL}/ml/health`);
    
    if (!response.ok) {
      return { success: false, mlService: 'unavailable' };
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking ML health:', error);
    return { success: false, mlService: 'unavailable' };
  }
}