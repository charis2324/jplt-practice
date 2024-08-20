function convertToLocalTimezone(isoDateTimeString) {
    // 2024-08-17T13:14:28.480264
    const [datePart, timePart] = isoDateTimeString.split('T');
    const [timeWithoutMicroseconds] = timePart.split('.');

    // Parse the date and time without microseconds into a Date object
    const utcDate = new Date(`${datePart}T${timeWithoutMicroseconds}Z`);

    // Get the local date and time components
    const localYear = utcDate.getFullYear();
    const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const localDay = String(utcDate.getDate()).padStart(2, '0');
    const localHours = String(utcDate.getHours()).padStart(2, '0');
    const localMinutes = String(utcDate.getMinutes()).padStart(2, '0');

    // Format the local date and time, excluding seconds and milliseconds
    const formattedLocalDate = `${localYear}-${localMonth}-${localDay} ${localHours}:${localMinutes}`;

    return formattedLocalDate;
}

export {convertToLocalTimezone};