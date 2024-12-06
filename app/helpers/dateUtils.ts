export const getAmPm = (date: Date): string => {
    const hours = date.getHours();
    return hours < 12 ? 'AM' : 'PM';
  };

  export const get12HourFormat = (date: Date): number => {
    let hours = date.getHours();
    if (hours === 0) {
      hours = 12; 
    } else if (hours > 12) {
      hours = hours - 12; 
    }
    return hours;
  };