import { Geojson, GeojsonReturn } from '..';

export const pointsToGeoPoints = async (url: string, body: Geojson) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return (await res.json()) as GeojsonReturn[];
  } catch (error) {
    console.log(error);
    return null;
  }
};
