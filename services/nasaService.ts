import { NASA_API_KEY } from '../constants';
import { EonetEvent } from '../types';

const EONET_API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';

export const fetchNaturalEvents = async (categories: string[]): Promise<EonetEvent[]> => {
  if (categories.length === 0) {
    return [];
  }
  
  const categoryParams = categories.join(',');
  const url = `${EONET_API_URL}?api_key=${NASA_API_KEY}&category=${categoryParams}&status=open&limit=500`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NASA EONET API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return data.events as EonetEvent[];
  } catch (error) {
    console.error("Failed to fetch natural events:", error);
    throw error;
  }
};
