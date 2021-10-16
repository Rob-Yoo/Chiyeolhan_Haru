import { getDate } from 'utils/timeUtil';

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

export const todoDataModel = (data) => {
	return {
		id: data.id,
        startTime: data.startTime,
        finishTime: data.finishTime,
        latitude: data.latitude,
        longitude: data.longitude,
        location: data.location,
        date: data.date,
        address: data.address,
        title: data.title,
        toDos: data.toDos,
	};
}

export const dbModel = (id, title, startTime, finishTime, location, address, longitude, latitude, isToday, taskList) => {
	const { TODAY, TOMORROW } = getDate();

	return {
		id,
        title,
        startTime,
        finishTime,
        location,
        address,
        longitude,
        latitude,
		date: isToday ? TODAY : TOMORROW,
		toDos: [...taskList],
		isDone: false,
		isSkip: false,
	};
}