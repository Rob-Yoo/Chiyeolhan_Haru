export const geofenceDataModel = (data) => {
	return {
		id: data.id,
		latitude: data.latitude,
		longitude: data.longitude,
		location: data.location,
		startTime: data.startTime,
		finishTime: data.finishTime,
		title: data.title
	};
}