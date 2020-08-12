/// <reference lib="webworker" />

import { isYesterday, isWeekend, isMonday, isFriday } from 'date-fns';
import { MILLISECONDS_TO_SECONDS, HOUR_IN_SECONDS, MINUTES, WEEKEND_HOURS, START_WORKING_HOUR, FINISH_WORKING_HOUR, MIN_VALUE_TO_ADD_ZERO, MIN_VALUE_TO_SET_WARNING, MIN_VALUE_TO_SET_SUCCESS } from './constants/timer';

const convertSecondsToFormat = (milliSeconds: number) => {
  const days = Math.floor(milliSeconds / MILLISECONDS_TO_SECONDS);
  milliSeconds -= days * MILLISECONDS_TO_SECONDS;

  const hours = Math.floor(milliSeconds / HOUR_IN_SECONDS) % 24;
  milliSeconds -= hours * HOUR_IN_SECONDS;

  const minutes = Math.floor(milliSeconds / MINUTES) % MINUTES;
  milliSeconds -= minutes * MINUTES;

  const seconds = Math.floor(milliSeconds);

  return { hours, minutes, seconds, days };
};

const dateDiffInSeconds = (dateFuture: any, dateNow: any) => Math.abs(dateFuture - dateNow) / 1000;

const isWorkingHours = (date: Date) => date.getHours() >= START_WORKING_HOUR && date.getHours() < FINISH_WORKING_HOUR;

const setHourWork = (date: string | number | Date, hour: number) => {
  const dateWork = new Date(date);
  dateWork.setHours(hour);
  dateWork.setMinutes(0);
  dateWork.setSeconds(0);
  return dateWork;
};

addEventListener('message', ({ data }) => {
  const date = new Date(data);
  let counter;
  setInterval(() => {
    const now = new Date();
    const response = { difference: '00:00', state: 'danger' };
    if (!isWeekend(now) && isWorkingHours(now)) {
      counter = dateDiffInSeconds(date, now);
      if (!isWorkingHours(date) && !isWeekend(date) && !isYesterday(date) && !(isMonday(now) && isFriday(date))) { // time out and not weekend
        counter -= dateDiffInSeconds(date, setHourWork(data, START_WORKING_HOUR));
      }
      if (!isWorkingHours(date) && isFriday(date) && !isWeekend(date) && isMonday(now)) { // friday time out
        counter -= (WEEKEND_HOURS * HOUR_IN_SECONDS) - dateDiffInSeconds(date, setHourWork(data, 24)) - (START_WORKING_HOUR * HOUR_IN_SECONDS);
      }
      if (isWorkingHours(date) && isFriday(date) && !isWeekend(date) && isMonday(now)) { // friday time in
        // counter -= (WEEKEND_HOURS * HOUR_IN_SECONDS) - dateDiffInSeconds(date, setHourWork(data, 24)) - (START_WORKING_HOUR * HOUR_IN_SECONDS) + dateDiffInSeconds(setHourWork(date, FINISH_WORKING_HOUR), date);
        counter -= (WEEKEND_HOURS * HOUR_IN_SECONDS) + dateDiffInSeconds(setHourWork(data, FINISH_WORKING_HOUR), setHourWork(now, START_WORKING_HOUR));
      }
      if (isYesterday(date) && isWorkingHours(date)) { // yesterday
        counter -= dateDiffInSeconds(setHourWork(data, FINISH_WORKING_HOUR), setHourWork(now, START_WORKING_HOUR));
      }
      if (isYesterday(date) && !isWorkingHours(date)) { // yesterday time out
        counter -= dateDiffInSeconds(date, setHourWork(now, START_WORKING_HOUR));
      }
      if (isWeekend(date) && isMonday(now)) { // weekend and today is monday
        counter -= dateDiffInSeconds(date, setHourWork(now, START_WORKING_HOUR));
      }
    } else {
      now.setMonth(date.getMonth(), date.getDate());
      now.setHours(FINISH_WORKING_HOUR, 0, 0);
      counter = dateDiffInSeconds(date, now);
    }
    const { hours, minutes, seconds, days } = convertSecondsToFormat(counter);
    if (days < 1 && hours < 1) {
      const pendingMinutes = 59 - minutes;
      const pendingSeconds = 59 - seconds;
      response.difference = `0${hours}:${pendingMinutes <= MIN_VALUE_TO_ADD_ZERO ? '0' : ''}${pendingMinutes}:${pendingSeconds <= MIN_VALUE_TO_ADD_ZERO ? '0' : ''}${pendingSeconds}`;
      response.state = minutes < MIN_VALUE_TO_SET_SUCCESS ? 'success' : (minutes < MIN_VALUE_TO_SET_WARNING ? 'warning' : 'danger');
    }
    postMessage(JSON.stringify(response));
  }, 1000);
});
