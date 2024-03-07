import { Geojson, GeojsonReturn } from '..';

export const pointsToGeoPoints = async (body: Geojson) => {
  try {
    const res = await fetch(process.env.REACT_APP_ANNOTATOR_GEO_CONVERTER_API_URL || '', {
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
